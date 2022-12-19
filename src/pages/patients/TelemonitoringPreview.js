import { Loader, View } from '@aws-amplify/ui-react'
import React, { useEffect, useRef, useState } from 'react'
import useTelemonitoring from '../../hooks/useTelemonitoring'
import ErrorAlert from '../error/ErrorAlert'
import Chart from '../reports/Chart'
import sub from 'date-fns/sub'
import set from 'date-fns/set'

const DELAY = 2000
const SECONDS = DELAY / 1000
const TESTING = false

export default function TelemonitoringPreview ({ device }) {
  const [{ data, error, loading }, { getTelemonitoringData }] =
    useTelemonitoring()
  const lastDevice = usePrevious(device)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!device) return

    function tick () {
      const concat = lastDevice === device
      let today = new Date()
      if (TESTING) {
        today = set(new Date('2022-12-16'), {
          hours: 9,
          minutes: 51,
          seconds: count * SECONDS,
          milliseconds: 0
        })
      }
      const start = sub(today, { seconds: SECONDS })
      const startDate = start.toISOString()
      const endDate = today.toISOString()
      const filters = {
        concat,
        size: null,
        startDate,
        endDate
      }
      if (TESTING) setCount(prev => ++prev)
      getTelemonitoringData(device, filters)
    }

    if (!count && TESTING) {
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
      <Chart data={data || []} timestamp />
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
