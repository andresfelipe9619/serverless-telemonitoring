import React, { useEffect, useState } from 'react'
import {
  Heading,
  Flex,
  Image,
  Card,
  Button,
  Loader,
  Table,
  TableBody,
  TableRow,
  TableCell,
  View,
  SelectField
} from '@aws-amplify/ui-react'
import logo from '../../logo.svg'
import { useNavigate, useParams } from 'react-router-dom'
import usePatientData from '../../hooks/usePatientData'
import ErrorAlert from '../error/ErrorAlert'
import TelemonitoringPreview from './TelemonitoringPreview'
import Geolocation from './Geolocation'
import useDevices from '../../hooks/useDevices'
import useDoctors from '../../hooks/useDoctors'
import './styles.css'
import { BUCKET_URL } from '../../utils/aws'

export default function PatientDetail (props) {
  const navigate = useNavigate()
  const params = useParams()
  const { user } = props
  const { id } = params

  const [
    { data, loading, error, concat },
    { getPatientData, assignDevice, setConcat }
  ] = usePatientData()

  const go2 = path => () => navigate(path)

  const handleAssignDevice = device => () => assignDevice(data, device)

  useEffect(() => {
    if (!id) return null
    getPatientData(id)
    // eslint-disable-next-line
  }, [id])

  if (error) return <ErrorAlert error={error} />
  const isCurrentUserDoctor = user?.attributes['custom:role'] === 'DOCTOR'

  return (
    <Flex direction={'column'} alignContent={'center'}>
      <Card variation='elevated'>
        <Heading level={3} margin={16}>
          Datos del Paciente
        </Heading>
        {loading && <Loader variation='linear' />}
        {!id && <Heading>No hay paciente con el ID especificado: {id}</Heading>}
        {data && (
          <Content
            user={user}
            patient={data}
            handleAssignDevice={handleAssignDevice}
          />
        )}
      </Card>
      <Card variation='elevated'>
        <Heading level={3} margin={16}>
          Visualización de Signos Vitales
        </Heading>
        {data && (
          <TelemonitoringPreview
            concat={concat}
            device={data.device_id}
            setConcat={setConcat}
          />
        )}
        <Flex justifyContent='center' marginTop={32}>
          <Button onClick={go2(`/reports/${id}`)}>Historial</Button>
        </Flex>
      </Card>
      <Card variation='elevated'>
        <Geolocation patient={data} isDoctor={isCurrentUserDoctor} />
      </Card>
    </Flex>
  )
}

function Content ({ patient, handleAssignDevice }) {
  const [{ data: devices }, { getDevices }] = useDevices()
  const [{ data: doctors, loading: loadingDoctors }, { getDoctors }] =
    useDoctors()
  const [device, setDevice] = useState(null)

  useEffect(() => {
    getDevices()
    getDoctors()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!patient.device_id) return
    setDevice(patient.device_id)
  }, [patient])

  const doctor = (doctors || []).find(d => d.SK === patient.doctor)
  const src = BUCKET_URL + patient.photo
  return (
    <View padding={'32px'}>
      <Flex
        marginBottom={32}
        wrap={'wrap'}
        justifyContent='center'
        alignItems='flex-start'
      >
        <Image
          margin={32}
          alt='Foto Paciente'
          src={patient?.photo ? src : logo}
          objectFit='initial'
          objectPosition='50% 50%'
          backgroundColor='initial'
          borderRadius='50%'
          height='auto'
          width='180px'
          opacity='100%'
        />
        <Table
          variation='striped'
          className='patient-table'
          highlightOnHover={false}
        >
          <TableBody>
            <TableRow>
              <TableCell>N Documento</TableCell>
              <TableCell>{patient.document}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>{patient.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Apellidos</TableCell>
              <TableCell>{patient.lastname}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>F. de Nacimiento</TableCell>
              <TableCell>{patient.birthdate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sexo</TableCell>
              <TableCell>{patient.sex}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Peso</TableCell>
              <TableCell>{patient.weight}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Estatura</TableCell>
              <TableCell>{patient.height}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Médico tratante</TableCell>
              <TableCell>
                {loadingDoctors
                  ? 'Cargando...'
                  : `${doctor?.name || ''} ${doctor?.lastname || ''}`}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Flex>
      <Flex marginBottom={32} direction='column'>
        <Heading>Dispositivo IoT</Heading>
        <Flex margin={[8, 16]}>
          <SelectField
            name='device'
            placeholder='Dispositivo'
            value={device || patient.device_id}
            onChange={e => setDevice(e.target.value)}
          >
            {devices.map(d => (
              <option key={d.SK} value={d.SK}>
                {d.Name}
              </option>
            ))}
          </SelectField>
          <Button
            disabled={device === patient.device_id}
            onClick={handleAssignDevice(device)}
          >
            Asignar
          </Button>
          <Button isDisabled={!device} onClick={handleAssignDevice('')}>
            Liberar
          </Button>
        </Flex>
      </Flex>
    </View>
  )
}
