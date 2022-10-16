import { API } from 'aws-amplify'
import { useCallback, useState } from 'react'

export default function useProfileData () {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getProfileData = useCallback(async function getProfileData ({ user }) {
    try {
      setLoading(true)
      const options = {
        queryStringParameters: {
          cognitoID: user.username
        }
      }
      const response = await API.get(
        'TelemonitoringAPI',
        '/users/cognitoID',
        options
      )
      console.log('response', response)
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
