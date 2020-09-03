import React, { ReactNode } from 'react'
import App from 'next/app'
import Head from 'next/head'
import {ApolloProvider, NormalizedCacheObject} from '@apollo/react-hooks'
import createApolloClient from './apolloClient'
import auth0 from './auth0'
import { closestIndexTo } from 'date-fns'
import { NextPageContext } from 'next'

// on the client store the Apollo Client in a variable.
// prevents client reinitializing on transitions.
let globalApolloClient = null

/**
 * Install Apollo Client on NextPageContext or NextAppContext.
 * Allows use of apolloClient inside getStaticProps, getStaticPaths,
 * getServerSideProps
 * @param {NextPageContext | NextAppContext} ctx
 */
export const initOnContext = (ctx) => {
  const inAppContext = Boolean(ctx.ctx)

  // installing withApollo({ssr: true}) globally
  // disables project wide Automatic Static Optimization
  if (process.env.NODE_ENV === 'development') {
    if (inAppContext) {
      console.warn(
        'Warning: You have opted-out of Automatic Static Optimization due to `withApollo` in `pages/_app`.\n' +
        'Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n'
        )
    }
  }

  const apolloClient = 
  ctx.apolloClient ||
  initApolloClient(ctx.apolloState || {}, inAppContext ? ctx.ctx : ctx)

  // send Apollo Client as prop to the component to avoid calling initApollo()
  // otherwise it wiill be reinitialized without the context.
  apolloClient.toJSON = () => null
  
  // Add Apollo Client to NextPageContext & NextAppContext to allow
  // use under getInitialProps({apolloClient})
  ctx.apolloClient = apolloClient
  if (inAppContext) {
    ctx.ctx.apolloClient = apolloClient
  }

  return ctx
}

const getHeaders = async (ctx) => {
  if (typeof window !== 'undefined') return null
  if (typeof ctx.req === 'undefined') return null

  const s = await auth0.getSession(ctx.req)
  if (s && s.accessToken === null) return null

  return {
    authorization: `Bearer ${s ? s.accessToken : ''}`
  }
}

/**
 * On the server, always create a new Apollo client
 * On client, creates or reuses Apollo client
 * @param {NormalizedCacheObject} initialState
 * @param {NextPageContext} ctx
 */
const initApolloClient = (initialState, headers) => {
  // for every server-side request create a new client to prevent data sharing
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, headers)
  }

  // on client side, reuse the Apollo client
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState, headers)
  }

  return globalApolloClient
}

/**
 * Crete a withApollo HOC for use with Hasura
 * provides ApolloContext to next.js Page or AppTree
 * @param {Object} withApolloOptions
 * @param {Boolean} [withApolloOptions.ssr=false]
 * @returns {(PageComponent: ReactNode) => ReactNode}
 */
export const withApollo = ({ssr= true} = {}) => (PageComponent) => {
  const WithApollo = ({apolloClient, apolloState, ...pageProps}) => {
    let client;
    if (apolloClient) {
      // Happens on: getDataFromTree, next.js ssr
      client = apolloClient
    } else {
      // Happens on next.js csr
      // client = initApolloClient(apolloState, undefined)
      client = initApolloClient(apolloState, {})
    }

    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    )
  }

  // set the correct display name for development
  if (process.env.NODE_ENV !== 'production') {
    const displayName = PageComponent.displayName ||
                        PageComponent.name ||
                        'Component'
    WithApollo.displayName = `withApollo(${displayName})`
  }
  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (ctx) => {
      const {AppTree} = ctx
      // initialize Apollo Client, add to context to use in
      // PageComponent.getInitialProp
      const apolloClient =
        (ctx.apolloClient =
          initApolloClient(null, await getHeaders(ctx)))

      // run wrapped getInitialProps methods
      let pageProps = {}
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx)
      }

      // only run on server
      if (typeof window === 'undefined') {
        // when redirecting the response is finished.
        // do not continue to render.
        if (ctx.res && ctx.res.finished) {
          return pageProps
        }

        // if ssr is enabled
        if (ssr) {
          try {
            // run all GraphQl queries
            const {getDataFromTree} = await import('@apollo/react-ssr')
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient
                }}
              />
            )
          } catch (err) {
            // if an Apollo Client GraphQL error occurs, prevent crashing ssr
            // use data.error to handle the errors in components.
            // see: https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', err)
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect; needs to be cleared manually
          Head.rewind()
        }
      }

      // extract query data from Apollo store
      const apolloState = apolloClient.cache.extract()

      return {
        ...pageProps,
        apolloState
      }
    }
  }

  return WithApollo
}