import {
  Button,
  Flex,
  Heading,
  Loader,
  TextField,
  View
} from '@aws-amplify/ui-react'
import React, { useEffect } from 'react'
import useTelemonitoring from '../../hooks/useTelemonitoring'
import ErrorAlert from '../error/ErrorAlert'
import Chart from './Chart'

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
    <View>
      <ErrorAlert error={error} />
      <Flex>
        <TextField
          type='date'
          descriptiveText='Fecha y Hora Inicio'
          label='Fecha y Hora Inicio'
        />
        <TextField
          type='date'
          descriptiveText='Fecha y Hora Fin'
          label='Fecha y Hora Fin'
        />
      </Flex>
      <Button>Analizar</Button>
      <Heading>INFORME CONSOLIDADO DE TELEMONITOREO DE SIGNOS VITALES</Heading>
      {showLoader && <Loader variation='linear' />}
      {haveData && <Chart data={data} />}
    </View>
  )
}
