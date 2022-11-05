import { API } from 'aws-amplify'
import { useCallback, useState } from 'react'

export default function useUserProfile() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateUser = useCallback(async function updateUser(props) {
    try {
      setLoading(true)
      const response = await API.post('TelemonitoringAPI', `/users/`, {
        body: props
      })
      setData(props)
      console.log('User Response: ', response)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const getProfileData = useCallback(async function getProfileData(cognitoID) {
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


  return [{ data, loading, error }, { updateUser, getProfileData }]
}
