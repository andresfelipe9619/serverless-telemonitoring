import * as Yup from 'yup'

const OBLIGATORY_TEXT = 'Campo Obligatorio!'

export const COLOMBIAN_CODE = '+57'

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


export const validationSchema = Yup.object().shape({
  height: Yup.number().required(OBLIGATORY_TEXT),
  weight: Yup.number().required(OBLIGATORY_TEXT),
  phone: Yup.number().required(OBLIGATORY_TEXT),
  name: Yup.string().required(OBLIGATORY_TEXT),
  document: Yup.string().required(OBLIGATORY_TEXT),
  birthdate: Yup.string().required(OBLIGATORY_TEXT),
  lastname: Yup.string().required(OBLIGATORY_TEXT),
  document_type: Yup.string().required(OBLIGATORY_TEXT)
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
