import { AssetPair } from '../../../../declarations/trade_manager/trade_manager.did'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FC } from 'react'
import { MoonBagCalculator } from '@/Components/MoonBag'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocation, Navigate } from 'react-router-dom'
import { AssetPairComponent } from '@/Components/Assets/AssetPair'

interface ScenarioResult {
  targetPrice: number
  sellAmount: number
  addAmount: number
  remainingAmount: number
  newCostBasis: number
  riskFreePercentage: number
}

const calculateWinningScenarios = (
  baseAmount: number,
  quoteAmount: number,
  _currentPrice: number
): { fiftyPercent: ScenarioResult; ninetyPercent: ScenarioResult } => {
  const costBasis = quoteAmount / baseAmount

  // Calculate price needed for 50% risk-free
  const fiftyPercent = {
    targetPrice: costBasis * 2,
    sellAmount: baseAmount * 0.5,
    addAmount: 0,
    remainingAmount: baseAmount * 0.5,
    newCostBasis: 0,
    riskFreePercentage: 50
  }
  fiftyPercent.newCostBasis = (quoteAmount - (fiftyPercent.sellAmount * fiftyPercent.targetPrice)) / fiftyPercent.remainingAmount

  // Calculate price needed for 90% risk-free
  const ninetyPercent = {
    targetPrice: costBasis * 10,
    sellAmount: baseAmount * 0.9,
    addAmount: 0,
    remainingAmount: baseAmount * 0.1,
    newCostBasis: 0,
    riskFreePercentage: 90
  }
  ninetyPercent.newCostBasis = (quoteAmount - (ninetyPercent.sellAmount * ninetyPercent.targetPrice)) / ninetyPercent.remainingAmount

  return { fiftyPercent, ninetyPercent }
}

const calculateLosingScenarios = (
  baseAmount: number,
  quoteAmount: number,
  currentPrice: number
): { breakEven: ScenarioResult; halfCostBasis: ScenarioResult } => {
  const costBasis = quoteAmount / baseAmount

  // Calculate amount needed to break even at current price
  const breakEven = {
    targetPrice: currentPrice,
    sellAmount: 0,
    addAmount: baseAmount * (costBasis - currentPrice),
    remainingAmount: baseAmount,
    newCostBasis: currentPrice,
    riskFreePercentage: 0
  }

  // Calculate amount needed to halve cost basis
  const halfCostBasis = {
    targetPrice: currentPrice,
    sellAmount: 0,
    addAmount: baseAmount * costBasis,
    remainingAmount: baseAmount * 2,
    newCostBasis: costBasis / 2,
    riskFreePercentage: 0
  }

  return { breakEven, halfCostBasis }
}

interface LocationState {
  assetPair: AssetPair
  baseAmount: number
  quoteAmount: number
  currentPrice: number
}

