import React from 'react'
import {
  Authenticator,
  CheckboxField
} from '@aws-amplify/ui-react'

function SignUp() {
  return {
    FormFields() {
      return (
        <>
          {/* Re-use default `Authenticator.SignUp.FormFields` */}
          <Authenticator.SignUp.FormFields />
          {/*Custom inputs */}
          <CheckboxField
            name='custom:role'
            value='doctor'
            label='Soy Doctor'
          />
        </>
      )
    }
  }
}

export default SignUp
