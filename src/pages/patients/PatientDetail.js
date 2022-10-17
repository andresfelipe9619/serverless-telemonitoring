import React, { useEffect } from 'react'
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
import useProfileData from '../../hooks/useProfileData'
import ErrorAlert from '../error/ErrorAlert'
import TelemonitoringPreview from './TelemonitoringPreview'
import Geolocation from './Geolocation'

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
        <TelemonitoringPreview />
        <Button onClick={go2(`/reports/${patient.cognitoID}`)}>
          Historial
        </Button>
      </Card>
    </Flex>
  )
}

function Content ({ patient }) {
  return (
    <Flex>
      <View>
        <Table caption='' highlightOnHover={false}>
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
              <TableCell>{patient.doctor}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
      </View>
      <View>
        <Heading>Dispositivo IoT</Heading>
        <SelectField name='device' placeholder='Dispositivo'>
          <option value='1'>Dispositivo 1</option>
          <option value='2'>Dispositivo 2</option>
          <option value='3'>Dispositivo 3</option>
        </SelectField>
      </View>
      <View>
        <Heading>Ubicación geográfica</Heading>
        <Geolocation />
      </View>
    </Flex>
  )
}
