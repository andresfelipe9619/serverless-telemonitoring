const AWS = require('aws-sdk')

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
})

AWS.config.update({ region: 'us-east-1' })

const dynamodb = new AWS.DynamoDB.DocumentClient()

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */
exports.handler = async event => {
  console.log('event', event)
  const tableName = 'AppData-dev'
  const { userPoolId: UserPoolId, request, userName: cognito_id } = event
  const { email, 'custom:role': userRole } = request.userAttributes
  console.log('userRole', userRole)
  const isPatient = userRole === 'patient'
  const GroupName = isPatient ? 'Patients' : process.env.GROUP
  const groupParams = {
    GroupName,
    UserPoolId
  }
  const addUserParams = {
    ...groupParams,
    Username: cognito_id
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

  const putItemParams = {
    TableName: tableName,
    Item: { cognito_id, email }
  }
  try {
    const data = await dynamodb.put(putItemParams).promise()
    console.log('data', data)
  } catch (error) {
    console.error('Error', error)
  }

  return event
}
