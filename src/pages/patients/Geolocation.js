import { Alert, Flex, TextField, View } from '@aws-amplify/ui-react'
import 'leaflet'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

export default function Geolocation ({
  coords,
  setCoords,
  isDoctor,
  locateUser = true
}) {
  useEffect(() => {
    if (!locateUser || isDoctor) return
    console.log('Getting location...')
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude, longitude } = position.coords
        console.log('[latitude, longitude]', [latitude, longitude])
        setCoords([latitude, longitude])
      },
      function (error) {
        console.error(error)
      },
      { maximumAge: 0, timeout: 5000, enableHighAccuracy: true }
    )
    // eslint-disable-next-line
  }, [locateUser, isDoctor])

  console.log('coords', coords)
  const [latitude, longitude] = coords || []
  return (
    <View width={'100%'}>
      <Flex margin={[8, 16]} alignItems='center' alignContent="center">
        <TextField
          name='latitude'
          label='Latitude'
          value={latitude}
          type='number'
          isDisabled={isDoctor}
        />
        <TextField
          name='longitude'
          label='Longitude'
          value={longitude}
          type='number'
          isDisabled={isDoctor}
        />
        <Alert variation='info'>
          Es necesario habilitar la geolocalización en el navegador para obtener
          la ubicación.
        </Alert>
      </Flex>
      {latitude && longitude && (
        <MapContainer
          center={coords}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: 300 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <Marker position={coords}>
            <Popup>A pretty CSS3 popup.</Popup>
          </Marker>
        </MapContainer>
      )}
    </View>
  )
}
