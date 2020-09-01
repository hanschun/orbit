import Link from 'next/link'
import Head from 'next/head'
import Layout from '../components/layout'

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About Orbit</title>
      </Head>
      <h1>About Orbit</h1>
      <p>Orbit is a social network that lets you connect with people who have the same interests.</p>
      <p>Try finding a Planet that interests you today!</p>
      <Link href="/"><a>Back to home</a></Link>
    </Layout>
  )
}