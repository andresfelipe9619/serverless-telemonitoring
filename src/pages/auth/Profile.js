import React, { useEffect } from 'react'
import {
  Button,
  Card,
  Flex,
  Heading,
  Loader,
  SelectField,
  TextField
} from '@aws-amplify/ui-react'
import useDoctors from '../../hooks/useDoctors'
import { useFormik } from 'formik'
import { validationSchema, initialValues } from './settings'
import useUserProfile from '../../hooks/useUserProfile'
import ErrorAlert from '../error/ErrorAlert'
import { useNavigate } from 'react-router-dom'

const Input = ({
  name,
  placeholder,
  values,
  isSubmitting,
  type = 'text',
  handleChange,
  errors
}) => (
  <TextField
    required
    type={type}
    name={name}
    disabled={isSubmitting}
    value={values[name] || ''}
    placeholder={placeholder}
    onChange={handleChange}
    errorMessage={errors[name]}
    hasError={!!errors[name]}
  />
)

function Profile ({ user }) {
  const [{ data: doctors }, { getDoctors }] = useDoctors()
  const [{ loading, error }, { updateUser }] = useUserProfile()
  const navigate = useNavigate()
  const cognitoID = user?.username
  const custom_role = user.attributes['custom:role']
  const isDoctor = custom_role === 'doctor'

  async function onSubmit (values) {
    const profile = { ...values, cognitoID, custom_role }
    console.log('profile', profile)
    await updateUser(profile)
    localStorage.setItem('profile-completed', 1)
    navigate('/')
  }

  useEffect(() => {
    getDoctors()
    //eslint-disable-next-line
  }, [])

  const formikProps = useFormik({ onSubmit, initialValues, validationSchema })
  console.log('formikProps', formikProps)
  return (
    <Flex direction={'column'} alignItems='center' width='100%'>
      {loading && <Loader variation='linear' />}
      <ErrorAlert error={error} />
      <Card minWidth={420}>
        <Heading level={3}>Datos Personales</Heading>
        <Input name='name' placeholder='Name' {...formikProps} />
        <Input name='lastname' placeholder='Lastname' {...formikProps} />
        <Input
          name='document_type'
          placeholder='Tipo Documento'
          {...formikProps}
        />
        <Input name='document' placeholder='N Documento' {...formikProps} />
        <Input name='sex' placeholder='Sexo' {...formikProps} />
        <Input
          name='birthday'
          placeholder='Fecha Nacimiento'
          type='date'
          {...formikProps}
        />
        <Input name='phone' placeholder='Celular' {...formikProps} />
        <Input name='address' placeholder='Dirección' {...formikProps} />
      </Card>
      <Card minWidth={420}>
        <Heading level={3}>Datos Médicos</Heading>
        <Input
          name='height'
          placeholder='Altura'
          type='number'
          {...formikProps}
        />
        <Input
          name='weight'
          placeholder='Peso'
          type='number'
          {...formikProps}
        />
        {!isDoctor && (
          <SelectField required={!isDoctor} name='doctor' placeholder='Doctor'>
            {doctors.map((doctor, i) => (
              <option key={i} value={doctor.cognitoID}>
                {doctor.name}
              </option>
            ))}
          </SelectField>
        )}
      </Card>
      <Button onClick={formikProps.handleSubmit}>Registrar</Button>
    </Flex>
  )
}

export default Profile
