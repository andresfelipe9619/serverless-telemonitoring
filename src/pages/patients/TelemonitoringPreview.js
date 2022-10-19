import { Loader, View } from '@aws-amplify/ui-react'
import React, { useEffect } from 'react'
import useTelemonitoring from '../../hooks/useTelemonitoring'
import ErrorAlert from '../error/ErrorAlert'
import { ResponsiveLine } from '@nivo/line'

export default function TelemonitoringPreview () {
  const [
    { data, error, loading },
    { getTelemonitoringData }
  ] = useTelemonitoring()

  useEffect(() => {
    getTelemonitoringData()
    // eslint-disable-next-line
  }, [])

  return (
    <View height='20vh'>
      {loading && <Loader variation='linear' />}
      <ErrorAlert error={error} />
      {!!data.length && <Chart data={data} />}
    </View>
  )
}

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const Chart = ({ data }) => (
  <ResponsiveLine
    data={buildChartData(data)}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false
    }}
    yFormat=' >-.2f'
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'transportation',
      legendOffset: 36,
      legendPosition: 'middle'
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'count',
      legendOffset: -40,
      legendPosition: 'middle'
    }}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 100,
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

function buildChartData (data) {
  return data.reduce(
    (chartData, item) => {
      let [HeartBeat, SPO2] = chartData
      let x = item.timestamp
      SPO2.data.push({ x, y: item.Spo2 })
      HeartBeat.data.push({ x, y: item.HeartBeat })
      return chartData
    },
    [
      {
        id: 'HeartBeat',
        color: 'hsl(16, 70%, 50%)',
        data: []
      },
      {
        id: 'Spo2',
        color: 'hsl(101, 70%, 50%)',
        data: []
      }
    ]
  )
}
