import React, { useEffect, useRef, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Loader,
  SelectField,
  TextField
} from '@aws-amplify/ui-react'
import useDoctors from '../../hooks/useDoctors'
import { useFormik } from 'formik'
import {
  validationSchema,
  getInitialValues,
  COLOMBIAN_CODE,
  GenreOptions,
  DocumentTypeOptions
} from './settings'
import useUserProfile from '../../hooks/useUserProfile'
import ErrorAlert from '../error/ErrorAlert'
import { useNavigate } from 'react-router-dom'
import { addImageToS3 } from '../../utils/aws'

export const SUPPORTED_IMAGE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

export const getFile = file => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onloadend = () => resolve({ name: file.name, base64: reader.result })
    reader.readAsDataURL(file)
  })
}

function getPhonenumber (profile) {
  const haveCode = profile?.phone.startsWith(COLOMBIAN_CODE)
  const phone = haveCode ? profile?.phone : `${COLOMBIAN_CODE}${profile.phone}`
  return phone
}

const Input = ({
  name,
  required = true,
  placeholder,
  values,
  loading,
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
    isDisabled={isSubmitting || loading}
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
  const [avatar, setAvatar] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [{ data: doctors }, { getDoctors }] = useDoctors()
  const [
    { data: profileData, loading, error },
    { updateUser, getProfileData }
  ] = useUserProfile()
  const { username: cognitoID, attributes } = user || {}
  const { email, 'custom:role': custom_role } = attributes
  const isDoctor = custom_role === 'doctor'

  async function onSubmit (values) {
    const profile = {
      ...values,
      cognitoID,
      custom_role,
      device_id: profileData?.device_id || ''
    }
    console.log('profile', profile)
    const phone = getPhonenumber(profile)
    const doctor = doctors.find(d => d.cognitoID === profile.doctor)
    let photo = profileData?.photo || ''
    if (uploadedFile) {
      try {
        const result = await addImageToS3(uploadedFile)
        console.log('result', result)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }
    }
    console.log('photo', photo)
    await updateUser({ ...profile, email, doctor, phone, photo })
    localStorage.setItem('profile-completed', 1)
    navigate('/')
  }

  useEffect(() => {
    if (!cognitoID) return
    getProfileData(cognitoID)
    //eslint-disable-next-line
  }, [cognitoID])

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

  async function handleChangePhoto (event) {
    try {
      const [file] = event.currentTarget.files || []
      console.log('file', file)
      if (!file) return
      formikProps.setFieldValue('photo', file)
      const { base64 } = await getFile(file)
      setAvatar(base64)
      setUploadedFile(file)
    } catch (error) {
      console.error(error)
      setFileError(error)
    }
  }

  const src = avatar || profileData?.photo

  return (
    <Flex direction={'column'} alignItems='center' width='100%'>
      {loading && <Loader variation='linear' />}
      <ErrorAlert error={error || fileError} />
      <Card minWidth={420}>
        <Heading level={3}>Datos Personales</Heading>
        <Flex
          marginBottom={40}
          marginTop={40}
          alignItems={'center'}
          alignContent={'center'}
          justifyContent='center'
          direction={'column'}
        >
          {src && (
            <Image
              alt='Foto Perfil'
              src={src}
              objectFit='initial'
              objectPosition='50% 50%'
              borderRadius="50%"
              backgroundColor='initial'
              height='auto'
              width='180px'
              opacity='100%'
            />
          )}
          <Flex mt={2}>
            <FormUpload
              name='photo'
              isSubmitting={formikProps.isSubmitting}
              accept={SUPPORTED_IMAGE_FORMATS.join()}
              handleChange={handleChangePhoto}
            />
          </Flex>
        </Flex>
        <Input
          name='name'
          placeholder='Name'
          loading={loading}
          {...formikProps}
        />
        <Input
          name='lastname'
          placeholder='Lastname'
          loading={loading}
          {...formikProps}
        />
        <SelectField
          isDisabled={loading}
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
        <Input
          name='document'
          placeholder='N Documento'
          loading={loading}
          {...formikProps}
        />
        <SelectField
          isDisabled={loading}
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
          loading={loading}
          {...formikProps}
        />
        <Input
          name='phone'
          placeholder='Celular'
          loading={loading}
          {...formikProps}
        />
        <Input
          name='address'
          placeholder='Dirección'
          loading={loading}
          {...formikProps}
        />
        {isDoctor && (
          <Input
            name='specialisation'
            placeholder='Especialización'
            loading={loading}
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
            loading={loading}
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
            loading={loading}
            {...formikProps}
          />

          <SelectField
            isDisabled={loading}
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

function FormUpload ({ accept, name, label, handleChange, isSubmitting }) {
  const upload = useRef(null)
  return (
    <>
      <input
        hidden
        name={name}
        type='file'
        ref={upload}
        disabled={isSubmitting}
        id={`${name}-button-file`}
        accept={accept}
        onChange={handleChange}
      />
      <label htmlFor={`${name}-button-file`}>
        {label}
        <Button
          component='span'
          isDisabled={isSubmitting}
          onClick={() => upload?.current?.click()}
        >
          Sube una foto
        </Button>
      </label>
    </>
  )
}

export default Profile
