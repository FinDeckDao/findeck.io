import { FC } from 'react'
import { ResponsiveBar } from '@nivo/bar'

export interface ROIBarChartProps {
  roi: number
}

export const ROIBarChart: FC<ROIBarChartProps> = (props) => {
  const { roi } = props
  const defaultHigh = 150
  const tickValues = [-100, -50, 0, 50, 100, defaultHigh]
  const overTickValues = [-100, -50, 0, 50, 100, defaultHigh, roi.toFixed(0)]
  const useTickValue = roi > defaultHigh ? overTickValues : tickValues
  const maxChartHeight = roi > defaultHigh ? roi.toFixed(2) : defaultHigh

  const data = [{
    id: 'Current',
    ROI: roi.toFixed(2),
    ROIColor: roi >= 0 ? '#4ecdc4' : '#ff6b6b'
  }]

  return (
    <div style={{ height: 400, width: '100%' }}>
      <ResponsiveBar
        data={data}
        keys={['ROI']}
        indexBy="id"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear', min: -100, max: Number(maxChartHeight) }}
        indexScale={{ type: 'band', round: true }}
        colors={({ data }) => data.ROIColor}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'ROI',
          legendPosition: 'middle',
          legendOffset: 32
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'ROI (%)',
          legendPosition: 'middle',
          legendOffset: -40,
          tickValues: useTickValue
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#ffffff"
        markers={[
          {
            axis: 'y',
            value: 0,
            lineStyle: { stroke: '#b0b0b0', strokeWidth: 1 }
          }
        ]}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'top-right',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: -30,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        theme={{
          background: "#1a1a1a",
          text: {
            fontSize: 11,
            fill: "#888888",
            outlineWidth: 0,
            outlineColor: "transparent",
          },
          axis: {
            domain: {
              line: {
                stroke: "#777777",
                strokeWidth: 1,
              },
            },
            legend: {
              text: {
                fontSize: 12,
                fill: "#999999",
              },
            },
            ticks: {
              line: {
                stroke: "#777777",
                strokeWidth: 1,
              },
              text: {
                fontSize: 11,
                fill: "#888888",
              },
            },
          },
          grid: {
            line: {
              stroke: "#444444",
              strokeWidth: 1,
            },
          },
          legends: {
            text: {
              fontSize: 11,
              fill: "#888888",
            },
            ticks: {
              line: {},
              text: {
                fontSize: 10,
                fill: "#888888",
              },
            },
            title: {
              text: {
                fontSize: 11,
                fill: "#999999",
              },
            },
          },
          annotations: {
            text: {
              fontSize: 13,
              fill: "#888888",
              outlineWidth: 2,
              outlineColor: "#ffffff",
              outlineOpacity: 1,
            },
            link: {
              stroke: "#777777",
              strokeWidth: 1,
              outlineWidth: 2,
              outlineColor: "#ffffff",
              outlineOpacity: 1,
            },
            outline: {
              stroke: "#777777",
              strokeWidth: 1,
              outlineWidth: 2,
              outlineColor: "#ffffff",
              outlineOpacity: 1,
            },
            symbol: {
              fill: "#999999",
              outlineWidth: 2,
              outlineColor: "#ffffff",
              outlineOpacity: 1,
            },
          },
          tooltip: {
            container: {
              background: "#000000",
              color: "#ffffff",
              fontSize: 12,
            },
            basic: {},
            chip: {},
            table: {},
            tableCell: {},
            tableCellValue: {},
          },
        }}
        role="application"
        ariaLabel="ROI bar chart"
        barAriaLabel={e => `ROI: ${e.value}%`}
      />
    </div>
  )
}