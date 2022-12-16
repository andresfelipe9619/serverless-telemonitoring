export const DATE_FORMAT = 'PPpp'

export function splitArrayIntoChunksOfLen (arr, len) {
  var chunks = [],
    i = 0,
    n = arr.length
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)))
  }
  return chunks
}

export const map2select = ([value, label]) => ({ label, value })

export function pluralize (word, count) {
  return `${word}${count === 1 ? '' : 's'}`
}

export function nullifyObjectEmptyStrings (object) {
  return Object.entries(object).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: replaceEmptyStringWithNull(value)
    }),
    {}
  )
}

const getHeartbeatIndicator = average => {
  if (average >= 100) {
    return {
      name: 'Taquicardia',
      color: 'var(--amplify-colors-red-40)',
      tips: 'Es necesario contactar a su médico tratante para recibir atención prioritaria, Evitar la ingesta de estimulantes, mantener una adecuada idratación y realizar ejercicios de respiración pueden ayudar.'
    }
  }
  if (average >= 60) {
    return {
      name: 'Normal',
      color: 'var(--amplify-colors-green-40)',
      tips: ''
    }
  }
  return {
    name: 'Bradicardia',
    color: 'var(--amplify-colors-red-40)',
    tips: 'Es necesario contactar a su médico tratante para recibir atención proritaria, Hacer actividad la mayoría de los días de la semana o bien todos los días. Su médico puede indicarle qué nivel de ejercicio es su adecuado.'
  }
}

const getSpo2Indicator = average => {
  if (average >= 95) {
    return {
      name: 'Normal',
      color: 'var(--amplify-colors-green-40)',
      tips: 'Realizar ejercicio de manera regular, llevar una dieta rica en hierro y tomar aire fresco puede ayudar con tu salud.'
    }
  }
  if (average >= 91) {
    return {
      name: 'Hipoxia Leve',
      color: 'var(--amplify-colors-yellow-40)',
      tips: 'Es necesario contactar a su médico tratante para identificar los síntomas que indiquen esta disminución.'
    }
  }
  if (average >= 86) {
    return {
      name: 'Hipoxia Moderada',
      color: 'var(--amplify-colors-orange-40)',
      tips: 'Es necesario contactar a su médico lo antes posible para identificar los síntomas que indiquen esta disminución, debe adquirir suministro de oxigeno asistido'
    }
  }
  return {
    name: 'Hipoxia Grave',
    color: 'var(--amplify-colors-red-40)',
    tips: 'Es necesario contactar a su médico lo antes posible para identificar los síntomas que indiquen esta disminución, debe adquirir suministro de oxigeno asistido de manera inmediata.'
  }
}

const average = data =>
  Math.round(data.reduce((a, b) => a + b, 0) / data.length)

export function calculateIndicators (data) {
  const { spo2, heartbeat } = data.reduce(
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
  const spo2Average = average(spo2)
  const heartbeatAverage = average(heartbeat)

  const spo2Indicator = getSpo2Indicator(spo2Average)
  const heartbeatIndicator = getHeartbeatIndicator(heartbeatAverage)
  return {
    heartbeat: { average: heartbeatAverage, indicator: heartbeatIndicator },
    spo2: { average: spo2Average, indicator: spo2Indicator }
  }
}

export function replaceEmptyStringWithNull (value) {
  if (!value) return null
  return value
}

export const isDate = item =>
  isNaN(item) && new Date(item) !== 'Invalid Date' && !isNaN(new Date(item))

export const isObject = item => !!item && typeof item === 'object'

export const isBoolean = item => typeof item === 'boolean'

export const isNullish = item => typeof item === 'undefined' || item === null
