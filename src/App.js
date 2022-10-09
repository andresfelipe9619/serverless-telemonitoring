import React from 'react'
import { Amplify, Auth } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Pages from './pages'
import SignUp from './pages/auth/SignUp'
import ErrorPage from './pages/error/ErrorPage'
import PatientDetail from './pages/patients/PatientDetail'
import awsExports from './aws-exports'
import './App.css'
import '@aws-amplify/ui-react/styles.css'

Amplify.configure(awsExports)

const router = authenticatorProps =>
  createBrowserRouter([
    {
      path: '/',
      element: <Pages {...authenticatorProps} />,
      errorElement: <ErrorPage />
    },
    {
      path: '/patients/:id',
      element: <PatientDetail {...authenticatorProps} />,
      errorElement: <ErrorPage />
    }
  ])

function App () {
  return (
    <Authenticator
      components={{
        SignUp
      }}
      services={{
        handleSignUp,
        validateCustomSignUp
      }}
    >
      {authenticatorProps => (
        <RouterProvider router={router(authenticatorProps)} />
      )}
    </Authenticator>
  )
}

async function handleSignUp (formData) {
  console.log('formData', formData)
  let { username, password, attributes } = formData
  // custom username
  username = username.toLowerCase()
  attributes.email = attributes.email.toLowerCase()
  return Auth.signUp({
    username,
    password,
    attributes
  })
}

async function validateCustomSignUp (formData) {
  if (!formData.sex) {
    return {
      sex: 'Sexo es obligatorio'
    }
  }
  if (!formData.weight) {
    return {
      weight: 'Peso es obligatorio'
    }
  }
  if (!formData.name) {
    return {
      name: 'Nombre es obligatorio'
    }
  }
  if (!formData.lastname) {
    return {
      lastname: 'Apellido es obligatorio'
    }
  }
  if (!formData.birthday) {
    return {
      lastname: 'Apellido es obligatorio'
    }
  }
}

export default App
