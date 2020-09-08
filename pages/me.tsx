import React, {useEffect, useState} from 'react'
import fetch from 'isomorphic-unfetch';

export default () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/me')
      console.log('FETCHED MY USER DATA', res)
    }
    fetchUser();
  }, [])

  return (
  <>
    <div>MY PROFILE</div>
  </>)
}