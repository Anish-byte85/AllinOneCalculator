"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DateCalculator() {
  const [calculationType, setCalculationType] = useState("difference")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [addUnit, setAddUnit] = useState("days")
  const [addValue, setAddValue] = useState("1")
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    // Set default dates
    if (!startDate) {
      const today = new Date()
      setStartDate(formatDateForInput(today))
    }

    if (!endDate) {
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      setEndDate(formatDateForInput(nextWeek))
    }
  }, [])

  useEffect(() => {
    if (calculationType === "difference" && startDate && endDate) {
      calculateDateDifference()
    } else if (calculationType === "add" && startDate && addValue) {
      calculateDateAddition()
    }
  }, [calculationType, startDate, endDate, addUnit, addValue])

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0]
  }

  const calculateDateDifference = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setResult(null)
      return
    }

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    const days = diffDays % 30

    let resultText = ""

    if (years > 0) {
      resultText += `${years} year${years !== 1 ? "s" : ""}, `
    }

    if (months > 0 || years > 0) {
      resultText += `${months} month${months !== 1 ? "s" : ""}, `
    }

    resultText += `${days} day${days !== 1 ? "s" : ""}`

    // Add whether the end date is in the future or past
    const now = new Date()
    if (end > now && start <= now) {
      resultText += " from now"
    } else if (start < now && end < now) {
      resultText += " ago"
    }

    setResult(resultText)
  }

  const calculateDateAddition = () => {
    const start = new Date(startDate)
    const value = Number.parseInt(addValue)

    if (isNaN(start.getTime()) || isNaN(value)) {
      setResult(null)
      return
    }

    const resultDate = new Date(start)

    switch (addUnit) {
      case "days":
        resultDate.setDate(resultDate.getDate() + value)
        break
      case "weeks":
        resultDate.setDate(resultDate.getDate() + value * 7)
        break
      case "months":
        resultDate.setMonth(resultDate.getMonth() + value)
        break
      case "years":
        resultDate.setFullYear(resultDate.getFullYear() + value)
        break
    }

    setResult(
      resultDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Date Calculator</h2>

      <div className="space-y-4">
        <RadioGroup value={calculationType} onValueChange={setCalculationType} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="difference" id="difference" />
            <Label htmlFor="difference">Date Difference</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="add" id="add" />
            <Label htmlFor="add">Add/Subtract Time</Label>
          </div>
        </RadioGroup>

        {calculationType === "difference" ? (
          <>
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="base-date">Base Date</Label>
              <Input id="base-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-value">Value</Label>
                <Input id="add-value" type="number" value={addValue} onChange={(e) => setAddValue(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="add-unit">Unit</Label>
                <Select value={addUnit} onValueChange={setAddUnit}>
                  <SelectTrigger id="add-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {result && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="font-medium">{result}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
