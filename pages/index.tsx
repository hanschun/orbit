import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Login from '../components/auth/login'
import {useFetchUser} from '../lib/user'
import {withApollo} from '../lib/withApollo'
import {PostsList} from '../components/posts/posts-list'

const HomePage = () => {
  const { user, loading } = useFetchUser({required: true})

  if (!loading && !user) {
    return <Login />
  }
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>This is Orbit, a social media network built on subjects.</p>
        <p>People post to different Topic subjects in orbit of subject Planets.</p>
      </section>
      <PostsList />
    </Layout>
  )
}

export default withApollo()(HomePage)


// update to handle using apolloClient query, limit 5?
// export const getStaticProps: GetStaticProps = async () => {
//   const allPostsData = getSortedPostsData()
//   return {
//     props: {
//       allPostsData
//     }
//   }
// }