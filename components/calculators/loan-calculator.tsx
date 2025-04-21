"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("250000")
  const [interestRate, setInterestRate] = useState("5.5")
  const [loanTerm, setLoanTerm] = useState("30")
  const [paymentFrequency, setPaymentFrequency] = useState("monthly")
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)
  const [totalPayment, setTotalPayment] = useState<number | null>(null)
  const [totalInterest, setTotalInterest] = useState<number | null>(null)

  useEffect(() => {
    calculateLoan()
  }, [loanAmount, interestRate, loanTerm, paymentFrequency])

  const calculateLoan = () => {
    const principal = Number.parseFloat(loanAmount)
    const rate = Number.parseFloat(interestRate) / 100
    const termYears = Number.parseFloat(loanTerm)

    if (isNaN(principal) || isNaN(rate) || isNaN(termYears) || principal <= 0 || rate <= 0 || termYears <= 0) {
      setMonthlyPayment(null)
      setTotalPayment(null)
      setTotalInterest(null)
      return
    }

    // Calculate payments based on frequency
    let paymentsPerYear: number
    let termPayments: number

    switch (paymentFrequency) {
      case "weekly":
        paymentsPerYear = 52
        break
      case "biweekly":
        paymentsPerYear = 26
        break
      case "monthly":
        paymentsPerYear = 12
        break
      case "quarterly":
        paymentsPerYear = 4
        break
      default:
        paymentsPerYear = 12
    }

    termPayments = termYears * paymentsPerYear
    const periodicRate = rate / paymentsPerYear

    // Calculate payment using the formula: P = (Pv*r*(1+r)^n)/((1+r)^n-1)
    const payment =
      (principal * periodicRate * Math.pow(1 + periodicRate, termPayments)) /
      (Math.pow(1 + periodicRate, termPayments) - 1)

    setMonthlyPayment(payment)
    setTotalPayment(payment * termPayments)
    setTotalInterest(payment * termPayments - principal)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Loan Calculator</h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between">
            <Label htmlFor="loan-amount">Loan Amount</Label>
            <span className="text-sm text-gray-500">${Number.parseInt(loanAmount).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              id="loan-amount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full"
            />
          </div>
          <Slider
            value={[Number.parseFloat(loanAmount)]}
            min={1000}
            max={1000000}
            step={1000}
            onValueChange={(value) => setLoanAmount(value[0].toString())}
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="interest-rate">Interest Rate (%)</Label>
            <span className="text-sm text-gray-500">{Number.parseFloat(interestRate).toFixed(2)}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              id="interest-rate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              step="0.01"
              className="w-full"
            />
          </div>
          <Slider
            value={[Number.parseFloat(interestRate)]}
            min={0.1}
            max={20}
            step={0.1}
            onValueChange={(value) => setInterestRate(value[0].toString())}
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="loan-term">Loan Term (years)</Label>
            <span className="text-sm text-gray-500">{loanTerm} years</span>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              id="loan-term"
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Slider
            value={[Number.parseFloat(loanTerm)]}
            min={1}
            max={40}
            step={1}
            onValueChange={(value) => setLoanTerm(value[0].toString())}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="payment-frequency">Payment Frequency</Label>
          <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
            <SelectTrigger id="payment-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {monthlyPayment !== null && totalPayment !== null && totalInterest !== null && (
          <div className="mt-6 grid gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {paymentFrequency.charAt(0).toUpperCase() + paymentFrequency.slice(1)} Payment
              </p>
              <p className="text-2xl font-bold">
                ${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Payment</p>
                <p className="text-xl font-bold">
                  ${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest</p>
                <p className="text-xl font-bold">
                  ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="mt-2">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(Number.parseFloat(loanAmount) / totalPayment) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Principal: ${Number.parseInt(loanAmount).toLocaleString()}</span>
                <span>Interest: ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
