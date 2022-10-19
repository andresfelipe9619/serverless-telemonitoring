import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

export default function Geolocation () {
  const [coords, setCoords] = useState([])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      console.log('Latitude is :', latitude)
      console.log('Longitude is :', longitude)
      setCoords([latitude, longitude])
    })
  }, [])

  return (
    <MapContainer center={coords} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={coords}>
      <Popup>
        A pretty CSS3 popup.
      </Popup>
    </Marker>
  </MapContainer>
  )
}
