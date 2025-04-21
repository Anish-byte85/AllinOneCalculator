"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function FuelCostCalculator() {
  const [distanceUnit, setDistanceUnit] = useState("miles")
  const [fuelUnit, setFuelUnit] = useState("mpg")
  const [distance, setDistance] = useState("")
  const [fuelEfficiency, setFuelEfficiency] = useState("")
  const [fuelPrice, setFuelPrice] = useState("")
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [numPassengers, setNumPassengers] = useState("1")
  const [result, setResult] = useState<{
    totalCost: number
    costPerUnit: number
    costPerPerson: number
    fuelAmount: number
  } | null>(null)

  useEffect(() => {
    if (distance && fuelEfficiency && fuelPrice) {
      calculateFuelCost()
    }
  }, [distance, fuelEfficiency, fuelPrice, distanceUnit, fuelUnit, isRoundTrip, numPassengers])

  const calculateFuelCost = () => {
    const distanceValue = Number.parseFloat(distance)
    const fuelEfficiencyValue = Number.parseFloat(fuelEfficiency)
    const fuelPriceValue = Number.parseFloat(fuelPrice)
    const passengers = Number.parseInt(numPassengers) || 1

    if (
      isNaN(distanceValue) ||
      isNaN(fuelEfficiencyValue) ||
      isNaN(fuelPriceValue) ||
      distanceValue <= 0 ||
      fuelEfficiencyValue <= 0 ||
      fuelPriceValue <= 0
    ) {
      setResult(null)
      return
    }

    // Adjust for round trip if selected
    const totalDistance = isRoundTrip ? distanceValue * 2 : distanceValue

    let fuelAmount: number
    let costPerUnit: number

    if (fuelUnit === "mpg") {
      // Miles per gallon calculation
      if (distanceUnit === "miles") {
        fuelAmount = totalDistance / fuelEfficiencyValue
      } else {
        // Convert km to miles for MPG calculation
        fuelAmount = (totalDistance * 0.621371) / fuelEfficiencyValue
      }

      const totalCost = fuelAmount * fuelPriceValue

      if (distanceUnit === "miles") {
        costPerUnit = totalCost / totalDistance
      } else {
        costPerUnit = totalCost / totalDistance
      }

      setResult({
        totalCost,
        costPerUnit,
        costPerPerson: totalCost / passengers,
        fuelAmount,
      })
    } else {
      // L/100km calculation
      if (distanceUnit === "kilometers") {
        fuelAmount = (totalDistance / 100) * fuelEfficiencyValue
      } else {
        // Convert miles to km for L/100km calculation
        fuelAmount = ((totalDistance * 1.60934) / 100) * fuelEfficiencyValue
      }

      const totalCost = fuelAmount * fuelPriceValue

      if (distanceUnit === "kilometers") {
        costPerUnit = totalCost / totalDistance
      } else {
        costPerUnit = totalCost / totalDistance
      }

      setResult({
        totalCost,
        costPerUnit,
        costPerPerson: totalCost / passengers,
        fuelAmount,
      })
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Fuel Cost Calculator</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="distance">Distance</Label>
            <div className="flex">
              <Input
                id="distance"
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Enter distance"
                className="rounded-r-none"
              />
              <Button
                variant="outline"
                className="rounded-l-none border-l-0"
                onClick={() => setDistanceUnit(distanceUnit === "miles" ? "kilometers" : "miles")}
              >
                {distanceUnit === "miles" ? "mi" : "km"}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="fuel-price">Fuel Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="fuel-price"
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                placeholder="Price per gallon/liter"
                className="pl-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                per {fuelUnit === "mpg" ? "gallon" : "liter"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="fuel-efficiency">Fuel Efficiency</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFuelUnit(fuelUnit === "mpg" ? "lp100km" : "mpg")
                // Convert between MPG and L/100km if there's a value
                if (fuelEfficiency) {
                  const value = Number.parseFloat(fuelEfficiency)
                  if (!isNaN(value) && value > 0) {
                    if (fuelUnit === "mpg") {
                      // Convert MPG to L/100km: 235.214 / MPG = L/100km
                      setFuelEfficiency((235.214 / value).toFixed(1))
                    } else {
                      // Convert L/100km to MPG: 235.214 / L/100km = MPG
                      setFuelEfficiency((235.214 / value).toFixed(1))
                    }
                  }
                }
              }}
            >
              Switch to {fuelUnit === "mpg" ? "L/100km" : "MPG"}
            </Button>
          </div>
          <Input
            id="fuel-efficiency"
            type="number"
            value={fuelEfficiency}
            onChange={(e) => setFuelEfficiency(e.target.value)}
            placeholder={fuelUnit === "mpg" ? "Miles per gallon" : "Liters per 100km"}
          />
          <div className="text-xs text-gray-500 mt-1">
            {fuelUnit === "mpg" ? "Higher is better" : "Lower is better"}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch id="round-trip" checked={isRoundTrip} onCheckedChange={setIsRoundTrip} />
            <Label htmlFor="round-trip">Round Trip</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="passengers">Passengers:</Label>
            <Input
              id="passengers"
              type="number"
              value={numPassengers}
              onChange={(e) => setNumPassengers(e.target.value)}
              className="w-16"
              min="1"
              max="10"
            />
          </div>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Fuel Cost</p>
              <p className="text-2xl font-bold">${result.totalCost.toFixed(2)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isRoundTrip ? "Round trip" : "One way"} • {result.fuelAmount.toFixed(2)}{" "}
                {fuelUnit === "mpg" ? "gallons" : "liters"} of fuel
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Cost per {distanceUnit === "miles" ? "Mile" : "Kilometer"}
                </p>
                <p className="text-xl font-bold">${result.costPerUnit.toFixed(3)}</p>
              </div>

              {Number.parseInt(numPassengers) > 1 && (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cost per Person</p>
                  <p className="text-xl font-bold">${result.costPerPerson.toFixed(2)}</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${Math.min(100, (1 / result.costPerUnit) * 10)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Higher Cost</span>
                <span>Lower Cost</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
