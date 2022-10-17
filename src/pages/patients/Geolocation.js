import { useEffect, useState } from 'react'
import { MapView } from '@aws-amplify/ui-react'

export default function Geolocation () {
  const [coords, setCoords] = useState([])
  const [latitude, longitude] = coords

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      let { latitude, longitude } = position.coords
      console.log('Latitude is :', latitude)
      console.log('Longitude is :', longitude)
      setCoords([latitude, longitude])
    })
  }, [])

  if (!latitude || !longitude) return null
  return (
    <MapView
      initialViewState={{
        latitude,
        longitude,
        zoom: 14
      }}
    />
  )
}
