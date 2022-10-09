import React from 'react'
import { Tabs, TabItem } from '@aws-amplify/ui-react'
import PatientsPage from './patients/PatientsPage'
import ReportsPage from './reports/ReportsPage'

export default function Pages (props) {
  return (
    <div className='App'>
      <Tabs>
        <TabItem title='Pacientes'>
          <PatientsPage {...props} />
        </TabItem>
        <TabItem title='Reportes'>
          <ReportsPage {...props} />
        </TabItem>
      </Tabs>
    </div>
  )
}
