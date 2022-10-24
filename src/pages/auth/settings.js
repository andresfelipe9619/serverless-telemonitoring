import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  height: Yup.number().required('Obligatory field'),
  weight: Yup.number().required('Obligatory field'),
  phone: Yup.number().required('Obligatory field'),
  email: Yup.string()
    .email()
    .required('Obligatory field'),
  name: Yup.string().required('Obligatory field'),
  lastname: Yup.string().required('Obligatory field')
})

export const initialValues = {
  height: 0,
  weight: 0,
  phone: 0,
  email: '',
  name: '',
  lastname: ''
}
