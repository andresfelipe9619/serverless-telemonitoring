import { Button, Card, Flex, Heading, Loader } from '@aws-amplify/ui-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePatients from '../../hooks/usePatients'
import ErrorAlert from '../error/ErrorAlert'

export default function PatientsPage () {
  const navigate = useNavigate()
  const [{ data, loading, error }, { getPatients }] = usePatients()
  const go2 = path => () => navigate(path)

  useEffect(() => {
    getPatients()
    // eslint-disable-next-line
  }, [])

  const showLoader = !data.length && loading
  return (
    <div>
      <ErrorAlert error={error} />
      {showLoader && <Loader variation='linear' />}
      <Flex wrap="wrap">
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
  return (
    <Card variation='elevated' className='patient-card col-3'>
      <Heading>{patient.name}</Heading>
      <Button onClick={go2(`/patients/${patient?.cognito_id}`)}>
        Telemonitoreo
      </Button>
    </Card>
  )
}
