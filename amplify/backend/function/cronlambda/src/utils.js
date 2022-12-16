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

const formatDate = date => date.replace(/T/, ' ').replace(/Z/, '')

module.exports = {
  getHeartbeatIndicator,
  getSpo2Indicator,
  average,
  formatDate
}
