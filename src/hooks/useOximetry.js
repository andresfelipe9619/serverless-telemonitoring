import { useCallback, useState } from 'react'
import { API } from 'aws-amplify'

function useOximetry () {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getOximetry = useCallback(async function getOximetry () {
    try {
      setLoading(true)
      const response = await API.get('TelemonitoringAPI', '/oximetry/timestamp')
      console.log('response', response)
      setData(response)
    } catch (error) {
      console.error(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return [{ data, loading, error }, { getOximetry }]
}

export default useOximetry
