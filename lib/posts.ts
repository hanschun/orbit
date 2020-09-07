import {User} from './classes/user'
import {Post} from './classes/post'
import {useQuery} from '@apollo/react-hooks'
import {useState, useEffect} from 'react'
import {GET_SOME_RECENT_POSTS, GET_POST_BY_PARAMS} from './queries/post-queries'

async function retrievePosts(limit: number = 20) {
  try {
    const {loading, error, data} = useQuery(GET_SOME_RECENT_POSTS, {
      variables: {limit}
    })
    if (loading) {
      console.log('LOADING')
      return []
    }
    if (error) {
      console.log('ERROR: ', error)
      console.error(error);
      return []
    }
    console.log('DATA: ', data)
    return data
  } catch(err) {
    console.log('ERROR! ', err)
  }
}

async function retrievePost(hash: string | string[], created_at: string | string[]): Promise<Post> {
  const {loading, error, data} = useQuery(GET_POST_BY_PARAMS, {
    variables: {hash, created_at}
  })
  if (loading) {
    return Promise.resolve(null)
  }
  if (error) {
    console.error(error)
    return Promise.resolve(null)
  }
  if (data) {
    const post = new Post(data)
    return post
  }
}

export async function getPostsData(limit: number = 100) {
  try {
    console.log('RETRIEVING POSTS!')
    const data = await retrievePosts(limit)
    console.log('RETRIEVED POSTS: ', data.length)
    return data.map(item => {
      const post = new Post(item)
      return {
        id: post.id,
        date: post.created_at,
        body: post.body.slice(0, 99)
      }
    })
  } catch(err) {
    return [];
  }
}

export function useFetchSomePosts(limit: number): Post[] {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  let isMounted = true

  useEffect(() => {
    if (!loading && posts.length > 0) {
      console.log('Do not run')
      return
    }
    setLoading(true)
    getPostsData(limit).then(posts => {
      if (isMounted) {
        console.log('POSTS: ', posts.length)
        setPosts(posts)
        setLoading(false)
      }
    })

    return(() => isMounted = false)
  }, [])

  return posts
}


export async function getAllPostIds() {
  try {
    const posts = await retrievePosts()
    return posts.map((post: Post) => {
      return {
        params: {
          id: post.id
        }
      }
    })
  } catch(err) {
    return [];
  }
  
}

export function useFetchPostIds() {
  const [loading, setLoading] = useState(true)
  const [ids, setIds] = useState([])
  let isMounted = true

  useEffect(() => {
    if (!loading && ids.length > 0) {
      return
    }
    setLoading(true)
    getPostsData().then(ids => {
      if (isMounted) {
        setIds(ids)
        setLoading(false)
      }
    })

    return(() => isMounted = false)
  }, [])

  return ids
}

export async function getPostData(hash: string | string[], created_at: string | string[]) {
  try {
    const post = await retrievePost(hash, created_at)
    return {
      id: post.id,
      body: post.body,
      title: post.body,
      date: post.created_at
    }
  } catch(err) {
    return null
  }
}

export function useFetchPost() {
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState(new Post(null))
  let isMounted = true

  useEffect(() => {
    if (!loading && post) {
      return
    }
    setLoading(true)
    getPostsData().then(p => {
      if (isMounted) {
        setPost(p)
        setLoading(false)
      }
    })

    return(() => isMounted = false)
  }, [])

  return post
}
