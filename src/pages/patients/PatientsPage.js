import { Button, Card, Heading } from '@aws-amplify/ui-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'


export default function PatientsPage () {
  const navigate = useNavigate()
  const go2 = path => () => navigate(path)

  return (
    <div>
      <PatientCard patient={{}} go2={go2} />
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
