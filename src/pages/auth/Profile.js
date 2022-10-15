import React, { useState } from 'react'
import {
  Authenticator,
  useAuthenticator,
  CheckboxField,
  SelectField,
  TextField
} from '@aws-amplify/ui-react'

const Input = ({ name, placeholder, label, type = "text", setFormData, validationErrors }) =>
(<TextField
  required
  type={type}
  name={name}
  placeholder={placeholder}
  onChange={e => setFormData(prev => ({ ...prev, [name]: e?.target?.value }))}
  errorMessage={validationErrors[name]}
  hasError={!!validationErrors[name]}
/>)

function SignUp() {
  return {
    FormFields() {
      const { validationErrors } = useAuthenticator()
      const [isDoctor, setIsDoctor] = useState(false)
      const [selectedDoctor, setSelectedDoctor] = useState(null)
      const [formData, setFormData] = useState({
        name: "",
        sex: "",
        lastname: "",
      })

      return (
        <>
          {/* Re-use default `Authenticator.SignUp.FormFields` */}
          <Authenticator.SignUp.FormFields />
          {/*Custom inputs */}
          <Input name="name" placeholder="Name" {...{ setFormData, validationErrors }} />
          <Input name="lastname" placeholder="Apellido" {...{ setFormData, validationErrors }} />
          <Input name="sex" placeholder="Sexo" {...{ setFormData, validationErrors }} />
          <Input name='weight' placeholder='Peso' type='number' {...{ setFormData, validationErrors }} />
          <Input name='diagnosis' placeholder='Diagnóstico' {...{ setFormData, validationErrors }} />
          <Input name='birthday' placeholder='Cumpleaños' type='date' {...{ setFormData, validationErrors }} />
          <CheckboxField
            errorMessage={validationErrors.isDoctor}
            hasError={!!validationErrors.isDoctor}
            name='isDoctor'
            onChange={e => setIsDoctor(e.target.isDoctor)}
            isDoctor={isDoctor}
            value='yes'
            label='Soy Doctor'
          />
          {!isDoctor && (
            <SelectField required={!isDoctor} name='doctor' placeholder='Doctor'>
              <option value='apple'>Apple</option>
              <option value='banana'>Banana</option>
              <option value='orange'>Orange</option>
              <option value='zucchini' disabled>
                Zucchini
              </option>
            </SelectField>
          )}
        </>
      )
    }
  }
}

export default SignUp
