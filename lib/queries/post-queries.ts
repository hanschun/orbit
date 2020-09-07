import gql from 'graphql-tag'

export const GET_SOME_RECENT_POSTS = gql`
  query getSomeRecentPosts($limit: Int) {
    posts(order_by: {created_at: desc}, limit: $limit) {
      id
      body
      hash
      created_at
      sender {
        name
      }
    }
  }
`

export const GET_POST_BY_PARAMS = gql`
  query getPostByParams($hash: String, $ts: timestamptz) {
    posts(where: {hash: {_eq: $hash}, created_at: {_eq: $ts} }) {
      id
      body
      hash
      created_at
      sender {
        name
      }
    }
  }
`