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

const average = data =>
  Math.round(data.reduce((a, b) => a + b, 0) / data.length)

const formatDate = date => date.replace(/T/, ' ').replace(/Z/, '')

module.exports = {
  getHeartbeatIndicator,
  getSpo2Indicator,
  average,
  formatDate
}
