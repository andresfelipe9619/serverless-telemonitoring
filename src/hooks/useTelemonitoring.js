import { useCallback, useState } from 'react'
import { API } from 'aws-amplify'

function useTelemonitoring () {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getTelemonitoringData = useCallback(
    async function getTelemonitoringData (
      device_id,
      { size = 40, startDate, endDate, concat } = {}
    ) {
      try {
        setError(null)
        setLoading(true)
        const options = {
          queryStringParameters: {
            device_id,
            ...(size ? { size } : null),
            ...(startDate ? { start_date: startDate } : null),
            ...(endDate ? { end_date: endDate } : null)
          }
        }
        const response = await API.get(
          'TelemonitoringAPI',
          '/telemonitoring/PK',
          options
        )
        console.log('response', response)
        setData(prev => (concat ? prev.concat(response) : response))
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
