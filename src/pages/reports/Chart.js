import { ResponsiveLine } from '@nivo/line'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const Chart = ({ data }) => (
  <ResponsiveLine
    data={buildChartData(data)}
    margin={{ top: 50, right: 110, bottom: 120, left: 60 }}
    // xScale={{
    //   type: 'time',
    //   format: '%Y-%m-%d %H:%M:%S',
    //   useUTC: false,
    //   precision: 'second'
    // }}
    // xFormat='time:%Y-%m-%d %H:%M:%S'
    yScale={{
      type: 'linear',
      stacked: false
    }}
    colors={{ scheme: 'category10' }}
    xFormat={formatTimestamp}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickRotation: 90,
      format: formatTimestamp,
      tickValues: 5,
      legend: 'Time scale',
      legendOffset: -12
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
    enableSlices={false}
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

function formatTimestamp (timestamp) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
  return new Date(timestamp).toLocaleString('en-US', options)
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
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .reduce((chartData, item) => {
      let [HeartBeat, SPO2] = chartData
      if (!item.timestamp) return chartData
      let [x] = item.timestamp.split('.')
      if (!x || isNaN(item.HeartBeat) || isNaN(item.Spo2)) return chartData
      if (item.HeartBeat < 0 || item.Spo2 < 0) return chartData
      return [
        {
          ...HeartBeat,
          data: [...HeartBeat.data, { x, y: item.HeartBeat }]
        },
        {
          ...SPO2,
          data: [...SPO2.data, { x, y: item.Spo2 }]
        }
      ]
    }, defaultChartData)
  console.log('CHART DATA', result)
  return result
}

export default Chart
