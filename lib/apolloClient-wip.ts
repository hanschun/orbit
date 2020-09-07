// import fetch from 'isomorphic-unfetch'
// import {ApolloClient} from 'apollo-client'
// import {InMemoryCache} from 'apollo-cache-inmemory'
// import {HttpLink} from 'apollo-link-http'
// import {onError} from 'apollo-link-error'
// import {WebSocketLink} from 'apollo-link-ws'
// import {SubscriptionClient} from 'subscriptions-transport-ws'
// import auth0 from './auth0'
// import { access } from 'fs'

// let accessToken = null

// const requestAccessToken = async () => {
//   if (accessToken) return

//   const res = await fetch(`${process.env.APP_HOST}/api/session`)
//   if (res.ok) {
//     const json = await res.json()
//     accessToken = json.accessToken
//   } else {
//     accessToken = 'public'
//   }
// }

// // on 401 remove cached token from server
// const resetTokenLink = onError(({networkError}) => {
//   if (networkError && networkError.name === 'ServerError' &&
//   "statusCode" in networkError && networkError.statusCode === 401 ) {
//       accessToken = null
//     }
// })

// const createHttpLink = (headers) => {
//   const httpLink = new HttpLink({
//     uri: 'https://tidy-hog-92.hasura.app/v1/graphql',
//     credentials: 'include',
//     headers, //auth token is fetched on the server side
//     fetch,
//   })
//   return httpLink;
// }

// const createWSLink = () => {
//   return new WebSocketLink(
//     new SubscriptionClient('wss://tidy-hog-92.hasura.app/v1/graphql', {
//       lazy: true,
//       reconnect: true,
//       connectionParams: async () => {
//         await requestAccessToken() // a client side op
//         return {
//           headers: {
//             authorization: accessToken ? `Bearer ${accessToken}` : ''
//           }
//         }
//       }
//     })
//   )
// }

// export default (initialState, headers) => {
//   const ssrMode = typeof window === 'undefined'
//   let link
//   if (ssrMode) {
//     link = createHttpLink(headers) // server side fetch
//   } else {
//     link = createWSLink() // client side fetch
//   }
//   return new ApolloClient({
//     ssrMode,
//     link,
//     cache: new InMemoryCache().restore(initialState)
//   })
// }