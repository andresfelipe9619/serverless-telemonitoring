import * as Yup from 'yup'

const getObligatoryText = field => `Campo ${field} Obligatorio!`

export const COLOMBIAN_CODE = '+57'

export const DocumentTypeOptions = [
  { value: 'T.I', label: 'T.I' },
  { value: 'C.C', label: 'C.C' },
  { value: 'C.E', label: 'Cédula de Extrangería' },
  { value: 'R.C', label: 'Registro Civil' }
]

export const GenreOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'OTRO', label: 'Otro' }
]

export const validationSchema = Yup.object().shape({
  height: Yup.number().required(getObligatoryText('altura')),
  weight: Yup.number().required(getObligatoryText('peso')),
  phone: Yup.number().required(getObligatoryText('celular')),
  name: Yup.string().required(getObligatoryText('nombre')),
  document: Yup.string().required(getObligatoryText('documento')),
  birthdate: Yup.string().required(getObligatoryText('f. nacimiento')),
  lastname: Yup.string().required(getObligatoryText('apeliido')),
  document_type: Yup.string().required(getObligatoryText('tipo documento'))
})

export const getInitialValues = profileData => ({
  height: profileData?.height || 0,
  weight: profileData?.weight || 0,
  sex: profileData?.sex || 0,
  phone: profileData?.phone || 0,
  document: profileData?.document || 0,
  address: profileData?.address || 0,
  birthdate: profileData?.birthdate || '',
  name: profileData?.name || '',
  lastname: profileData?.lastname || '',
  doctor: profileData?.doctor || '',
  specialisation: profileData?.specialisation || '',
  document_type: profileData?.document_type || ''
})
