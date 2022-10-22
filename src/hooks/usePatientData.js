import { API } from 'aws-amplify'
import { useCallback, useState } from 'react'

export default function usePatientData () {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getPatientData = useCallback(async function getPatientData (cognitoID) {
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

  const assignDevice = useCallback(async function assignDevice (
    patient,
    device_id
  ) {
    try {
      setLoading(true)
      const response = await API.put('TelemonitoringAPI', `/users/`, {
        body: {
          ...patient,
          device_id
        }
      })
      setData(prev => ({ ...prev, device_id }))
      console.log('Profile Data: ', response)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  },
  [])

  return [
    { data, loading, error },
    { getPatientData, assignDevice }
  ]
}
