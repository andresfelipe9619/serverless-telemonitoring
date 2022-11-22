import { useCallback, useState } from 'react'
import { API } from 'aws-amplify'

function useDoctors () {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getDoctors = useCallback(async function getDoctors () {
    try {
      setLoading(true)
      const options = {
        queryStringParameters: {
          role: 'doctor'
        }
      }
      const response = await API.get(
        'TelemonitoringAPI',
        '/users/cognito_id',
        options
      )
      console.log('Doctors: ', response)
      setData(response)
    } catch (error) {
      console.error(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return [{ data, loading, error }, { getDoctors }]
}

export default useDoctors
