import React, { useEffect } from 'react'
import {
  Button,
  Card,
  Flex,
  Heading,
  SelectField,
  TextField
} from '@aws-amplify/ui-react'
import useDoctors from '../../hooks/useDoctors'
import { useFormik } from 'formik'
import usePatientData from '../../hooks/usePatientData'
import { validationSchema, initialValues } from './settings'

const Input = ({
  name,
  placeholder,
  values,
  type = 'text',
  handleChange,
  errors
}) => (
  <TextField
    required
    type={type}
    name={name}
    value={values[name] || ''}
    placeholder={placeholder}
    onChange={handleChange}
    errorMessage={errors[name]}
    hasError={!!errors[name]}
  />
)

function Profile ({ user }) {
  const [{ data: doctors }, { getDoctors }] = useDoctors()
  const [, {}] = usePatientData()
  function onSubmit (values) {}

  useEffect(() => {
    getDoctors()
    //eslint-disable-next-line
  }, [])

  const formikProps = useFormik({ onSubmit, initialValues, validationSchema })
  const isDoctor = user.attributes['custom:role'] === 'doctor'

  return (
    <Flex direction={'column'} alignItems='center' width='100%'>
      <Card minWidth={420}>
        <Heading level={3}>Datos Personales</Heading>
        <Input name='name' placeholder='Name' {...formikProps} />
        <Input
          name='type_document'
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
        <Input name='email' disabed placeholder='E-mail' {...formikProps} />
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
