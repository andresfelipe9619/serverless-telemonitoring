import {
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Loader,
  Text
} from '@aws-amplify/ui-react'
import format from 'date-fns/format'
import set from 'date-fns/set'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePatients from '../../hooks/usePatients'
import useTelemonitoring from '../../hooks/useTelemonitoring'
import { calculateIndicators, DATE_FORMAT } from '../../utils'
import { BUCKET_URL } from '../../utils/aws'
import ErrorAlert from '../error/ErrorAlert'

export default function PatientsPage ({ user }) {
  const navigate = useNavigate()
  const [{ data, loading, error }, { getPatients }] = usePatients()
  const { username } = user
  const go2 = path => () => navigate(path)

  useEffect(() => {
    if (!username) return
    getPatients(username)
    // eslint-disable-next-line
  }, [username])

  const showLoader = !data.length && loading
  return (
    <div>
      <ErrorAlert error={error} />
      {showLoader && <Loader variation='linear' />}
      {!showLoader && !data.length && <Text>No tiene pacientes asignados</Text>}
      <Flex wrap='wrap'>
        {!loading &&
          data.map((patient, index) => (
            <PatientCard key={index} patient={patient} go2={go2} />
          ))}
      </Flex>
    </div>
  )
}

function PatientCard ({ patient, go2 }) {
  if (!patient) return null
  const src = BUCKET_URL + patient?.photo
  return (
    <Card variation='elevated' className='patient-card col-4'>
      <Flex direction='column' alignItems='center' justifyContent='center'>
        {patient?.photo && (
          <Image
            alt='Foto Perfil'
            src={src}
            objectFit='initial'
            objectPosition='50% 50%'
            borderRadius='50%'
            backgroundColor='initial'
            height='auto'
            width='100px'
            opacity='100%'
          />
        )}
        <Heading>{patient.name}</Heading>
        <VitalSigns patient={patient} />
        <Button onClick={go2(`/patients/${patient?.SK}`)}>Telemonitoreo</Button>
      </Flex>
    </Card>
  )
}

function VitalSigns ({ patient }) {
  const [{ data, error, loading }, { getTelemonitoringData }] =
    useTelemonitoring()

  useEffect(() => {
    const device = patient?.device_id
    if (!device) return
    const today = new Date()

    const startDate = format(
      set(today, {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      }),
      DATE_FORMAT
    )
    const endDate = format(today, DATE_FORMAT)
    const filters = {
      startDate,
      endDate
    }
    getTelemonitoringData(device, filters)
    //eslint-disable-next-line
  }, [patient])

  if (error) return <p>Algo salió mal {JSON.stringify(error)}</p>
  if (loading && !error) return <Loader />

  const { heartbeat, spo2 } = calculateIndicators(data)
  if (!heartbeat?.average || !spo2?.average) {
    return <Text>No hay datos hoy...</Text>
  }
  return (
    <Flex width='100%'>
      <Indicator sign={heartbeat} text='HeartBeat' />
      <Indicator sign={spo2} text='SPO2' />
    </Flex>
  )
}

const Indicator = ({ sign, text }) => (
  <div
    style={{
      textAlign: 'center',
      backgroundColor: sign.indicator.color,
      padding: '8px',
      width: '50%'
    }}
  >
    <Heading fontWeight={'bold'} level={3}>
      {sign.average}
    </Heading>
    <Text>{text}</Text>
  </div>
)
