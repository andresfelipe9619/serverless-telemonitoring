import { Flex, TextField, View } from '@aws-amplify/ui-react'
import 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

export default function Geolocation ({ locateUser = true }) {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

  const coords = [latitude, longitude]

  useEffect(() => {
    if (!locateUser) return
    navigator.geolocation.getCurrentPosition(function (position) {
      const { latitude, longitude } = position.coords

      setLatitude(latitude)
      setLongitude(longitude)
    })
  }, [locateUser])

  console.log('coords', coords)

  return (
    <View width={'100%'}>
      <Flex margin={[8, 16]}>
        <TextField
          name='latitude'
          label='Latitude'
          placeholder={latitude}
          type='number'
        />
        <TextField
          name='longitude'
          label='Longitude'
          placeholder={longitude}
          type='number'
        />
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
