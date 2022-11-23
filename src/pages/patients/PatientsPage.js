import {
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Loader,
  Text
} from '@aws-amplify/ui-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePatients from '../../hooks/usePatients'
import ErrorAlert from '../error/ErrorAlert'

export default function PatientsPage ({ user }) {
  const navigate = useNavigate()
  const [{ data, loading, error }, { getPatients }] = usePatients()
  const { username } = user?.attributes
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
  const src = patient?.photo
  return (
    <Card variation='elevated' className='patient-card col-3'>
      {src && (
        <Image
          alt='Foto Perfil'
          src={src}
          objectFit='initial'
          objectPosition='50% 50%'
          borderRadius='50%'
          backgroundColor='initial'
          height='auto'
          width='180px'
          opacity='100%'
        />
      )}
      <Heading>{patient.name}</Heading>
      <Button onClick={go2(`/patients/${patient?.cognito_id}`)}>
        Telemonitoreo
      </Button>
    </Card>
  )
}
