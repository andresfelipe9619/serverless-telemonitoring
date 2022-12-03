// Some Reference: https://docs.aws.amazon.com/sns/latest/api/API_Publish.html

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_APPDATA_ARN
	STORAGE_APPDATA_NAME
	STORAGE_APPDATA_STREAMARN
	STORAGE_TELEMONITORING_ARN
	STORAGE_TELEMONITORING_NAME
	STORAGE_TELEMONITORING_STREAMARN
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
const format = require('date-fns/format')
const set = require('date-fns/set')
const sub = require('date-fns/sub')
const { getSpo2Indicator, getHeartbeatIndicator, average } = require('./utils')

const dynamodb = new AWS.DynamoDB.DocumentClient()
const sns = new AWS.SNS()
const ses = new AWS.SES()

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss'
const SUBJECT = 'INFORME CONSOLIDADO DE TELEMONITOREO DE SIGNOS VITALES'

exports.handler = async event => {
  console.log(`EVENT: ${JSON.stringify(event)}`)
  try {
    const today = new Date()
    const yesterday = sub(today, { days: 1 })
    const start_date = format(
      set(yesterday, {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      }),
      DATE_FORMAT
    )
    const end_date = format(
      set(yesterday, {
        hours: 23,
        minutes: 59,
        seconds: 59
      }),
      DATE_FORMAT
    )
    console.log('start_date', start_date)
    console.log('end_date', end_date)
    const Patients = await getPatients()
    console.log('Count: ', Patients.Count)
    await Promise.all(
      Patients.Items.filter(p => p.device_id).map(p =>
        notifyPatient(p, { start_date, end_date })
      )
    )
  } catch (error) {
    return {
      statusCode: 500,
      error: 'Could not notify Patients: ' + error
    }
  }

  return {
    statusCode: 200,
    body: 'Patients notified correctly!'
  }
}

async function notifyPatient (patient, query) {
  console.log('Patient: ', patient)
  try {
    const { email, phone, device_id } = patient
    const params = {
      device_id,
      ...query
    }
    const Telemonitoring = await getTelemonitoringData(params)
    console.log('Telemonitoring Count: ', Telemonitoring.Count)
    const { spo2, heartbeat } = groupData(Telemonitoring.Items)
    const spo2Average = average(spo2)
    const heartbeatAverage = average(heartbeat)

    const spo2Indicator = getSpo2Indicator(spo2Average)
    const heartbeatIndicator = getHeartbeatIndicator(heartbeatAverage)
    const salute = `Buen día ${patient.name} ${patient.lastname}, 
    aquí le enviamos el informe de su telemonitoreo de signos vitales de ayer,
    le sugerimos seguir las siguientes recomendaciones:`

    const tableProps = {
      salute,
      spo2Average,
      spo2Indicator,
      heartbeatIndicator,
      heartbeatAverage
    }
    const emailMessage = buildEmail(tableProps)
    try {
      await sendEmail(email, SUBJECT, emailMessage)
    } catch (error) {
      console.error('Error Sending Email to ' + patient?.email + ': ' + error)
    }
    try {
      if (phone) {
        const smsMessage = buildSMS(tableProps)
        await sendSMS(phone, `${SUBJECT}\n${smsMessage}`)
      }
    } catch (error) {
      console.error('Error Sending SMS to' + patient?.phone + ': ' + error)
    }
  } catch (error) {
    console.error('Error Building message for ' + patient?.email + ': ' + error)
  }
}

function buildSMS ({
  salute,
  spo2Average,
  spo2Indicator,
  heartbeatIndicator,
  heartbeatAverage
}) {
  return `
  ${salute}\n
  SPO2: ${spo2Average} - ${spo2Indicator.name}\n
  F.Cardiaca: ${heartbeatAverage} - ${heartbeatIndicator.name}`
}

function buildEmail ({
  salute,
  spo2Average,
  spo2Indicator,
  heartbeatIndicator,
  heartbeatAverage
}) {
  return `
  <p>${salute}</p>
  <table>
    <thead>
      <tr>
        <th>
          <strong>Signo Vital</strong>
        </th>
        <th>
          <strong>Valor</strong>
        </th>
        <th>
          <strong>Indicador</strong>
        </th>
        <th>
          <strong>Recomendación</strong>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>SPO2</td>
        <td>${spo2Average}</td>
        <td>
          ${spo2Indicator.name}
        </td>
        <td>${spo2Indicator.tips}</td>
      </tr>
      <tr>
        <td>F. Cardiaca</td>
        <td>${heartbeatAverage}</td>
        <td>
          ${heartbeatIndicator.name}
        </td>
        <td>${heartbeatIndicator.tips}</td>
      </tr>
    </tbody>
  </table>`
}

function groupData (data) {
  const grouped = data.reduce(
    (acc, item) => {
      return {
        ...acc,
        spo2: acc.spo2.concat(item.SPO2 || []),
        heartbeat: acc.heartbeat.concat(item.HeartBeat || [])
      }
    },
    {
      spo2: [],
      heartbeat: []
    }
  )
  return grouped
}

function getTelemonitoringData (params) {
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
    TableName: process.env.STORAGE_TELEMONITORING_NAME,
    ...(size ? { PageSize: size } : {}),
    KeyConditionExpression: buildConditionExpression(),
    ExpressionAttributeNames: {
      ...(haveDateRange ? { '#timeSK': 'SK' } : {}),
      '#timePK': 'PK'
    },
    ExpressionAttributeValues: {
      ':time': `TIMESTAMP#${device_id}`,
      ...(haveDateRange
        ? { ':endDate': end_date, ':startDate': start_date }
        : {})
    }
  }
  return dynamodb.query(queryParams).promise()
}

function getPatients () {
  const queryParams = {
    TableName: process.env.STORAGE_APPDATA_NAME,
    KeyConditionExpression: 'PK = :rol',
    ExpressionAttributeValues: {
      ':rol': 'PATIENT'
    }
  }
  return dynamodb.query(queryParams).promise()
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
          Html: {
            Charset: 'UTF-8',
            Data: message
          }
        }
      }
    })
    .promise()
  console.log('emailResult', emailResult)
  return emailResult
}
