"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function TimeCalculator() {
  const [operation, setOperation] = useState("add")
  const [time1Hours, setTime1Hours] = useState("")
  const [time1Minutes, setTime1Minutes] = useState("")
  const [time1Seconds, setTime1Seconds] = useState("")
  const [time2Hours, setTime2Hours] = useState("")
  const [time2Minutes, setTime2Minutes] = useState("")
  const [time2Seconds, setTime2Seconds] = useState("")
  const [result, setResult] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)

  const calculateTime = () => {
    const hours1 = Number.parseInt(time1Hours) || 0
    const minutes1 = Number.parseInt(time1Minutes) || 0
    const seconds1 = Number.parseInt(time1Seconds) || 0
    const hours2 = Number.parseInt(time2Hours) || 0
    const minutes2 = Number.parseInt(time2Minutes) || 0
    const seconds2 = Number.parseInt(time2Seconds) || 0

    // Convert all to seconds
    const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1
    const totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2

    let resultSeconds: number

    if (operation === "add") {
      resultSeconds = totalSeconds1 + totalSeconds2
    } else {
      resultSeconds = totalSeconds1 - totalSeconds2
      // Handle negative time
      if (resultSeconds < 0) {
        resultSeconds = Math.abs(resultSeconds)
      }
    }

    // Convert back to hours, minutes, seconds
    const resultHours = Math.floor(resultSeconds / 3600)
    const remainingSeconds = resultSeconds % 3600
    const resultMinutes = Math.floor(remainingSeconds / 60)
    const finalSeconds = remainingSeconds % 60

    setResult({
      hours: resultHours,
      minutes: resultMinutes,
      seconds: finalSeconds,
    })
  }

  const resetForm = () => {
    setTime1Hours("")
    setTime1Minutes("")
    setTime1Seconds("")
    setTime2Hours("")
    setTime2Minutes("")
    setTime2Seconds("")
    setResult(null)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Time Calculator</h2>

      <div className="space-y-4">
        <RadioGroup value={operation} onValueChange={setOperation} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="add" id="add" />
            <Label htmlFor="add">Add Time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="subtract" id="subtract" />
            <Label htmlFor="subtract">Subtract Time</Label>
          </div>
        </RadioGroup>

        <div>
          <Label>Time 1</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="time1-hours" className="text-xs">
                Hours
              </Label>
              <Input
                id="time1-hours"
                type="number"
                value={time1Hours}
                onChange={(e) => setTime1Hours(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="time1-minutes" className="text-xs">
                Minutes
              </Label>
              <Input
                id="time1-minutes"
                type="number"
                value={time1Minutes}
                onChange={(e) => setTime1Minutes(e.target.value)}
                placeholder="0"
                min="0"
                max="59"
              />
            </div>
            <div>
              <Label htmlFor="time1-seconds" className="text-xs">
                Seconds
              </Label>
              <Input
                id="time1-seconds"
                type="number"
                value={time1Seconds}
                onChange={(e) => setTime1Seconds(e.target.value)}
                placeholder="0"
                min="0"
                max="59"
              />
            </div>
          </div>
        </div>

        <div>
          <Label>Time 2</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="time2-hours" className="text-xs">
                Hours
              </Label>
              <Input
                id="time2-hours"
                type="number"
                value={time2Hours}
                onChange={(e) => setTime2Hours(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="time2-minutes" className="text-xs">
                Minutes
              </Label>
              <Input
                id="time2-minutes"
                type="number"
                value={time2Minutes}
                onChange={(e) => setTime2Minutes(e.target.value)}
                placeholder="0"
                min="0"
                max="59"
              />
            </div>
            <div>
              <Label htmlFor="time2-seconds" className="text-xs">
                Seconds
              </Label>
              <Input
                id="time2-seconds"
                type="number"
                value={time2Seconds}
                onChange={(e) => setTime2Seconds(e.target.value)}
                placeholder="0"
                min="0"
                max="59"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button onClick={calculateTime} className="flex-1">
            Calculate
          </Button>
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Result</p>
            <p className="text-2xl font-bold">
              {result.hours.toString().padStart(2, "0")}:{result.minutes.toString().padStart(2, "0")}:
              {result.seconds.toString().padStart(2, "0")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {result.hours} hours, {result.minutes} minutes, {result.seconds} seconds
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
