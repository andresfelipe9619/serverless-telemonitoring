import React, { Component } from 'react'
import { Line, ResponsiveLine } from '@nivo/line'
import range from 'lodash/range'
import last from 'lodash/last'
import { timeFormat } from 'd3-time-format'
import * as time from 'd3-time'
import { format } from 'date-fns'
import { DATE_FORMAT } from '../../utils'
import useResponsive from '../../hooks/useResponsive'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const Chart = ({ data, timestamp = false }) => {
  const { isMobile } = useResponsive()
  const xFormat = timestamp ? formatTimestamp : formatDate

  return (
    <ResponsiveLine
      data={buildChartData(data)}
      margin={
        isMobile
          ? { top: 50, right: 10, bottom: 160, left: 10 }
          : { top: 50, right: 60, bottom: 160, left: 60 }
      }
      yScale={{
        type: 'linear',
        stacked: false
      }}
      colors={{ scheme: 'category10' }}
      xFormat={xFormat}
      axisTop={null}
      axisRight={null}
      axisBottom={
        isMobile
          ? null
          : {
              tickRotation: 90,
              format: xFormat,
              legend: 'Time scale',
              legendOffset: -12
            }
      }
      axisLeft={{
        orient: 'left',
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle'
      }}
      enablePoints={false}
      enableGridX={true}
      curve='monotoneX'
      enableSlices={false}
      motionStiffness={120}
      motionDamping={50}
      useMesh={true}
      theme={{
        grid: { line: { stroke: '#ddd', strokeDasharray: '1 2' } }
      }}
      legends={[
        {
          anchor: 'bottom-left',
          direction: 'column',
          justify: false,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
  )
}

const commonProperties = {
  width: 900,
  height: 400,
  margin: { top: 20, right: 20, bottom: 60, left: 80 },
  animate: true,
  enableSlices: 'x'
}

class RealTimeChart extends Component {
  constructor (props) {
    super(props)

    const date = new Date()
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)

    this.state = {
      dataA: range(100).map(i => ({
        x: time.timeMinute.offset(date, i * 30),
        y: 10 + Math.round(Math.random() * 20)
      })),
      dataB: range(100).map(i => ({
        x: time.timeMinute.offset(date, i * 30),
        y: 30 + Math.round(Math.random() * 20)
      })),
      dataC: range(100).map(i => ({
        x: time.timeMinute.offset(date, i * 30),
        y: 60 + Math.round(Math.random() * 20)
      }))
    }

    this.formatTime = timeFormat('%Y %b %d')
  }

  componentDidMount () {
    this.timer = setInterval(this.next, 100)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  next = () => {
    const dataA = this.state.dataA.slice(1)
    dataA.push({
      x: time.timeMinute.offset(last(dataA).x, 30),
      y: 10 + Math.round(Math.random() * 20)
    })
    const dataB = this.state.dataB.slice(1)
    dataB.push({
      x: time.timeMinute.offset(last(dataB).x, 30),
      y: 30 + Math.round(Math.random() * 20)
    })
    const dataC = this.state.dataC.slice(1)
    dataC.push({
      x: time.timeMinute.offset(last(dataC).x, 30),
      y: 60 + Math.round(Math.random() * 20)
    })

    this.setState({ dataA, dataB, dataC })
  }

  render () {
    const { dataA, dataB, dataC } = this.state

    return (
      <Line
        {...commonProperties}
        margin={{ top: 30, right: 50, bottom: 60, left: 50 }}
        data={[
          { id: 'A', data: dataA },
          { id: 'B', data: dataB },
          { id: 'C', data: dataC }
        ]}
        xScale={{ type: 'time', format: 'native' }}
        yScale={{ type: 'linear', max: 100 }}
        axisTop={{
          format: '%H:%M',
          tickValues: 'every 4 hours'
        }}
        axisBottom={{
          format: '%H:%M',
          tickValues: 'every 4 hours',
          legend: `${this.formatTime(dataA[0].x)} ????????? ${this.formatTime(
            last(dataA).x
          )}`,
          legendPosition: 'middle',
          legendOffset: 46
        }}
        axisRight={{}}
        enablePoints={false}
        enableGridX={true}
        curve='monotoneX'
        animate={false}
        motionStiffness={120}
        motionDamping={50}
        isInteractive={false}
        enableSlices={false}
        useMesh={true}
        theme={{
          axis: { ticks: { text: { fontSize: 14 } } },
          grid: { line: { stroke: '#ddd', strokeDasharray: '1 2' } }
        }}
      />
    )
  }
}

function formatDate (timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp + 'Z')
  return format(date, DATE_FORMAT)
}

function formatTimestamp (timestamp) {
  if (!timestamp) return ''
  return format(new Date(timestamp + 'Z'), 'HH:mm:ss')
}

const defaultChartData = [
  {
    id: 'Spo2',
    data: []
  },
  {
    id: 'HeartBeat',
    data: []
  }
]

function buildChartData (data) {
  const result = data
    // .sort((a, b) => new Date(b.SK) - new Date(a.SK))
    .reduce((chartData, item) => {
      let [HeartBeat, SPO2] = chartData
      if (!item.SK) return chartData
      let [x] = item.SK.split('.')
      if (!x || isNaN(item.HeartBeat) || isNaN(item.SPO2)) return chartData
      if (item.HeartBeat < 0 || item.SPO2 < 0) return chartData
      return [
        {
          ...HeartBeat,
          data: [...HeartBeat.data, { x, y: item.HeartBeat }]
        },
        {
          ...SPO2,
          data: [...SPO2.data, { x, y: item.SPO2 }]
        }
      ]
    }, defaultChartData)
  console.log('CHART DATA', result)
  return result
}

export { RealTimeChart }
export default Chart
