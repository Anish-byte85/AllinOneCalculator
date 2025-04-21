"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("")
  const [result, setResult] = useState<{
    years: number
    months: number
    days: number
    totalMonths: number
    totalWeeks: number
    totalDays: number
    totalHours: number
  } | null>(null)

  const calculateAge = () => {
    const birth = new Date(birthDate)

    if (isNaN(birth.getTime()) || birth > new Date()) {
      setResult(null)
      return
    }

    const today = new Date()

    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    let days = today.getDate() - birth.getDate()

    // Adjust for negative days or months
    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 0)
      days += lastMonth.getDate()
      months--
    }

    if (months < 0) {
      months += 12
      years--
    }

    // Calculate total values
    const diffTime = Math.abs(today.getTime() - birth.getTime())
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const totalHours = totalDays * 24

    setResult({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
    })
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Age Calculator</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="birth-date">Date of Birth</Label>
          <Input id="birth-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>

        <Button onClick={calculateAge} className="w-full">
          Calculate Age
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
              <p className="text-xl font-bold">
                {result.years} years, {result.months} months, {result.days} days
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Months</p>
                <p className="text-lg font-bold">{result.totalMonths.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Weeks</p>
                <p className="text-lg font-bold">{result.totalWeeks.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Days</p>
                <p className="text-lg font-bold">{result.totalDays.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Hours</p>
                <p className="text-lg font-bold">{result.totalHours.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Next Birthday</p>
              <p className="text-lg font-bold">
                {(() => {
                  const today = new Date()
                  const nextBirthday = new Date(
                    today.getFullYear(),
                    new Date(birthDate).getMonth(),
                    new Date(birthDate).getDate(),
                  )

                  if (nextBirthday < today) {
                    nextBirthday.setFullYear(today.getFullYear() + 1)
                  }

                  const diffTime = Math.abs(nextBirthday.getTime() - today.getTime())
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                  return `${diffDays} days from now (${nextBirthday.toLocaleDateString()})`
                })()}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
