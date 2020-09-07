import useSWR from 'swr'

// this page, which was a stub to practice things with, needs refactoring
export default function Profile({data, error}) {
  // const {data, error} = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
