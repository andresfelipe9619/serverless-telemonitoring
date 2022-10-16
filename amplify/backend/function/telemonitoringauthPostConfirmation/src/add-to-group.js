const aws = require('aws-sdk')

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
})

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */
exports.handler = async event => {
  console.log('event', event)
  const userRole = event?.request?.userAttributes['custom:role']
  console.log('userRole', userRole)
  const isPatient = userRole === 'patient'
  const GroupName = isPatient ? 'Patients' : process.env.GROUP

  const groupParams = {
    GroupName,
    UserPoolId: event.userPoolId
  }
  const addUserParams = {
    ...groupParams,
    Username: event.userName
  }
  /**
   * Check if the group exists; if it doesn't, create it.
   */
  try {
    await cognitoidentityserviceprovider.getGroup(groupParams).promise()
  } catch (e) {
    await cognitoidentityserviceprovider.createGroup(groupParams).promise()
  }
  /**
   * Then, add the user to the group.
   */
  await cognitoidentityserviceprovider
    .adminAddUserToGroup(addUserParams)
    .promise()

  return event
}
