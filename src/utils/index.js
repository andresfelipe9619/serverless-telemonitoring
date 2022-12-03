export const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss'

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
  if (average >= 98) {
    return {
      name: 'Inadecuado',
      color: 'var(--amplify-colors-red-40)',
      tips: ''
    }
  }
  if (average >= 80) {
    return {
      name: 'Normal',
      color: 'var(--amplify-colors-orange-40)',
      tips: ''
    }
  }
  if (average >= 70) {
    return {
      name: 'Bueno',
      color: 'var(--amplify-colors-yellow-40)',
      tips: ''
    }
  }
  if (average >= 40) {
    return {
      name: 'Excelente',
      color: 'var(--amplify-colors-green-40)',
      tips: ''
    }
  }
  return {
    name: 'Inadecuado',
    color: 'var(--amplify-colors-red-40)',
    tips: ''
  }
}

const getSpo2Indicator = average => {
  if (average >= 98) {
    return {
      name: 'Normal',
      color: 'var(--amplify-colors-green-40)',
      tips: 'Todo bien'
    }
  }
  if (average >= 95) {
    return {
      name: 'Insuficiente',
      color: 'var(--amplify-colors-yellow-40)',
      tips: 'Tolerable, paciente dificlmente nota influencia alguna'
    }
  }
  if (average >= 90) {
    return {
      name: 'Disminuido',
      color: 'var(--amplify-colors-orange-40)',
      tips: 'Intervención inmediata'
    }
  }
  return {
    name: 'Crítico',
    color: 'var(--amplify-colors-red-40)',
    tips: 'Remitir a un especialista'
  }
}

export function calculateAge (birthday) {
  // birthday is a date
  const ageDifMs = Date.now() - birthday.getTime()
  const ageDate = new Date(ageDifMs) // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970)
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
