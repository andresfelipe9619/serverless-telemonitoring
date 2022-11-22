import { API } from 'aws-amplify'
import { useCallback, useState } from 'react'
import { getFileFromS3 } from '../utils/aws'

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

  const getProfileData = useCallback(async function getProfileData(cognito_id) {
    try {
      setLoading(true)
      console.log('cognito_id', cognito_id)
      const response = await API.get(
        'TelemonitoringAPI',
        `/users/object/${cognito_id}`
      )
      console.log('Profile Data: ', response)
      if(response?.photo){
        response.photo = await getFileFromS3(response?.photo)
      }
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
