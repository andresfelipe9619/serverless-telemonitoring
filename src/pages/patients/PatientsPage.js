import { Alert, Button, Card, Heading, Loader } from '@aws-amplify/ui-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePatients from '../../hooks/usePatients'

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
      {error && (
        <Alert variation='error'>{error?.message || 'Algo salió mal'}</Alert>
      )}
      {showLoader && <Loader variation='linear' />}
      {!loading &&
        data.map(patient => <PatientCard patient={patient} go2={go2} />)}
    </div>
  )
}

function PatientCard ({ patient, go2 }) {
  return (
    <Card variation='elevated'>
      <Heading>Nombre Paciente</Heading>
      <Button onClick={go2(`/patients/${patient?.cognitoId}`)}>
        Telemonitoreo
      </Button>
    </Card>
  )
}
