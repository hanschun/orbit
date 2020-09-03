import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import gql from 'graphql-tag'
import {User} from './user'

export const GET_ALL_POSTS = gql`
  query getAllPosts {
    posts(order_by: { created_at: desc }) {
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

export class Post {
  body: string;
  sender: User;
  hash: string;
  created_at: Date;
}

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // rm the file extension to create id
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    return {
      id, 
      ...(matterResult.data as { date: string, title: string})
    }
  })

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return
    }
  })
}


export function getAllPostIds(posts) {
  return posts.map((post: Post) => {
    const userName = posts.sender.name.join('-')
    return {
      params: {
        id: `${userName}`
      }
    }
  })
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  // gray-matter parsed post metadata
  const matterResult = matter(fileContents)
  // remark converting markdown to html string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()
  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string, title: string})
  }
}