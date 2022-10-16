import { Alert, Heading, Loader } from '@aws-amplify/ui-react'
import React, { useEffect } from 'react'
import useTelemonitoring from '../../hooks/useTelemonitoring'

export default function ReportsPage () {
  const [
    { data, error, loading },
    { getTelemonitoringData }
  ] = useTelemonitoring()

  useEffect(() => {
    getTelemonitoringData()
    // eslint-disable-next-line
  }, [])

  const haveData = !!data.length
  const showLoader = !haveData && loading

  return (
    <div>
      {error && (
        <Alert variation='error'>{error?.message || 'Algo salió mal'}</Alert>
      )}
      {showLoader && <Loader variation='linear' />}
      {haveData &&
        data.map((item, i) => (
          <Heading level={2}>
            {i} - {item.device_id}; HB: {item.HeartBeat}; SPO2: {item.Spo2}
          </Heading>
        ))}
    </div>
  )
}
