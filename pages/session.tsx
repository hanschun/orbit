import React, {useEffect, useState} from 'react'
import fetch from 'isomorphic-unfetch';

export default () => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch('/api/session')
      console.log('FETCHED SESSION DATA', res)
    }
    fetchSession();
  }, [])

  return (
  <>
    <div>SESSION DETAILS</div>
  </>)
}