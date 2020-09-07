import React, {useEffect, useState} from 'react'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import {GetStaticProps, GetStaticPaths, GetServerSideProps} from 'next'


export default function Post() {
  const [posts, setPosts] = useState([])
  const postData = {
    title: 'Test',
    date: '2020-09-03T21:18:11.547762+00:00',
    body: '<p>Testing</p>'
  }
  // TODO: move to useEffect
  // const paths = await getAllPostIds()
  // const postData = await getPostData(params.id, params.date)
  // update to useEffect method using useApolloClient.query here

  return <Layout>
    <Head>
      <title>{postData.title}</title>
    </Head>
    <article>
      <h1 className={utilStyles.headingXl}>{postData.title}</h1>
      <div className={utilStyles.lightText}>
        <Date dateString={postData.date} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.body }} />
    </article>
  </Layout>
}
