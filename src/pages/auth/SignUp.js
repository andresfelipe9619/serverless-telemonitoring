import React from 'react'
import {
  Authenticator,
  useAuthenticator,
  CheckboxField,
  SelectField,
  TextField
} from '@aws-amplify/ui-react'

function SignUp () {
  return {
    FormFields () {
      const { validationErrors } = useAuthenticator()
      const [checked, setChecked] = React.useState(false)

      return (
        <>
          {/* Re-use default `Authenticator.SignUp.FormFields` */}
          <Authenticator.SignUp.FormFields />
          {/*Custom inputs */}
          <TextField
            required
            name='name'
            placeholder='Nombre'
            errorMessage={validationErrors.name}
            hasError={!!validationErrors.name}
          />
          <TextField
            required
            name='lastname'
            placeholder='Apellido'
            errorMessage={validationErrors.lastname}
            hasError={!!validationErrors.lastname}
          />

          <TextField
            required
            name='sex'
            placeholder='Sexo'
            errorMessage={validationErrors.sex}
            hasError={!!validationErrors.sex}
          />
          <TextField required name='weight' placeholder='Peso' type='number' />
          <TextField required name='diagnosis' placeholder='Diagnóstico' />
          <TextField
            required
            name='birthday'
            type='date'
            label='Cumpleaños'
            errorMessage={validationErrors.birthday}
            hasError={!!validationErrors.birthday}
          />
          <CheckboxField
            errorMessage={validationErrors.isDoctor}
            hasError={!!validationErrors.isDoctor}
            name='isDoctor'
            onChange={e => setChecked(e.target.checked)}
            checked={checked}
            value='yes'
            label='Soy Doctor'
          />
          {!checked && (
            <SelectField required={!checked} name='doctor' placeholder='Doctor'>
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
