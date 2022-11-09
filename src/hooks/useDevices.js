import { useCallback, useState } from 'react'
import { API } from 'aws-amplify'

function useDevices () {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getDevices = useCallback(async function getDevices () {
    try {
      setLoading(true)
      const response = await API.get(
        'TelemonitoringAPI',
        '/telemonitoring/devices'
      )
      console.log('Devices: ', response)
      setData(response)
    } catch (error) {
      console.error(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return [{ data, loading, error }, { getDevices }]
}

export default useDevices
