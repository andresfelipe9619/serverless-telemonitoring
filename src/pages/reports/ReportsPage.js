import {
  Button,
  Flex,
  Heading,
  Loader,
  TextField,
  View
} from '@aws-amplify/ui-react'
import React, { useState } from 'react'
import useTelemonitoring from '../../hooks/useTelemonitoring'
import ErrorAlert from '../error/ErrorAlert'
import Chart from './Chart'

export default function ReportsPage () {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [
    { data, error, loading },
    { getTelemonitoringData }
  ] = useTelemonitoring()

  function handleAnalysis () {
    getTelemonitoringData()
  }

  const haveData = !!data.length
  const showLoader = !haveData && loading

  return (
    <View>
      <ErrorAlert error={error} />
      <Flex>
        <TextField
          type='date'
          value={startDate}
          label='Fecha y Hora Inicio'
          onChange={e => setStartDate(e.target.value)}
        />
        <TextField
          type='date'
          value={endDate}
          label='Fecha y Hora Fin'
          onChange={e => setEndDate(e.target.value)}
        />
      </Flex>
      <Button onClick={handleAnalysis}>Analizar</Button>
      <Heading>INFORME CONSOLIDADO DE TELEMONITOREO DE SIGNOS VITALES</Heading>
      {showLoader && <Loader variation='linear' />}
      {haveData && <Chart data={data} />}
    </View>
  )
}
