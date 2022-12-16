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
import useResponsive from '../../hooks/useResponsive'
import useTelemonitoring from '../../hooks/useTelemonitoring'
import { calculateIndicators } from '../../utils'
import ErrorAlert from '../error/ErrorAlert'
import Chart from './Chart'

export default function ReportsPage () {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const params = useParams()
  const [{ data, error, loading }, { getTelemonitoringData }] =
    useTelemonitoring()
  const [
    { data: patient, loading: loadingPatient, error: errorPatient },
    { getPatientData }
  ] = usePatientData()
  const { isMobile } = useResponsive()

  const { patientId } = params

  useEffect(() => {
    if (!patientId) return
    getPatientData(patientId)
    // eslint-disable-next-line
  }, [patientId])

  function handleAnalysis () {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const filters = {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    }
    console.log('filters', filters)
    return getTelemonitoringData(patient.device_id, filters)
  }

  const haveData = !!data.length
  const showLoader = loading || loadingPatient

  return (
    <View>
      <Card marginBottom={20}>
        <ErrorAlert error={error || errorPatient} />
        <Flex
          justifyContent='center'
          wrap='wrap'
          direction={isMobile ? 'column' : 'row'}
        >
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

      <Card marginTop={20}>
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
  const { heartbeat, spo2 } = calculateIndicators(data)

  return (
    <Flex wrap={'wrap'}>
      <Table
        variation='bordered'
        margin={'auto'}
        highlightOnHover={false}
        minWidth={'200px'}
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
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>SPO2</TableCell>
            <TableCell>{spo2.average}</TableCell>
            <TableCell backgroundColor={spo2.indicator.color}>
              {spo2.indicator.name}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>F. Cardiaca</TableCell>
            <TableCell>{heartbeat.average}</TableCell>
            <TableCell backgroundColor={heartbeat.indicator.color}>
              {heartbeat.indicator.name}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Flex direction='column' justifyContent='center'>
        <strong>Recomendaciónes: </strong>
        <Text>
          <strong>SPO2 - </strong>{' '}
          {spo2.indicator.tips || 'No hay recomendación.'}
        </Text>
        <Text>
          <strong>F. Cardiaca - </strong>
          {heartbeat.indicator.tips || 'No hay recomendación.'}
        </Text>
      </Flex>
    </Flex>
  )
}
