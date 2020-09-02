import useSWR from 'swr'

export function Profile({data, error}) {
  // const {data, error} = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}

module.exports = {Profile}