export const PositionOptions: FC = () => {
  const location = useLocation()
  const state = location.state as LocationState

  // If we don't have the required state, redirect to positions
  if (!state || !state.assetPair || !state.baseAmount || !state.quoteAmount || !state.currentPrice) {
    return <Navigate to="/positions" replace />
  }

  const { assetPair, baseAmount, quoteAmount, currentPrice } = state
  const costBasis = quoteAmount / baseAmount
  const roi = ((currentPrice - costBasis) / costBasis) * 100
  const isWinning = roi > 0

  const winningScenarios = calculateWinningScenarios(baseAmount, quoteAmount, currentPrice)
  const losingScenarios = calculateLosingScenarios(baseAmount, quoteAmount, currentPrice)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-dark border">
          <CardHeader>
            <CardTitle className="text-white">
              {assetPair.base.symbol}/{assetPair.quote.symbol} Position Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-slate-400">Asset Pair:</div>
              <div className="text-white">
                <AssetPairComponent assetPair={assetPair} />
              </div>

              <div className="text-slate-400">Current Holdings:</div>
              <div className="text-white">
                {baseAmount.toLocaleString("en-US", { style: "decimal" })} {assetPair.base.symbol}
              </div>

              <div className="text-slate-400">Total Position Value:</div>
              <div className="text-white">
                {(baseAmount * currentPrice).toLocaleString("en-US", { style: "decimal" })} {assetPair.quote.symbol}
              </div>

              <div className="text-slate-400">Current Price:</div>
              <div className="text-white">{currentPrice.toFixed(4)}</div>

              <div className="text-slate-400">Cost Basis:</div>
              <div className="text-white">{costBasis.toFixed(4)}</div>

              <div className="text-slate-400">ROI:</div>
              <div className={`${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {roi.toFixed(2)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <MoonBagCalculator
          initialBaseAmount={baseAmount}
          initialQuoteAmount={quoteAmount}
          currentPrice={currentPrice}
        />
      </div>

      <Tabs defaultValue={isWinning ? "winning" : "losing"} className="w-full">
        <TabsList className="bg-slate-800 text-white">
          <TabsTrigger value="winning">Risk Reduction Scenarios</TabsTrigger>
          <TabsTrigger value="losing">Risk Increasing Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="winning">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-dark border">
              <CardHeader>
                <CardTitle className="text-white">50% Risk-Free Scenario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-slate-400">Target Price:</div>
                  <div className="text-white">{winningScenarios.fiftyPercent.targetPrice.toFixed(4)}</div>

                  <div className="text-slate-400">Amount to Sell:</div>
                  <div className="text-white">{winningScenarios.fiftyPercent.sellAmount.toFixed(4)} {assetPair.base.symbol}</div>

                  <div className="text-slate-400">Risk-Free Amount:</div>
                  <div className="text-white">{winningScenarios.fiftyPercent.remainingAmount.toFixed(4)} {assetPair.base.symbol}</div>

                  <div className="text-slate-400">New Cost Basis:</div>
                  <div className="text-white">{winningScenarios.fiftyPercent.newCostBasis.toFixed(4)}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark border">
              <CardHeader>
                <CardTitle className="text-white">90% Risk-Free Scenario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-slate-400">Target Price:</div>
                  <div className="text-white">{winningScenarios.ninetyPercent.targetPrice.toFixed(4)}</div>

                  <div className="text-slate-400">Amount to Sell:</div>
                  <div className="text-white">{winningScenarios.ninetyPercent.sellAmount.toFixed(4)} {assetPair.base.symbol}</div>

                  <div className="text-slate-400">Risk-Free Amount:</div>
                  <div className="text-white">{winningScenarios.ninetyPercent.remainingAmount.toFixed(4)} {assetPair.base.symbol}</div>

                  <div className="text-slate-400">New Cost Basis:</div>
                  <div className="text-white">{winningScenarios.ninetyPercent.newCostBasis.toFixed(4)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="losing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-dark border">
              <CardHeader>
                <CardTitle className="text-white">Break Even Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-slate-400">Required Investment:</div>
                  <div className="text-white">{losingScenarios.breakEven.addAmount.toFixed(4)} {assetPair.quote.symbol}</div>

                  <div className="text-slate-400">New Position Size:</div>
                  <div className="text-white">{losingScenarios.breakEven.remainingAmount.toFixed(4)} {assetPair.base.symbol}</div>

                  <div className="text-slate-400">New Cost Basis:</div>
                  <div className="text-white">{losingScenarios.breakEven.newCostBasis.toFixed(4)}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark border">
              <CardHeader>
                <CardTitle className="text-white">Half Cost Basis Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-slate-400">Required Investment:</div>
                  <div className="text-white">{losingScenarios.halfCostBasis.addAmount.toFixed(4)} {assetPair.quote.symbol}</div>

                  <div className="text-slate-400">New Position Size:</div>
                  <div className="text-white">{losingScenarios.halfCostBasis.remainingAmount.toFixed(4)} {assetPair.base.symbol}</div>

                  <div className="text-slate-400">New Cost Basis:</div>
                  <div className="text-white">{losingScenarios.halfCostBasis.newCostBasis.toFixed(4)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}