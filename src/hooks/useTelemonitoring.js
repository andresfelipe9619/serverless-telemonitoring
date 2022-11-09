import { useCallback, useState } from 'react'
import { API } from 'aws-amplify'

function useTelemonitoring () {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getTelemonitoringData = useCallback(
    async function getTelemonitoringData (device_id, { size = 40 } = {}) {
      try {
        setLoading(true)
        const options = {
          queryStringParameters: {
            device_id,
            size
          }
        }
        const response = await API.get(
          'TelemonitoringAPI',
          '/telemonitoring/PK',
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
    },
    []
  )

  return [{ data, loading, error }, { getTelemonitoringData }]
}

export default useTelemonitoring
