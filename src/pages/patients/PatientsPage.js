import { Button, Card, Flex, Heading, Loader } from '@aws-amplify/ui-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePatientDatas from '../../hooks/usePatients'
import ErrorAlert from '../error/ErrorAlert'

export default function PatientsPage () {
  const navigate = useNavigate()
  const [{ data, loading, error }, { getPatients }] = usePatientDatas()
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
      <Flex>
        {!loading &&
          data.map(patient => <PatientCard patient={patient} go2={go2} />)}
      </Flex>
    </div>
  )
}

function PatientCard ({ patient, go2 }) {
  if (!patient) return null
  return (
    <Card variation='elevated' className='patient-card col-3'>
      <Heading>{patient.name}</Heading>
      <Button onClick={go2(`/patients/${patient?.cognitoID}`)}>
        Telemonitoreo
      </Button>
    </Card>
  )
}
