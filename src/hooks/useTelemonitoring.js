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
        const response = await API.get('api', '/telemonitoring/timestamp')
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
