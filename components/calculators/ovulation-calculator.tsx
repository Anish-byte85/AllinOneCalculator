"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OvulationCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState("")
  const [cycleLength, setCycleLength] = useState("28")
  const [lutealPhase, setLutealPhase] = useState("14")
  const [result, setResult] = useState<{
    ovulationDate: string
    fertileWindowStart: string
    fertileWindowEnd: string
    nextPeriodDate: string
    daysUntilOvulation: number
    currentPhase: string
  } | null>(null)

  const calculateOvulation = () => {
    if (!lastPeriodDate) {
      setResult(null)
      return
    }

    const lmpDate = new Date(lastPeriodDate)
    const cycleLengthDays = Number.parseInt(cycleLength) || 28
    const lutealPhaseDays = Number.parseInt(lutealPhase) || 14

    // Calculate ovulation date (LMP + cycle length - luteal phase)
    const ovulationDate = new Date(lmpDate)
    ovulationDate.setDate(lmpDate.getDate() + (cycleLengthDays - lutealPhaseDays))

    // Calculate fertile window (5 days before ovulation to 1 day after)
    const fertileWindowStart = new Date(ovulationDate)
    fertileWindowStart.setDate(ovulationDate.getDate() - 5)

    const fertileWindowEnd = new Date(ovulationDate)
    fertileWindowEnd.setDate(ovulationDate.getDate() + 1)

    // Calculate next period date
    const nextPeriodDate = new Date(lmpDate)
    nextPeriodDate.setDate(lmpDate.getDate() + cycleLengthDays)

    // Calculate days until ovulation
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const ovulationDateCopy = new Date(ovulationDate)
    ovulationDateCopy.setHours(0, 0, 0, 0)
    const diffTime = ovulationDateCopy.getTime() - today.getTime()
    const daysUntilOvulation = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Determine current phase
    let currentPhase = ""
    const nextPeriodDateCopy = new Date(nextPeriodDate)
    nextPeriodDateCopy.setHours(0, 0, 0, 0)

    if (today.getTime() < fertileWindowStart.getTime()) {
      currentPhase = "Follicular Phase"
    } else if (today.getTime() >= fertileWindowStart.getTime() && today.getTime() <= fertileWindowEnd.getTime()) {
      currentPhase = "Fertile Window"
    } else if (today.getTime() > fertileWindowEnd.getTime() && today.getTime() < nextPeriodDateCopy.getTime()) {
      currentPhase = "Luteal Phase"
    } else {
      currentPhase = "Menstrual Phase"
    }

    setResult({
      ovulationDate: formatDate(ovulationDate),
      fertileWindowStart: formatDate(fertileWindowStart),
      fertileWindowEnd: formatDate(fertileWindowEnd),
      nextPeriodDate: formatDate(nextPeriodDate),
      daysUntilOvulation,
      currentPhase,
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

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Ovulation Calculator</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="last-period">First Day of Last Period</Label>
          <Input
            id="last-period"
            type="date"
            value={lastPeriodDate}
            onChange={(e) => setLastPeriodDate(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="cycle-length">Average Cycle Length (days)</Label>
          <Select value={cycleLength} onValueChange={setCycleLength}>
            <SelectTrigger id="cycle-length">
              <SelectValue placeholder="Select cycle length" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 16 }, (_, i) => i + 22).map((days) => (
                <SelectItem key={days} value={days.toString()}>
                  {days} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="luteal-phase">Luteal Phase Length (days)</Label>
          <Select value={lutealPhase} onValueChange={setLutealPhase}>
            <SelectTrigger id="luteal-phase">
              <SelectValue placeholder="Select luteal phase length" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => i + 12).map((days) => (
                <SelectItem key={days} value={days.toString()}>
                  {days} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculateOvulation} className="w-full">
          Calculate
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Phase</p>
              <p className="text-xl font-bold">{result.currentPhase}</p>
              {result.daysUntilOvulation > 0 && (
                <p className="text-sm mt-1">{result.daysUntilOvulation} days until ovulation</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Ovulation Date</p>
                <p className="font-medium">{result.ovulationDate}</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Next Period</p>
                <p className="font-medium">{result.nextPeriodDate}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Fertile Window</p>
              <p className="font-medium">
                {result.fertileWindowStart} to {result.fertileWindowEnd}
              </p>
            </div>

            <div className="mt-4">
              <div className="w-full h-8 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex">
                <div className="h-full bg-red-400" style={{ width: "25%" }}>
                  <div className="h-full flex items-center justify-center text-xs text-white">Menstrual</div>
                </div>
                <div className="h-full bg-blue-400" style={{ width: "25%" }}>
                  <div className="h-full flex items-center justify-center text-xs text-white">Follicular</div>
                </div>
                <div className="h-full bg-green-400" style={{ width: "25%" }}>
                  <div className="h-full flex items-center justify-center text-xs text-white">Ovulation</div>
                </div>
                <div className="h-full bg-purple-400" style={{ width: "25%" }}>
                  <div className="h-full flex items-center justify-center text-xs text-white">Luteal</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
