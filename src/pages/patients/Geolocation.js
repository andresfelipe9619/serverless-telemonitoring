import { Flex, TextField, View } from '@aws-amplify/ui-react'
import 'leaflet'
import { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

const position = [51.505, -0.09]

export default function Geolocation () {
  const [coords] = useState(position)

  return (
    <View width={'100%'}>
      <Flex margin={[8, 16]}>
        <TextField
          name='latitude'
          label='Latitude'
          placeholder={position[0]}
          type='number'
        />
        <TextField
          name='longitude'
          label='Longitude'
          placeholder={position[1]}
          type='number'
        />
      </Flex>
      <MapContainer
        center={coords}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: 200 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={coords}>
          <Popup>A pretty CSS3 popup.</Popup>
        </Marker>
      </MapContainer>
    </View>
  )
}
