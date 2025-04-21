"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState("30")
  const [retirementAge, setRetirementAge] = useState("65")
  const [currentSavings, setCurrentSavings] = useState("50000")
  const [annualContribution, setAnnualContribution] = useState("6000")
  const [annualReturn, setAnnualReturn] = useState("7")
  const [inflationRate, setInflationRate] = useState("2.5")
  const [withdrawalRate, setWithdrawalRate] = useState("4")
  const [result, setResult] = useState<{
    futureBalance: number
    yearsToRetirement: number
    annualRetirementIncome: number
    inflationAdjustedIncome: number
    yearlyResults: Array<{
      age: number
      balance: number
      contributions: number
      interestEarned: number
    }>
  } | null>(null)

  const calculateRetirement = () => {
    const currentAgeValue = Number.parseInt(currentAge)
    const retirementAgeValue = Number.parseInt(retirementAge)
    const currentSavingsValue = Number.parseFloat(currentSavings)
    const annualContributionValue = Number.parseFloat(annualContribution)
    const annualReturnValue = Number.parseFloat(annualReturn) / 100
    const inflationRateValue = Number.parseFloat(inflationRate) / 100
    const withdrawalRateValue = Number.parseFloat(withdrawalRate) / 100

    if (
      isNaN(currentAgeValue) ||
      isNaN(retirementAgeValue) ||
      isNaN(currentSavingsValue) ||
      isNaN(annualContributionValue) ||
      isNaN(annualReturnValue) ||
      isNaN(inflationRateValue) ||
      isNaN(withdrawalRateValue) ||
      currentAgeValue >= retirementAgeValue
    ) {
      setResult(null)
      return
    }

    const yearsToRetirement = retirementAgeValue - currentAgeValue
    let balance = currentSavingsValue
    const yearlyResults = []

    // Calculate future value of retirement savings
    for (let year = 1; year <= yearsToRetirement; year++) {
      const startYearBalance = balance
      const contribution = annualContributionValue
      const interestEarned = balance * annualReturnValue + contribution * (annualReturnValue / 2)
      balance += contribution + interestEarned

      yearlyResults.push({
        age: currentAgeValue + year,
        balance,
        contributions: contribution,
        interestEarned,
      })
    }

    // Calculate annual retirement income based on withdrawal rate
    const annualRetirementIncome = balance * withdrawalRateValue

    // Calculate inflation-adjusted retirement income
    const inflationAdjustedIncome = annualRetirementIncome / Math.pow(1 + inflationRateValue, yearsToRetirement)

    setResult({
      futureBalance: balance,
      yearsToRetirement,
      annualRetirementIncome,
      inflationAdjustedIncome,
      yearlyResults,
    })
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Retirement Calculator</h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between">
            <Label htmlFor="current-age">Current Age</Label>
            <span className="text-sm text-gray-500">{currentAge} years</span>
          </div>
          <Slider
            value={[Number.parseInt(currentAge)]}
            min={18}
            max={80}
            step={1}
            onValueChange={(value) => setCurrentAge(value[0].toString())}
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="retirement-age">Retirement Age</Label>
            <span className="text-sm text-gray-500">{retirementAge} years</span>
          </div>
          <Slider
            value={[Number.parseInt(retirementAge)]}
            min={Number.parseInt(currentAge) + 1}
            max={90}
            step={1}
            onValueChange={(value) => setRetirementAge(value[0].toString())}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="current-savings">Current Savings</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="current-savings"
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="annual-contribution">Annual Contribution</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="annual-contribution"
              type="number"
              value={annualContribution}
              onChange={(e) => setAnnualContribution(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="annual-return">Expected Annual Return (%)</Label>
            <span className="text-sm text-gray-500">{annualReturn}%</span>
          </div>
          <Slider
            value={[Number.parseFloat(annualReturn)]}
            min={1}
            max={12}
            step={0.1}
            onValueChange={(value) => setAnnualReturn(value[0].toString())}
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="inflation-rate">Inflation Rate (%)</Label>
            <span className="text-sm text-gray-500">{inflationRate}%</span>
          </div>
          <Slider
            value={[Number.parseFloat(inflationRate)]}
            min={0}
            max={7}
            step={0.1}
            onValueChange={(value) => setInflationRate(value[0].toString())}
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="withdrawal-rate">Withdrawal Rate (%)</Label>
            <span className="text-sm text-gray-500">{withdrawalRate}%</span>
          </div>
          <Slider
            value={[Number.parseFloat(withdrawalRate)]}
            min={2}
            max={8}
            step={0.1}
            onValueChange={(value) => setWithdrawalRate(value[0].toString())}
            className="mt-2"
          />
        </div>

        <Button onClick={calculateRetirement} className="w-full">
          Calculate
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Retirement Savings at Age {retirementAge}</p>
              <p className="text-2xl font-bold">
                $
                {result.futureBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Annual Retirement Income</p>
                <p className="text-xl font-bold">
                  $
                  {result.annualRetirementIncome.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  $
                  {(result.annualRetirementIncome / 12).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  monthly
                </p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Today's Dollars</p>
                <p className="text-xl font-bold">
                  $
                  {result.inflationAdjustedIncome.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  $
                  {(result.inflationAdjustedIncome / 12).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  monthly
                </p>
              </div>
            </div>

            <div className="mt-4 border rounded-md overflow-hidden max-h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contribution
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Interest
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {result.yearlyResults.map((yearResult) => (
                    <tr key={yearResult.age}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{yearResult.age}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        $
                        {yearResult.balance.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        $
                        {yearResult.contributions.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        $
                        {yearResult.interestEarned.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
