import {
  Button,
  Card,
  Flex,
  Heading,
  Loader,
  Text,
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
      <Card margin={20}>
        <ErrorAlert error={error} />
        <Flex justifyContent='center'>
          <TextField
            type='datetime-local'
            value={startDate}
            label='Fecha y Hora Inicio'
            onChange={e => setStartDate(e.target.value)}
          />
          <TextField
            type='datetime-local'
            value={endDate}
            label='Fecha y Hora Fin'
            onChange={e => setEndDate(e.target.value)}
          />
        </Flex>
        <Flex justifyContent='center' margin={20}>
          <Button onClick={handleAnalysis}>Analizar</Button>
        </Flex>
      </Card>

      <Card margin={20}>
        <Heading textAlign='center' margin={20}>
          INFORME CONSOLIDADO DE TELEMONITOREO DE SIGNOS VITALES
        </Heading>
        {showLoader && <Loader variation='linear' />}
        {haveData && <Chart data={data} />}
        {!haveData && !error && (
          <Text textAlign='center'>No hay datos para mostrar...</Text>
        )}
      </Card>
    </View>
  )
}
