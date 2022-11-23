import { useCallback, useState } from 'react'
import { API } from 'aws-amplify'

function usePatients () {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getPatients = useCallback(async function getPatients (doctor) {
    try {
      setLoading(true)
      const options = {
        queryStringParameters: {
          doctor,
          role: 'PATIENT',
        }
      }
      const response = await API.get('TelemonitoringAPI', '/app/PK', options)
      console.log('Patients: ', response)
      setData(response)
    } catch (error) {
      console.error(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return [{ data, loading, error }, { getPatients }]
}

export default usePatients
