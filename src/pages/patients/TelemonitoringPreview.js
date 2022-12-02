import { Loader, View } from '@aws-amplify/ui-react'
import React, { useEffect, useRef, useState } from 'react'
import useTelemonitoring from '../../hooks/useTelemonitoring'
import ErrorAlert from '../error/ErrorAlert'
import Chart from '../reports/Chart'
import format from 'date-fns/format'
import sub from 'date-fns/sub'

const DELAY = 2000
const SECONDS = DELAY / 1000
const FORMAT = 'yyyy-MM-dd HH:mm:ss'

export default function TelemonitoringPreview ({ device }) {
  const [{ data, error, loading }, { getTelemonitoringData }] =
    useTelemonitoring()
  const lastDevice = usePrevious(device)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!device) return

    function tick () {
      const concat = lastDevice === device
      const today = new Date()
      const filters = {
        concat,
        size: null,
        startDate: format(sub(today, { seconds: SECONDS }), FORMAT),
        endDate: format(today, FORMAT)
      }
      setCount(prev => ++prev)
      getTelemonitoringData(device, filters)
    }
    if (!count) {
      tick()
      setCount(1)
    } else {
      let id = setInterval(tick, DELAY)
      return () => clearInterval(id)
    }
    // eslint-disable-next-line
  }, [device, count])

  return (
    <View height='60vh'>
      <div style={{ height: '20px', width: '100%' }}>
        {loading && <Loader variation='linear' />}
      </div>
      <ErrorAlert error={error} />
      <Chart data={data || []} />
      {/* {<RealTimeChart data={data} />} */}
    </View>
  )
}

function usePrevious (value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref?.current
}
