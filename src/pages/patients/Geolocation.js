import 'leaflet'
import {
  Alert,
  Flex,
  Heading,
  Loader,
  TextField,
  View
} from '@aws-amplify/ui-react'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import usePatientData from '../../hooks/usePatientData'

const OPTIONS = {
  maximumAge: 0,
  timeout: 15000,
  enableHighAccuracy: true
}

export default function Geolocation ({ isDoctor, patient, locateUser = true }) {
  const [coords, setCoords] = useState([])
  const [{ loading }, { assignGeolocation }] = usePatientData()
  const patientLocation = JSON.parse(patient?.location || '[]') || []

  async function handleSuccess (position) {
    const { latitude, longitude } = position.coords
    const location = [latitude, longitude]
    console.log('Location: ', location)
    if (!latitude || !longitude) return
    setCoords(location)
    await assignGeolocation(patient, location)
  }

  function handleError (error) {
    console.error(error)
  }

  useEffect(() => {
    if (!locateUser || isDoctor || !patient) return
    console.log('Getting location...')
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      OPTIONS
    )
    // eslint-disable-next-line
  }, [patient, locateUser, isDoctor])

  console.log('Coords: ', { patientLocation, coords })
  const [latitude, longitude] = (isDoctor ? patientLocation : coords) || []
  return (
    <Flex direction={'column'}>
      {loading && <Loader variation='linear' />}
      <Heading level={3} margin={16}>
        Ubicación Geográfica
      </Heading>
      <View width={'100%'}>
        <Flex margin={[8, 16]} alignItems='center' alignContent='center'>
          <TextField
            name='latitude'
            label='Latitude'
            type='number'
            isDisabled={isDoctor}
            value={latitude}
            onChange={e => setCoords(prev => [e.target.value, prev[1]])}
          />
          <TextField
            name='longitude'
            label='Longitude'
            type='number'
            isDisabled={isDoctor}
            value={longitude}
            onChange={e => setCoords(prev => [prev[0], e.target.value])}
          />
          {!isDoctor && (
            <Alert variation='info'>
              Es necesario habilitar la geolocalización en el navegador para
              obtener la ubicación.
            </Alert>
          )}
        </Flex>
        {latitude && longitude && (
          <MapContainer
            center={coords}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: 320 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={coords} />
          </MapContainer>
        )}
      </View>
    </Flex>
  )
}
