import utilStyles from '../../styles/utils.module.css'
import Date from '../date'
import {useFetchSomePosts} from '../../lib/posts'
import Link from 'next/link'
import {useQuery} from '@apollo/react-hooks'
import {GET_SOME_RECENT_POSTS} from '../../lib/queries/post-queries'

export const PostsList = (props) => {
  const {loading, error, data} = useQuery(GET_SOME_RECENT_POSTS, {
    variables: {limit: 5},
    errorPolicy: 'all'
  })


  if (loading) {
    console.log('LOADING')
    return <div>Loading...</div>
  }
  if (error) {
    console.log('ERROR: ', error)
    return <div>An error occurred</div>
  }

  return (
    <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Posts: {data.length}</h2>
        <ul className={utilStyles.list}>
          {data.map(({id, created_at, body}) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                <a>{body}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={created_at} />
              </small>
            </li>
          ))}
        </ul>
      </section>
  )
}