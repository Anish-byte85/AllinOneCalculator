"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PercentageCalculator() {
  const [value1, setValue1] = useState("")
  const [value2, setValue2] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [calculationType, setCalculationType] = useState<string>("percentOf")

  const calculate = () => {
    const num1 = Number.parseFloat(value1)
    const num2 = Number.parseFloat(value2)

    if (isNaN(num1) || isNaN(num2)) {
      setResult("Please enter valid numbers")
      return
    }

    let calculatedResult: number

    switch (calculationType) {
      case "percentOf":
        // What is X% of Y?
        calculatedResult = (num1 / 100) * num2
        setResult(`${num1}% of ${num2} is ${calculatedResult.toFixed(2)}`)
        break
      case "percentageChange":
        // Percentage increase/decrease from X to Y
        calculatedResult = ((num2 - num1) / num1) * 100
        const changeType = calculatedResult >= 0 ? "increase" : "decrease"
        setResult(`The percentage ${changeType} from ${num1} to ${num2} is ${Math.abs(calculatedResult).toFixed(2)}%`)
        break
      case "percentageIs":
        // X is what percentage of Y?
        calculatedResult = (num1 / num2) * 100
        setResult(`${num1} is ${calculatedResult.toFixed(2)}% of ${num2}`)
        break
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Percentage Calculator</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant={calculationType === "percentOf" ? "default" : "outline"}
            onClick={() => setCalculationType("percentOf")}
            className="text-sm"
          >
            What is X% of Y?
          </Button>
          <Button
            variant={calculationType === "percentageChange" ? "default" : "outline"}
            onClick={() => setCalculationType("percentageChange")}
            className="text-sm"
          >
            % Change from X to Y
          </Button>
          <Button
            variant={calculationType === "percentageIs" ? "default" : "outline"}
            onClick={() => setCalculationType("percentageIs")}
            className="text-sm"
          >
            X is what % of Y?
          </Button>
        </div>

        <div className="space-y-4">
          {calculationType === "percentOf" && (
            <>
              <div>
                <Label htmlFor="percent">Percentage (%)</Label>
                <Input
                  id="percent"
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  placeholder="Enter percentage"
                />
              </div>
              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
            </>
          )}

          {calculationType === "percentageChange" && (
            <>
              <div>
                <Label htmlFor="originalValue">Original Value</Label>
                <Input
                  id="originalValue"
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  placeholder="Enter original value"
                />
              </div>
              <div>
                <Label htmlFor="newValue">New Value</Label>
                <Input
                  id="newValue"
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  placeholder="Enter new value"
                />
              </div>
            </>
          )}

          {calculationType === "percentageIs" && (
            <>
              <div>
                <Label htmlFor="part">Part</Label>
                <Input
                  id="part"
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  placeholder="Enter part value"
                />
              </div>
              <div>
                <Label htmlFor="whole">Whole</Label>
                <Input
                  id="whole"
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  placeholder="Enter whole value"
                />
              </div>
            </>
          )}

          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="font-medium">{result}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
