import fetch from 'isomorphic-unfetch'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { WebSocketLink } from 'apollo-link-ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import auth0 from './auth0'
let accessToken = null
let accessDomain = `${process.env.DOMAIN}/api/session`
let accessResponse = null;
const requestAccessToken = async () => {
  if (accessToken && accessToken !== 'public') return
  const res = await fetch(accessDomain)
  accessResponse = res
  if (res.ok) {
    const json = await res.json()
    accessToken = json.accessToken
  } else {
    accessToken = 'public'
  }
}
// remove cached token on 401 from the server
const resetTokenLink = onError(({ networkError }) => {
  if (networkError && networkError.name === 'ServerError' && networkError.statusCode === 401) {
    accessToken = null
  }
})
const createHttpLink = (headers) => {
  const httpLink = new HttpLink({
    uri: 'https://tidy-hog-92.hasura.app/v1/graphql',
    credentials: 'include',
    headers, // auth token is fetched on the server side
    fetch,
  })
  return httpLink
}
const createWSLink = () => {
  return new WebSocketLink(
    new SubscriptionClient('wss://tidy-hog-92.hasura.app/v1/graphql', {
      lazy: true,
      reconnect: true,
      connectionParams: async () => {
        await requestAccessToken() // happens on the client
        return {
          headers: {
            authorization: accessToken ? `Bearer ${accessToken}` : 'Bearer public',
          },
        }
      },
    })
  )
}

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors)
      graphQLErrors.map(async({ message, extensions }) => {
        switch (extensions.code) {
          case "invalid-jwt":
            // refetch the jwt
            const oldHeaders = operation.getContext().headers
            await requestAccessToken()
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${accesToken}`
              }
            })
            // retry the request, returning the new observable
            return forward(operation)
            break
          default:
            // default case
            console.log('CURRENT ACCESS TOKEN: ', accessToken)
            await requestAccessToken()
            // console.log('UPDATED TOKEN: ', accessToken)
            // console.log('ACCESS DOMAIN: ', accessDomain)
            // console.log('ACCESS RESPONSE:', accessResponse)
            console.log('APOLLO ERROR EXTENSIONS CODE: ', extensions.code)
        }
      })
    if (networkError) {
      console.log(`[Apollo Network error]: ${networkError}`)
      // props.history.push("/network-error")
    }
  }
)

export default function createApolloClient(initialState, headers) {
  const ssrMode = typeof window === 'undefined'
  let link
  if (ssrMode) {
    link = createHttpLink(headers) // executed on server
  } else {
    link = createWSLink() // executed on client
  }
  return new ApolloClient({
    ssrMode: ssrMode,
    link: errorLink.concat(link),
    cache: new InMemoryCache().restore(initialState),
  })
}
