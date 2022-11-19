import {
  Button,
  Card,
  Flex,
  Heading,
  Loader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  TextField,
  View
} from '@aws-amplify/ui-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import usePatientData from '../../hooks/usePatientData'
import useTelemonitoring from '../../hooks/useTelemonitoring'
import ErrorAlert from '../error/ErrorAlert'
import Chart from './Chart'

export default function ReportsPage () {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const params = useParams()
  const [
    { data, error, loading },
    { getTelemonitoringData }
  ] = useTelemonitoring()
  const [
    { data: patient, loading: loadingPatient, error: errorPatient },
    { getPatientData }
  ] = usePatientData()

  const { patientId } = params

  useEffect(() => {
    if (!patientId) return
    getPatientData(patientId)
    // eslint-disable-next-line
  }, [patientId])

  function handleAnalysis () {
    const filters = {
      startDate: startDate.replace(/T/, ' ').replace(/Z/, ''),
      endDate: endDate.replace(/T/, ' ').replace(/Z/, '')
    }
    console.log('filters', filters)
    return getTelemonitoringData(patient.device_id, filters)
  }

  const haveData = !!data.length
  const showLoader = !haveData && (loading || loadingPatient)

  return (
    <View>
      <Card margin={20}>
        <ErrorAlert error={error || errorPatient} />
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
          <Button isDisabled={!startDate || !endDate} onClick={handleAnalysis}>
            Analizar
          </Button>
        </Flex>
      </Card>

      <Card margin={20}>
        <Heading textAlign='center' margin={20}>
          INFORME CONSOLIDADO DE TELEMONITOREO DE SIGNOS VITALES
        </Heading>
        {showLoader && <Loader variation='linear' />}
        {haveData && (
          <>
            <AverageTable data={data} />
            <View height='60vh'>
              <Chart data={data} />
            </View>
          </>
        )}
        {!haveData && !error && (
          <Text textAlign='center'>
            {showLoader ? 'Cargando' : 'No hay datos para mostrar'}...
          </Text>
        )}
      </Card>
    </View>
  )
}

function AverageTable ({ data }) {
  const { spo2, heartbeat } = data.reduce(
    (acc, item) => {
      return {
        ...acc,
        spo2: acc.spo2.concat(item.SPO2 || []),
        heartbeat: acc.heartbeat.concat(item.HeartBeat || [])
      }
    },
    {
      spo2: [],
      heartbeat: []
    }
  )
  const spo2Average = average(spo2)
  const heartbeatAverage = average(heartbeat)

  const spo2Indicator = getSpo2Indicator(spo2Average)
  const heartbeatIndicator = getHeartbeatIndicator(heartbeatAverage)

  return (
    <Table
      variation='bordered'
      margin={'auto'}
      highlightOnHover={false}
      minWidth={'420px'}
      maxWidth={'800px'}
    >
      <TableHead>
        <TableRow>
          <TableCell>
            <strong>Signo Vital</strong>
          </TableCell>
          <TableCell>
            <strong>Valor</strong>
          </TableCell>
          <TableCell>
            <strong>Indicador</strong>
          </TableCell>
          <TableCell>
            <strong>Recomendación</strong>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>SPO2</TableCell>
          <TableCell>{spo2Average}</TableCell>
          <TableCell backgroundColor={spo2Indicator.color}>
            {spo2Indicator.name}
          </TableCell>
          <TableCell>{spo2Indicator.tips}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>F. Cardiaca</TableCell>
          <TableCell>{heartbeatAverage}</TableCell>
          <TableCell backgroundColor={heartbeatIndicator.color}>
            {heartbeatIndicator.name}
          </TableCell>
          <TableCell>{heartbeatIndicator.tips}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

// function calculateAge (birthday) {
//   // birthday is a date
//   const ageDifMs = Date.now() - birthday.getTime()
//   const ageDate = new Date(ageDifMs) // miliseconds from epoch
//   return Math.abs(ageDate.getUTCFullYear() - 1970)
// }

const getHeartbeatIndicator = average => {
  if (average >= 98) {
    return {
      name: 'Inadecuado',
      color: 'var(--amplify-colors-red-40)',
      tips: ''
    }
  }
  if (average >= 80) {
    return {
      name: 'Normal',
      color: 'var(--amplify-colors-orange-40)',
      tips: ''
    }
  }
  if (average >= 70) {
    return {
      name: 'Bueno',
      color: 'var(--amplify-colors-yellow-40)',
      tips: ''
    }
  }
  if (average >= 40) {
    return {
      name: 'Excelente',
      color: 'var(--amplify-colors-green-40)',
      tips: ''
    }
  }
  return {
    name: 'Inadecuado',
    color: 'var(--amplify-colors-red-40)',
    tips: ''
  }
}

const getSpo2Indicator = average => {
  if (average >= 98) {
    return {
      name: 'Normal',
      color: 'var(--amplify-colors-green-40)',
      tips: 'Todo bien'
    }
  }
  if (average >= 95) {
    return {
      name: 'Insuficiente',
      color: 'var(--amplify-colors-yellow-40)',
      tips: 'Tolerable, paciente dificlmente nota influencia alguna'
    }
  }
  if (average >= 90) {
    return {
      name: 'Disminuido',
      color: 'var(--amplify-colors-orange-40)',
      tips: 'Intervención inmediata'
    }
  }
  return {
    name: 'Crítico',
    color: 'var(--amplify-colors-red-40)',
    tips: 'Remitir a un especialista'
  }
}

const average = data =>
  Math.round(data.reduce((a, b) => a + b, 0) / data.length)
