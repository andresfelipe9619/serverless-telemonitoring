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

const tableName = 'TelemonitoringData-dev'

const userIdPresent = false // TODO: update in case is required to use that definition
const partitionKeyName = 'PK'
const partitionKeyType = 'S'
const sortKeyName = 'SK'
const sortKeyType = 'S'
const hasSortKey = sortKeyName !== ''
const path = '/telemonitoring'
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

const getEvent = req => req?.apiGateway?.event || {}

function getParams (req) {
  return getEvent(req).queryStringParameters || {}
}

function getCognitoIdentityId (req) {
  return getEvent(req).requestContext?.identity?.cognitoIdentityId || UNAUTH
}

/********************************
 * HTTP Get method for list devices *
 ********************************/

 app.get(path + '/devices', function (req, res) {
  console.log('Getting devices...')
  const queryParams = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :device',
    ExpressionAttributeValues: {
      ':device': 'DEVICE'
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

/********************************
 * HTTP Get method for list timestamps *
 ********************************/

app.get(path + hashKeyPath, function (req, res) {
  const params = getParams(req)
  console.log('params', params)
  const { size, device_id, start_date, end_date } = params
  const haveDateRange = start_date && end_date

  const buildConditionExpression = () => {
    let condition = '#timePK = :time'
    if (haveDateRange) {
      return condition + ' AND #timeSK BETWEEN :startDate AND :endDate'
    }
    return condition
  }

  const queryParams = {
    TableName: tableName,
    ConsistentRead: true,
    ...(size ? { PageSize: size } : {}),
    KeyConditionExpression: buildConditionExpression(),
    ExpressionAttributeNames: {
      ...(haveDateRange ? { '#timeSK': 'SK' } : {}),
      '#timePK': 'PK'
    },
    ExpressionAttributeValues: {
      ':time': `TIMESTAMP#${device_id}`,
      ...(haveDateRange ? { ':endDate': end_date, ':startDate': start_date } : {})
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
    params[partitionKeyName] = getCognitoIdentityId(req)
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
 * HTTP put method for insert object *
 *************************************/

app.put(path, function (req, res) {
  if (userIdPresent) {
    req.body['userId'] = getCognitoIdentityId(req)
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

app.post(path, function (req, res) {
  if (userIdPresent) {
    req.body['userId'] = getCognitoIdentityId(req)
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
      res.json({ success: 'post call succeed!', url: req.url, data: data })
    }
  })
})

/**************************************
 * HTTP remove method to delete object *
 ***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  const params = {}
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = getCognitoIdentityId(req)
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

app.listen(3000, function () {
  console.log('App started')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
