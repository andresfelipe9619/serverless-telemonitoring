import { useCallback, useState } from 'react'
import { API } from 'aws-amplify'
import { getFileFromS3 } from '../utils/aws'

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
          role: 'PATIENT'
        }
      }
      let response = await API.get('TelemonitoringAPI', '/app/PK', options)
      response = await Promise.all(
        response.map(async patient => {
          let photo = patient.photo || ''
          if (photo) {
            photo = await getFileFromS3(patient?.photo)
          }
          return { ...patient, photo }
        })
      )
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
