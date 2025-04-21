"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("")
  const [additionalContribution, setAdditionalContribution] = useState("")
  const [contributionFrequency, setContributionFrequency] = useState("monthly")
  const [interestRate, setInterestRate] = useState("")
  const [compoundFrequency, setCompoundFrequency] = useState("annually")
  const [years, setYears] = useState("")
  const [result, setResult] = useState<{
    finalBalance: number
    totalPrincipal: number
    totalContributions: number
    totalInterest: number
    yearlyResults: Array<{
      year: number
      balance: number
      interestEarned: number
      contributions: number
    }>
  } | null>(null)

  const calculateCompoundInterest = () => {
    const principalValue = Number.parseFloat(principal)
    const contributionValue = Number.parseFloat(additionalContribution) || 0
    const rateValue = Number.parseFloat(interestRate) / 100
    const yearsValue = Number.parseInt(years)

    if (
      isNaN(principalValue) ||
      isNaN(rateValue) ||
      isNaN(yearsValue) ||
      principalValue < 0 ||
      rateValue < 0 ||
      yearsValue <= 0
    ) {
      setResult(null)
      return
    }

    // Determine number of compounds per year
    let compoundsPerYear: number
    switch (compoundFrequency) {
      case "daily":
        compoundsPerYear = 365
        break
      case "weekly":
        compoundsPerYear = 52
        break
      case "monthly":
        compoundsPerYear = 12
        break
      case "quarterly":
        compoundsPerYear = 4
        break
      case "semiannually":
        compoundsPerYear = 2
        break
      case "annually":
      default:
        compoundsPerYear = 1
        break
    }

    // Determine number of contributions per year
    let contributionsPerYear: number
    switch (contributionFrequency) {
      case "weekly":
        contributionsPerYear = 52
        break
      case "biweekly":
        contributionsPerYear = 26
        break
      case "monthly":
        contributionsPerYear = 12
        break
      case "quarterly":
        contributionsPerYear = 4
        break
      case "annually":
        contributionsPerYear = 1
        break
      default:
        contributionsPerYear = 12
        break
    }

    // Calculate compound interest with regular contributions
    let balance = principalValue
    let totalContributions = 0
    const yearlyResults = []

    for (let year = 1; year <= yearsValue; year++) {
      let yearlyContributions = 0
      let yearlyInterestEarned = 0
      const startYearBalance = balance

      for (let i = 0; i < compoundsPerYear; i++) {
        // Add contributions for this compound period
        const contributionsThisPeriod = (contributionValue * contributionsPerYear) / compoundsPerYear
        balance += contributionsThisPeriod
        yearlyContributions += contributionsThisPeriod
        totalContributions += contributionsThisPeriod

        // Apply interest for this compound period
        const interestEarned = balance * (rateValue / compoundsPerYear)
        balance += interestEarned
        yearlyInterestEarned += interestEarned
      }

      yearlyResults.push({
        year,
        balance,
        interestEarned: yearlyInterestEarned,
        contributions: yearlyContributions,
      })
    }

    setResult({
      finalBalance: balance,
      totalPrincipal: principalValue,
      totalContributions,
      totalInterest: balance - principalValue - totalContributions,
      yearlyResults,
    })
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Compound Interest Calculator</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="principal">Initial Investment</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="0.00"
              className="pl-8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="additional-contribution">Additional Contribution</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="additional-contribution"
              type="number"
              value={additionalContribution}
              onChange={(e) => setAdditionalContribution(e.target.value)}
              placeholder="0.00"
              className="pl-8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="contribution-frequency">Contribution Frequency</Label>
          <Select value={contributionFrequency} onValueChange={setContributionFrequency}>
            <SelectTrigger id="contribution-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            <Input
              id="interest-rate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="0.00"
              className="pl-8"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="compound-frequency">Compound Frequency</Label>
          <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
            <SelectTrigger id="compound-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="semiannually">Semi-annually</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="years">Time Period (years)</Label>
          <Input
            id="years"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="Years"
            min="1"
            max="100"
          />
        </div>

        <Button onClick={calculateCompoundInterest} className="w-full">
          Calculate
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Final Balance</p>
              <p className="text-2xl font-bold">
                ${result.finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Principal</p>
                <p className="text-lg font-bold">
                  $
                  {result.totalPrincipal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Contributions</p>
                <p className="text-lg font-bold">
                  $
                  {result.totalContributions.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Interest</p>
                <p className="text-lg font-bold">
                  $
                  {result.totalInterest.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(result.totalPrincipal / result.finalBalance) * 100}%` }}
                />
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(result.totalContributions / result.finalBalance) * 100}%` }}
                />
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${(result.totalInterest / result.finalBalance) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-blue-500">Principal</span>
                <span className="text-green-500">Contributions</span>
                <span className="text-purple-500">Interest</span>
              </div>
            </div>

            <div className="mt-4 border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contributions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {result.yearlyResults.map((yearResult) => (
                    <tr key={yearResult.year}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{yearResult.year}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        $
                        {yearResult.balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        $
                        {yearResult.interestEarned.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        $
                        {yearResult.contributions.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
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
