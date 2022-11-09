import { Loader, View } from '@aws-amplify/ui-react'
import React, { useEffect } from 'react'
import useTelemonitoring from '../../hooks/useTelemonitoring'
import ErrorAlert from '../error/ErrorAlert'
import Chart from '../reports/Chart'

export default function TelemonitoringPreview () {
  const [
    { data, error, loading },
    { getTelemonitoringData }
  ] = useTelemonitoring()

  useEffect(() => {
    getTelemonitoringData(1)
    // eslint-disable-next-line
  }, [])

  return (
    <View height='60vh'>
      {loading && <Loader variation='linear' />}
      <ErrorAlert error={error} />
      {!!data.length && <Chart data={data} />}
    </View>
  )
}
