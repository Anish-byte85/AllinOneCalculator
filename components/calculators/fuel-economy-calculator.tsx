"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function FuelEconomyCalculator() {
  const [unit, setUnit] = useState("mpg")
  const [distance, setDistance] = useState("")
  const [fuel, setFuel] = useState("")
  const [result, setResult] = useState<number | null>(null)

  const calculateFuelEconomy = () => {
    const distanceValue = Number.parseFloat(distance)
    const fuelValue = Number.parseFloat(fuel)

    if (isNaN(distanceValue) || isNaN(fuelValue) || distanceValue <= 0 || fuelValue <= 0) {
      setResult(null)
      return
    }

    if (unit === "mpg") {
      // Miles per gallon
      setResult(distanceValue / fuelValue)
    } else {
      // Liters per 100 kilometers
      setResult((fuelValue / distanceValue) * 100)
    }
  }

  const resetForm = () => {
    setDistance("")
    setFuel("")
    setResult(null)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Fuel Economy Calculator</h2>

      <div className="space-y-4">
        <RadioGroup value={unit} onValueChange={setUnit} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mpg" id="mpg" />
            <Label htmlFor="mpg">MPG (Miles per Gallon)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lp100km" id="lp100km" />
            <Label htmlFor="lp100km">L/100km (Liters per 100 Kilometers)</Label>
          </div>
        </RadioGroup>

        <div>
          <Label htmlFor="distance">{unit === "mpg" ? "Distance (miles)" : "Distance (kilometers)"}</Label>
          <Input
            id="distance"
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Enter distance"
          />
        </div>

        <div>
          <Label htmlFor="fuel">{unit === "mpg" ? "Fuel Used (gallons)" : "Fuel Used (liters)"}</Label>
          <Input
            id="fuel"
            type="number"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            placeholder="Enter fuel amount"
          />
        </div>

        <div className="flex space-x-4">
          <Button onClick={calculateFuelEconomy} className="flex-1">
            Calculate
          </Button>
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
        </div>

        {result !== null && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Fuel Economy</p>
            <p className="text-2xl font-bold">
              {result.toFixed(2)} {unit === "mpg" ? "MPG" : "L/100km"}
            </p>
            {unit === "mpg" && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{(235.214 / result).toFixed(2)} L/100km</p>
            )}
            {unit === "lp100km" && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{(235.214 / result).toFixed(2)} MPG</p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
