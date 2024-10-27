import { useState, FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveLine } from '@nivo/line'

interface MoonBagCalculatorProps {
  initialBaseAmount: number
  initialQuoteAmount: number
  currentPrice: number
}

interface CalculationResult {
  sellAmount: number
  recoveredAmount: number
  remainingAmount: number
  isProfitable: boolean
}

const calculateMoonBag = (initialBase: number, initialQuote: number, targetPrice: number): CalculationResult => {
  const sellAmount = initialQuote / targetPrice
  const recoveredAmount = sellAmount * targetPrice
  const remainingAmount = initialBase - sellAmount
  const costBasis = initialQuote / initialBase

  return {
    sellAmount,
    recoveredAmount,
    remainingAmount,
    isProfitable: targetPrice > costBasis
  }
}

const generatePriceScenarios = (costBasis: number, currentPrice: number) => {
  const minPrice = costBasis * 0.5
  const maxPrice = Math.max(currentPrice * 2.5, costBasis * 2)
  const steps = 10
  const increment = (maxPrice - minPrice) / steps

  return Array.from({ length: steps + 1 }, (_, i) => {
    const price = minPrice + (increment * i)
    return {
      x: price,
      y: calculateMoonBag(1, costBasis, price).remainingAmount
    }
  })
}

export const MoonBagCalculator: FC<MoonBagCalculatorProps> = (props) => {
  const { initialBaseAmount, initialQuoteAmount, currentPrice } = props
  const [selectedScenario, _setSelectedScenario] = useState(currentPrice)
  const costBasis = initialQuoteAmount / initialBaseAmount
  const currentResult = calculateMoonBag(initialBaseAmount, initialQuoteAmount, selectedScenario)

  const chartData = [{
    id: "Moon Bag Size",
    data: generatePriceScenarios(costBasis, currentPrice)
  }]

  return (
    <div className="space-y-4">
      <Card className="w-full bg-dark text-white">
        <CardHeader>
          <CardTitle>Moon Bag Calculation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-muted-foreground">Cost Basis:</div>
            <div>{costBasis.toFixed(2)}</div>

            <div className="text-muted-foreground">Potential Sell Price:</div>
            <div>{selectedScenario.toFixed(2)}</div>

            <div className="text-muted-foreground">Amount to Sell:</div>
            <div>{currentResult.sellAmount.toFixed(4)} $BASE</div>

            <div className="text-muted-foreground">Risk-free Remainder:</div>
            <div>{currentResult.remainingAmount.toFixed(4)} $BASE</div>
          </div>
          <div className="h-[300px]">
            <ResponsiveLine
              data={chartData}
              margin={{ top: 20, right: 30, bottom: 50, left: 50 }}
              xScale={{ type: 'linear' }}
              yScale={{ type: 'linear' }}
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
                      stroke: 'hsl(var(--muted-foreground))',
                      strokeWidth: 1
                    }
                  },
                  ticks: {
                    line: {
                      stroke: 'hsl(var(--muted-foreground))',
                      strokeWidth: 1
                    },
                    text: {
                      fill: 'hsl(var(--muted-foreground))'
                    }
                  },
                  legend: {
                    text: {
                      fill: 'hsl(var(--muted-foreground))',
                      fontSize: 12
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: 'hsl(var(--border))',
                    strokeWidth: 1,
                    strokeOpacity: 0.2
                  }
                },
                crosshair: {
                  line: {
                    stroke: 'hsl(var(--primary))',
                    strokeWidth: 1,
                    strokeOpacity: 0.35
                  }
                },
                tooltip: {
                  container: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))',
                    fontSize: '12px'
                  }
                }
              }}
              colors={['hsl(var(--chart-1))']}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Price',
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 10,
                tickPadding: 2,
                tickRotation: 0,
                legend: 'Moon Bag Size',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              pointSize={4}
              pointColor="hsl(var(--card))"
              pointBorderWidth={2}
              pointBorderColor="hsl(var(--chart-1))"
              enablePointLabel={true}
              // pointLabel={d => `Gain: ${(((d.x / initialBaseAmount) - costBasis) * 100).toFixed(0)}%`}
              pointLabel={''}
              pointLabelYOffset={-12}
              useMesh={true}
              curve="monotoneX"
              tooltip={({ point }) => {
                const price = Number(point.data.x)
                const amount = Number(point.data.y)

                return (
                  <div className={`bg-dark text-white p-2 rounded-md shadow-lg border border-border`}>
                    <div>Target Price: {price.toFixed(2)}</div>
                    <div>Sell Amount: {(initialBaseAmount - amount * initialBaseAmount).toFixed(2)}</div>
                    <div>Yields Moon Bag: {(amount * initialBaseAmount).toFixed(2)}</div>
                  </div>
                )
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
