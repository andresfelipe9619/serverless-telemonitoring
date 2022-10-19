import { useCallback, useState } from 'react'
import { API } from 'aws-amplify'

function useTelemonitoring () {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getTelemonitoringData = useCallback(
    async function getTelemonitoringData () {
      try {
        setLoading(true)
        const options = {
          queryStringParameters: {
            size: 100
          }
        }
        const response = await API.get(
          'TelemonitoringAPI',
          '/telemonitoring/timestamp',
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
