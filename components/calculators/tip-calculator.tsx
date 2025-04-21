"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState("")
  const [tipPercentage, setTipPercentage] = useState(15)
  const [numberOfPeople, setNumberOfPeople] = useState("1")
  const [tipAmount, setTipAmount] = useState<number | null>(null)
  const [totalAmount, setTotalAmount] = useState<number | null>(null)
  const [amountPerPerson, setAmountPerPerson] = useState<number | null>(null)

  useEffect(() => {
    calculateTip()
  }, [billAmount, tipPercentage, numberOfPeople])

  const calculateTip = () => {
    const bill = Number.parseFloat(billAmount)
    const people = Number.parseInt(numberOfPeople)

    if (isNaN(bill) || bill <= 0 || isNaN(people) || people <= 0) {
      setTipAmount(null)
      setTotalAmount(null)
      setAmountPerPerson(null)
      return
    }

    const tip = bill * (tipPercentage / 100)
    const total = bill + tip
    const perPerson = total / people

    setTipAmount(tip)
    setTotalAmount(total)
    setAmountPerPerson(perPerson)
  }

  const handleQuickTip = (percentage: number) => {
    setTipPercentage(percentage)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Tip Calculator</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="bill-amount">Bill Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="bill-amount"
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              placeholder="0.00"
              className="pl-8"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="tip-percentage">Tip Percentage</Label>
            <span className="text-sm text-gray-500">{tipPercentage}%</span>
          </div>
          <Slider
            value={[tipPercentage]}
            min={0}
            max={30}
            step={1}
            onValueChange={(value) => setTipPercentage(value[0])}
            className="mt-2"
          />
          <div className="flex justify-between mt-2">
            <Button variant="outline" size="sm" onClick={() => handleQuickTip(10)}>
              10%
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickTip(15)}>
              15%
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickTip(18)}>
              18%
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickTip(20)}>
              20%
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickTip(25)}>
              25%
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="number-of-people">Number of People</Label>
          <Input
            id="number-of-people"
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            min="1"
          />
        </div>

        {tipAmount !== null && totalAmount !== null && amountPerPerson !== null && (
          <div className="mt-6 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tip Amount</p>
                <p className="text-xl font-bold">
                  ${tipAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                <p className="text-xl font-bold">
                  ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {Number.parseInt(numberOfPeople) > 1 && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount Per Person</p>
                <p className="text-xl font-bold">
                  ${amountPerPerson.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
