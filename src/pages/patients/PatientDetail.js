import React, { useEffect } from 'react'
import {
  Heading,
  Flex,
  Image,
  Card,
  Button,
  Loader
} from '@aws-amplify/ui-react'
import logo from '../../logo.svg'
import { useNavigate, useParams } from 'react-router-dom'
import useProfileData from '../../hooks/useProfileData'
import ErrorAlert from '../error/ErrorAlert'

export default function PatientDetail () {
  const navigate = useNavigate()
  const { patientId } = useParams()
  const [
    { data: patient, loading, error },
    { getProfileData }
  ] = useProfileData()

  const go2 = path => () => navigate(path)

  useEffect(() => {
    getProfileData(patientId)
    // eslint-disable-next-line
  }, [])

  if (error) return <ErrorAlert error={error} />
  return (
    <Flex
      direction={'column'}
      justifyContent='center'
      alignContent={'center'}
      className='App-header'
    >
      <Card variation='elevated'>
        <Heading level={1}>DATOS DEL PACIENTE</Heading>
        {loading && <Loader variation='linear' />}
        <Content patient={patient} />
      </Card>
      <Card variation='elevated'>
        <Heading level={1}>VISUALIZACIÓN DE LECTURA SIGNOS VITALES</Heading>
        <Button onClick={go2(`/reports/${patient.cognitoID}`)}>
          Historial
        </Button>
      </Card>
    </Flex>
  )
}

function Content ({ patient }) {
  return (
    <div>
      <Image
        alt='Foto Paciente'
        src={logo}
        objectFit='initial'
        objectPosition='50% 50%'
        backgroundColor='initial'
        height='30%'
        width='30%'
        opacity='100%'
      />
      <Heading level={1}>{patient.name}</Heading>
    </div>
  )
}
