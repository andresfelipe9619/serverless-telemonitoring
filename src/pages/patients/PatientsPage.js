import React from 'react'
import { Link } from 'react-router-dom'

export default function PatientsPage () {
  return (
    <div>
      <Link to={`patients/1`}>Go to patient</Link>
    </div>
  )
}
