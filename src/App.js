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
            <ProtectedRoute {...authenticatorProps}>
              <PatientsPage {...authenticatorProps} />
            </ProtectedRoute>
          )
        },
        {
          path: '/reports/:patientId',
          element: <ReportsPage {...authenticatorProps} />
        },
        {
          path: '/patients/:id',
          element: <PatientDetail {...authenticatorProps} />
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

function ProtectedRoute ({ user, children }) {
  console.log('User: ', user)
  const isDoctor = user?.attributes['custom:role'] === 'doctor'
  const userId = user?.username
  if (!isDoctor) {
    return <Navigate to={`/patients/${userId}`} replace />
  }
  return children
}

async function handleSignUp (formData) {
  console.log('FORM DATA: ', formData)
  let { username, password, attributes } = formData
  username = username.toLowerCase()
  attributes.email = attributes.email.toLowerCase()
  attributes['custom:role'] = attributes['custom:role'] || 'patient'
  return Auth.signUp({
    username,
    password,
    attributes
  })
}

export default App
