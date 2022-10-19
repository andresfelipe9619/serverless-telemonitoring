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
    getTelemonitoringData()
    // eslint-disable-next-line
  }, [])

  return (
    <View height='20vh'>
      {loading && <Loader variation='linear' />}
      <ErrorAlert error={error} />
      {!!data.length && <Chart data={data} />}
    </View>
  )
}
