import React from 'react'
import { Amplify, Auth } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import AppLayout from './pages/home/AppLayout'
import SignUp from './pages/auth/SignUp'
import ErrorPage from './pages/error/ErrorPage'
import PatientDetail from './pages/patients/PatientDetail'
import ReportsPage from './pages/reports/ReportsPage'
import PatientsPage from './pages/patients/PatientsPage'
import awsExports from './aws-exports'
import ProfilePage from './pages/auth/Profile'

import '@aws-amplify/ui-react/styles.css'

Amplify.configure(awsExports)

const router = authenticatorProps =>
  createBrowserRouter([
    {
      element: <AppLayout {...authenticatorProps} />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: (
            <ProtectedRoute doctoronly {...authenticatorProps}>
              <PatientsPage {...authenticatorProps} />
            </ProtectedRoute>
          )
        },
        {
          path: '/profile',
          element: <ProfilePage {...authenticatorProps} />
        },
        {
          path: '/reports/:patientId',
          element: (
            <ProtectedRoute {...authenticatorProps}>
              <ReportsPage {...authenticatorProps} />
            </ProtectedRoute>
          )
        },
        {
          path: '/patients/:id',
          element: (
            <ProtectedRoute {...authenticatorProps}>
              <PatientDetail {...authenticatorProps} />
            </ProtectedRoute>
          )
        }
      ]
    }
  ])

function App () {
  return (
    <div className='App'>
      <Authenticator
        components={{
          SignUp: SignUp()
        }}
        services={{
          handleSignUp
        }}
      >
        {authenticatorProps => (
          <RouterProvider router={router(authenticatorProps)} />
        )}
      </Authenticator>
    </div>
  )
}

function ProtectedRoute ({ user, doctoronly, children }) {
  console.log('User: ', user)
  const isDoctor = user?.attributes['custom:role'] === 'DOCTOR'
  const userId = user?.username
  const item = localStorage.getItem('profile-completed')
  const completed = isNaN(item) ? 1 : +item
  console.log('completed', completed)
  if (!completed) {
    return <Navigate to={`/profile`} replace />
  }
  if (doctoronly && !isDoctor) {
    return <Navigate to={`/patients/${userId}`} replace />
  }
  return children
}

async function handleSignUp (formData) {
  console.log('FORM DATA: ', formData)
  let { username, password, attributes } = formData
  username = username.toLowerCase()
  attributes.email = attributes.email.toLowerCase()
  attributes['custom:role'] = attributes['custom:role'] || 'PATIENT'
  const result = await Auth.signUp({
    username,
    password,
    attributes
  })
  localStorage.setItem('profile-completed', '0')
  return result
}

export default App
