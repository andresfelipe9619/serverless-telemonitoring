import React, { useEffect } from 'react'
import {
  Badge,
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
import { validationSchema, getInitialValues } from './settings'
import useUserProfile from '../../hooks/useUserProfile'
import ErrorAlert from '../error/ErrorAlert'
import { useNavigate } from 'react-router-dom'

const COLOMBIAN_CODE = '+57'

export const DocumentTypeOptions = [
  { value: 'T.I', label: 'T.I' },
  { value: 'C.C', label: 'C.C' },
  { value: 'C.E', label: 'Cedula de Extrangería' },
  { value: 'R.C', label: 'Registro Civil' }
]

export const GenreOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'OTRO', label: 'Otro' }
]

const Input = ({
  name,
  required = true,
  placeholder,
  values,
  isSubmitting,
  type = 'text',
  handleChange,
  innerEndComponent,
  errors
}) => (
  <TextField
    type={type}
    name={name}
    isRequired={required}
    disabled={isSubmitting}
    value={values[name] || ''}
    placeholder={placeholder}
    onChange={handleChange}
    innerEndComponent={innerEndComponent}
    errorMessage={errors[name]}
    hasError={!!errors[name]}
  />
)

function Profile ({ user }) {
  const navigate = useNavigate()
  const [{ data: doctors }, { getDoctors }] = useDoctors()
  const [
    { data: profileData, loading, error },
    { updateUser, getProfileData }
  ] = useUserProfile()
  const { username: cognitoID, attributes } = user || {}
  const { email, 'custom:role': custom_role } = attributes
  const isDoctor = custom_role === 'doctor'

  useEffect(() => {
    if (!cognitoID) return
    getProfileData(cognitoID)
    //eslint-disable-next-line
  }, [cognitoID])

  async function onSubmit (values) {
    const profile = { ...values, cognitoID, custom_role }
    console.log('profile', profile)
    const doctor = doctors.find(d => d.cognitoID === profile.doctor)
    const phone = profile?.phone.startsWith(COLOMBIAN_CODE)
      ? profile?.phone
      : `${COLOMBIAN_CODE}${profile.phone}`
    await updateUser({ ...profile, email, doctor, phone })
    localStorage.setItem('profile-completed', 1)
    navigate('/')
  }

  useEffect(() => {
    getDoctors()
    //eslint-disable-next-line
  }, [])

  const formikProps = useFormik({
    onSubmit,
    validationSchema,
    initialValues: getInitialValues(profileData),
    enableReinitialize: true
  })
  console.log('formikProps', formikProps)
  return (
    <Flex direction={'column'} alignItems='center' width='100%'>
      {loading && <Loader variation='linear' />}
      <ErrorAlert error={error} />
      <Card minWidth={420}>
        <Heading level={3}>Datos Personales</Heading>
        <Input name='name' placeholder='Name' {...formikProps} />
        <Input name='lastname' placeholder='Lastname' {...formikProps} />
        <SelectField
          isRequired
          name='document_type'
          placeholder='Tipo Documento'
          value={formikProps.values?.document_type}
          onChange={formikProps.handleChange}
        >
          {DocumentTypeOptions.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        <Input name='document' placeholder='N Documento' {...formikProps} />
        <SelectField
          name='sex'
          isRequired
          placeholder='Sexo'
          value={formikProps.values?.sex}
          onChange={formikProps.handleChange}
        >
          {GenreOptions.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        <Input
          name='birthdate'
          placeholder='Fecha Nacimiento'
          type='date'
          {...formikProps}
        />
        <Input name='phone' placeholder='Celular' {...formikProps} />
        <Input name='address' placeholder='Dirección' {...formikProps} />
        {isDoctor && (
          <Input
            name='specialisation'
            placeholder='Especialización'
            {...formikProps}
          />
        )}
      </Card>
      {!isDoctor && (
        <Card minWidth={420}>
          <Heading level={3}>Datos Médicos</Heading>
          <Input
            name='height'
            placeholder='Altura'
            type='number'
            innerEndComponent={
              <Flex alignItems='center' height={'100%'} padding={4}>
                <Badge size='small' borderRadius={0}>
                  CM
                </Badge>
              </Flex>
            }
            {...formikProps}
          />
          <Input
            name='weight'
            placeholder='Peso'
            type='number'
            innerEndComponent={
              <Flex alignItems='center' height={'100%'} padding={4}>
                <Badge size='small' borderRadius={0}>
                  KG
                </Badge>
              </Flex>
            }
            {...formikProps}
          />

          <SelectField
            isRequired
            name='doctor'
            placeholder='Doctor'
            value={formikProps.values.doctor}
            onChange={formikProps.handleChange}
          >
            {doctors.map((doctor, i) => (
              <option key={i} value={doctor.cognitoID}>
                {doctor.name} {doctor.lastname} - {doctor.specialisation}
              </option>
            ))}
          </SelectField>
        </Card>
      )}
      <Button onClick={formikProps.handleSubmit}>Registrar</Button>
    </Flex>
  )
}

export default Profile
