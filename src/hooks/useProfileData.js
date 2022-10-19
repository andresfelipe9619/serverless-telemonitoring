import { API } from 'aws-amplify'
import { useCallback, useState } from 'react'

export default function useProfileData () {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getProfileData = useCallback(async function getProfileData (cognitoID) {
    try {
      setLoading(true)
      console.log('cognitoID', cognitoID)
      const response = await API.get(
        'TelemonitoringAPI',
        `/users/object/${cognitoID}`
      )
      console.log('Profile Data: ', response)
      setData(response)
    } catch (error) {
      console.error(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return [{ data, loading, error }, { getProfileData }]
}
