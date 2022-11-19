import { Loader, View } from '@aws-amplify/ui-react'
import React, { useEffect } from 'react'
import useTelemonitoring from '../../hooks/useTelemonitoring'
import ErrorAlert from '../error/ErrorAlert'
import Chart from '../reports/Chart'

export default function TelemonitoringPreview ({ device }) {
  const [
    { data, error, loading },
    { getTelemonitoringData }
  ] = useTelemonitoring()

  useEffect(() => {
    if (!device) return
    getTelemonitoringData(device)
    // eslint-disable-next-line
  }, [device])

  return (
    <View height='60vh'>
      {loading && <Loader variation='linear' />}
      <ErrorAlert error={error} />
      {!!data.length && <Chart data={data} />}
    </View>
  )
}
