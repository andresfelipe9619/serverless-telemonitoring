/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION })

const dynamodb = new AWS.DynamoDB.DocumentClient()
const sns = new AWS.SNS()
const ses = new AWS.SES()

const tableName = 'AppData-dev'

const userIdPresent = false // TODO: update in case is required to use that definition
const partitionKeyName = 'PK'
const partitionKeyType = 'S'
const sortKeyName = 'SK'
const sortKeyType = 'S'
const hasSortKey = sortKeyName !== ''
const path = '/app'
const UNAUTH = 'UNAUTH'
const hashKeyPath = '/:' + partitionKeyName
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : ''

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case 'N':
      return Number.parseInt(param)
    default:
      return param
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + hashKeyPath, function (req, res) {
  const params = req.apiGateway.event.queryStringParameters
  console.log('params', params)
  const { role = '', doctor } = params

  const queryParams = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :rol',
    ...(doctor
      ? {
          FilterExpression: '#doctor = :doctor',
          ExpressionAttributeNames: {
            '#doctor': 'doctor'
          }
        }
      : {}),
    ExpressionAttributeValues: {
      ':rol': role.toUpperCase(),
      ...(doctor ? { ':doctor': doctor } : {})
    }
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: 'Could not load items: ' + err })
    } else {
      console.log('data', data)
      res.json(data.Items)
    }
  })
})

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  const params = {}
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  } else {
    params[partitionKeyName] = req.params[partitionKeyName]
    try {
      params[partitionKeyName] = convertUrlType(
        req.params[partitionKeyName],
        partitionKeyType
      )
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Wrong column type ' + err })
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType)
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Wrong column type ' + err })
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: 'Could not load items: ' + err.message })
    } else {
      if (data.Item) {
        res.json(data.Item)
      } else {
        res.json(data)
      }
    }
  })
})

/************************************
 * HTTP put method for update object *
 *************************************/

app.put(path, function (req, res) {
  const { requestContext } = req?.apiGateway?.event || {}
  if (userIdPresent) {
    req.body['userId'] = requestContext.identity.cognitoIdentityId || UNAUTH
  }
  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: err, url: req.url, body: req.body })
    } else {
      res.json({ success: 'put call succeed!', url: req.url, data: data })
    }
  })
})

/************************************
 * HTTP post method for insert object *
 *************************************/

app.post(path, async function (req, res) {
  const { url, body, apiGateway } = req
  const { identity } = apiGateway?.event?.requestContext || {}
  if (userIdPresent) {
    body['userId'] = identity.cognitoIdentityId || UNAUTH
  }
  const { doctor, notify, ...patient } = body
  if (doctor) patient.doctor = doctor?.SK || ''
  const putItemParams = {
    TableName: tableName,
    Item: patient
  }
  try {
    const data = await dynamodb.put(putItemParams).promise()
    if (doctor && notify) await notifyDoctorForNewPatientAssigned(doctor, patient)
    res.json({ success: 'post call succeed!', url, data })
  } catch (error) {
    res.statusCode = 500
    res.json({ error, url, body })
  }
})

/**************************************
 * HTTP remove method to delete object *
 ***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  const params = {}
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  } else {
    params[partitionKeyName] = req.params[partitionKeyName]
    try {
      params[partitionKeyName] = convertUrlType(
        req.params[partitionKeyName],
        partitionKeyType
      )
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Wrong column type ' + err })
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType)
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Wrong column type ' + err })
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: err, url: req.url })
    } else {
      res.json({ url: req.url, data: data })
    }
  })
})

async function notifyDoctorForNewPatientAssigned (doctor, patient) {
  const subject = 'Nuevo Paciente Asignado.'
  const message = `Buen día ${doctor.name}.\n
  El Paciente ${patient.name} ha solicitado su atención para realizar el diagnostico de signos vitales
  a continuación le compartimos los datos de su paciente asignado, si desea realizar monitoreo dar click aqui.\n`
  if (doctor?.phone) {
    await sendSMS(doctor.phone, `${subject}\n${message}`)
  }
  if (doctor?.email) {
    await sendEmail(doctor.email, subject, message)
  }
}

async function sendSMS (to, message) {
  const smsResult = await sns
    .publish({
      Message: message,
      PhoneNumber: to
    })
    .promise()
  console.log('smsResult', smsResult)
  return smsResult
}

async function sendEmail (to, subject, message) {
  const emailResult = await ses
    .sendEmail({
      Destination: {
        ToAddresses: [to]
      },
      Source: 'andresfelipe9619@gmail.com',
      Message: {
        Subject: { Data: subject },
        Body: {
          Text: {
            Data: message
          }
        }
      }
    })
    .promise()
  console.log('emailResult', emailResult)
  return emailResult
}

app.listen(3000, function () {
  console.log('App started')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
