"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function BMICalculator() {
  const [unit, setUnit] = useState("metric")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [feet, setFeet] = useState("")
  const [inches, setInches] = useState("")
  const [result, setResult] = useState<number | null>(null)
  const [category, setCategory] = useState<string | null>(null)

  const calculateBMI = () => {
    let bmi: number

    if (unit === "metric") {
      const heightInMeters = Number.parseFloat(height) / 100
      const weightInKg = Number.parseFloat(weight)

      if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters <= 0 || weightInKg <= 0) {
        setResult(null)
        setCategory(null)
        return
      }

      bmi = weightInKg / (heightInMeters * heightInMeters)
    } else {
      const heightInInches = Number.parseFloat(feet) * 12 + Number.parseFloat(inches)
      const weightInLbs = Number.parseFloat(weight)

      if (isNaN(heightInInches) || isNaN(weightInLbs) || heightInInches <= 0 || weightInLbs <= 0) {
        setResult(null)
        setCategory(null)
        return
      }

      bmi = (weightInLbs * 703) / (heightInInches * heightInInches)
    }

    setResult(bmi)

    // Determine BMI category
    if (bmi < 18.5) {
      setCategory("Underweight")
    } else if (bmi >= 18.5 && bmi < 25) {
      setCategory("Normal weight")
    } else if (bmi >= 25 && bmi < 30) {
      setCategory("Overweight")
    } else {
      setCategory("Obesity")
    }
  }

  const resetForm = () => {
    setHeight("")
    setWeight("")
    setFeet("")
    setInches("")
    setResult(null)
    setCategory(null)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">BMI Calculator</h2>

      <div className="space-y-4">
        <RadioGroup value={unit} onValueChange={setUnit} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="metric" id="metric" />
            <Label htmlFor="metric">Metric (cm, kg)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="imperial" id="imperial" />
            <Label htmlFor="imperial">Imperial (ft, in, lbs)</Label>
          </div>
        </RadioGroup>

        {unit === "metric" ? (
          <>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter height in centimeters"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight in kilograms"
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="feet">Height (feet)</Label>
                <Input
                  id="feet"
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  placeholder="Feet"
                />
              </div>
              <div>
                <Label htmlFor="inches">Height (inches)</Label>
                <Input
                  id="inches"
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  placeholder="Inches"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="weight-imperial">Weight (lbs)</Label>
              <Input
                id="weight-imperial"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight in pounds"
              />
            </div>
          </>
        )}

        <div className="flex space-x-4">
          <Button onClick={calculateBMI} className="flex-1">
            Calculate BMI
          </Button>
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
        </div>

        {result !== null && category !== null && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="font-medium">Your BMI: {result.toFixed(1)}</p>
            <p className="mt-2">
              Category: <span className="font-bold">{category}</span>
            </p>
            <div className="mt-4">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    category === "Underweight"
                      ? "bg-blue-500"
                      : category === "Normal weight"
                        ? "bg-green-500"
                        : category === "Overweight"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min((result / 40) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
