import React, {useEffect, useState} from 'react'
import { User } from '../lib/classes/user'
import { fetchUser } from '../lib/user'

export default () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/session')
      console.log('FETCHED SESSION DATA', res)
    }
    fetchUser();
  }, [])

  return (
  <>
    <div>MY PROFILE</div>
  </>)
}