"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function PregnancyCalculator() {
  const [calculationType, setCalculationType] = useState("dueDate")
  const [lastPeriodDate, setLastPeriodDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [cycleLength, setCycleLength] = useState("28")
  const [result, setResult] = useState<{
    dueDate?: string
    conception?: string
    firstTrimester?: string
    secondTrimester?: string
    thirdTrimester?: string
    weeksPregnant?: number
  } | null>(null)

  const calculateDueDate = () => {
    if (!lastPeriodDate) {
      setResult(null)
      return
    }

    const lmpDate = new Date(lastPeriodDate)
    const cycleLengthDays = Number.parseInt(cycleLength) || 28

    // Calculate conception date (approximately 2 weeks after LMP for a 28-day cycle)
    const conceptionOffset = cycleLengthDays - 28 + 14
    const conceptionDate = new Date(lmpDate)
    conceptionDate.setDate(lmpDate.getDate() + conceptionOffset)

    // Calculate due date (40 weeks from LMP)
    const dueDateValue = new Date(lmpDate)
    dueDateValue.setDate(lmpDate.getDate() + 280) // 40 weeks = 280 days

    // Calculate trimester dates
    const firstTrimesterEnd = new Date(lmpDate)
    firstTrimesterEnd.setDate(lmpDate.getDate() + 84) // 12 weeks = 84 days

    const secondTrimesterEnd = new Date(lmpDate)
    secondTrimesterEnd.setDate(lmpDate.getDate() + 189) // 27 weeks = 189 days

    // Calculate weeks pregnant
    const today = new Date()
    const diffTime = today.getTime() - lmpDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const weeksPregnant = Math.floor(diffDays / 7)

    setResult({
      dueDate: formatDate(dueDateValue),
      conception: formatDate(conceptionDate),
      firstTrimester: formatDate(firstTrimesterEnd),
      secondTrimester: formatDate(secondTrimesterEnd),
      thirdTrimester: formatDate(dueDateValue),
      weeksPregnant: weeksPregnant > 0 ? weeksPregnant : 0,
    })
  }

  const calculateLastPeriod = () => {
    if (!dueDate) {
      setResult(null)
      return
    }

    const dueDateValue = new Date(dueDate)

    // Calculate LMP (due date - 40 weeks)
    const lmpDate = new Date(dueDateValue)
    lmpDate.setDate(dueDateValue.getDate() - 280) // 40 weeks = 280 days

    // Calculate conception date (LMP + 14 days for a 28-day cycle)
    const cycleLengthDays = Number.parseInt(cycleLength) || 28
    const conceptionOffset = cycleLengthDays - 28 + 14
    const conceptionDate = new Date(lmpDate)
    conceptionDate.setDate(lmpDate.getDate() + conceptionOffset)

    // Calculate trimester dates
    const firstTrimesterEnd = new Date(lmpDate)
    firstTrimesterEnd.setDate(lmpDate.getDate() + 84) // 12 weeks = 84 days

    const secondTrimesterEnd = new Date(lmpDate)
    secondTrimesterEnd.setDate(lmpDate.getDate() + 189) // 27 weeks = 189 days

    // Calculate weeks pregnant
    const today = new Date()
    const diffTime = today.getTime() - lmpDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const weeksPregnant = Math.floor(diffDays / 7)

    setResult({
      dueDate: formatDate(dueDateValue),
      conception: formatDate(conceptionDate),
      firstTrimester: formatDate(firstTrimesterEnd),
      secondTrimester: formatDate(secondTrimesterEnd),
      thirdTrimester: formatDate(dueDateValue),
      weeksPregnant: weeksPregnant > 0 ? weeksPregnant : 0,
    })
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleCalculate = () => {
    if (calculationType === "dueDate") {
      calculateDueDate()
    } else {
      calculateLastPeriod()
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Pregnancy Calculator</h2>

      <div className="space-y-4">
        <RadioGroup value={calculationType} onValueChange={setCalculationType} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dueDate" id="dueDate" />
            <Label htmlFor="dueDate">Calculate Due Date</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lastPeriod" id="lastPeriod" />
            <Label htmlFor="lastPeriod">Calculate from Due Date</Label>
          </div>
        </RadioGroup>

        {calculationType === "dueDate" ? (
          <div>
            <Label htmlFor="last-period">First Day of Last Period</Label>
            <Input
              id="last-period"
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="due-date">Due Date</Label>
            <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        )}

        <div>
          <Label htmlFor="cycle-length">Average Cycle Length (days)</Label>
          <Input
            id="cycle-length"
            type="number"
            value={cycleLength}
            onChange={(e) => setCycleLength(e.target.value)}
            min="20"
            max="45"
          />
        </div>

        <Button onClick={handleCalculate} className="w-full">
          Calculate
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
              <p className="text-xl font-bold">{result.dueDate}</p>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Conception Date</p>
              <p className="text-xl font-bold">{result.conception}</p>
            </div>

            {result.weeksPregnant !== undefined && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Progress</p>
                <p className="text-xl font-bold">{result.weeksPregnant} weeks pregnant</p>

                <div className="mt-4">
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500" style={{ width: `${(result.weeksPregnant / 40) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>0 weeks</span>
                    <span>20 weeks</span>
                    <span>40 weeks</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">First Trimester</p>
                <p className="font-medium">Until {result.firstTrimester}</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Second Trimester</p>
                <p className="font-medium">Until {result.secondTrimester}</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Third Trimester</p>
                <p className="font-medium">Until {result.thirdTrimester}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
