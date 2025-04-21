"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UnitConverter() {
  const [value, setValue] = useState("1")
  const [fromUnit, setFromUnit] = useState("")
  const [toUnit, setToUnit] = useState("")
  const [result, setResult] = useState<number | null>(null)
  const [unitType, setUnitType] = useState("length")

  const unitTypes = {
    length: {
      units: [
        { value: "mm", label: "Millimeters (mm)" },
        { value: "cm", label: "Centimeters (cm)" },
        { value: "m", label: "Meters (m)" },
        { value: "km", label: "Kilometers (km)" },
        { value: "in", label: "Inches (in)" },
        { value: "ft", label: "Feet (ft)" },
        { value: "yd", label: "Yards (yd)" },
        { value: "mi", label: "Miles (mi)" },
      ],
      conversions: {
        mm: {
          mm: 1,
          cm: 0.1,
          m: 0.001,
          km: 0.000001,
          in: 0.0393701,
          ft: 0.00328084,
          yd: 0.00109361,
          mi: 0.000000621371,
        },
        cm: { mm: 10, cm: 1, m: 0.01, km: 0.00001, in: 0.393701, ft: 0.0328084, yd: 0.0109361, mi: 0.00000621371 },
        m: { mm: 1000, cm: 100, m: 1, km: 0.001, in: 39.3701, ft: 3.28084, yd: 1.09361, mi: 0.000621371 },
        km: { mm: 1000000, cm: 100000, m: 1000, km: 1, in: 39370.1, ft: 3280.84, yd: 1093.61, mi: 0.621371 },
        in: { mm: 25.4, cm: 2.54, m: 0.0254, km: 0.0000254, in: 1, ft: 0.0833333, yd: 0.0277778, mi: 0.0000157828 },
        ft: { mm: 304.8, cm: 30.48, m: 0.3048, km: 0.0003048, in: 12, ft: 1, yd: 0.333333, mi: 0.000189394 },
        yd: { mm: 914.4, cm: 91.44, m: 0.9144, km: 0.0009144, in: 36, ft: 3, yd: 1, mi: 0.000568182 },
        mi: { mm: 1609344, cm: 160934, m: 1609.34, km: 1.60934, in: 63360, ft: 5280, yd: 1760, mi: 1 },
      },
    },
    weight: {
      units: [
        { value: "mg", label: "Milligrams (mg)" },
        { value: "g", label: "Grams (g)" },
        { value: "kg", label: "Kilograms (kg)" },
        { value: "oz", label: "Ounces (oz)" },
        { value: "lb", label: "Pounds (lb)" },
        { value: "st", label: "Stone (st)" },
        { value: "t", label: "Metric Tons (t)" },
      ],
      conversions: {
        mg: { mg: 1, g: 0.001, kg: 0.000001, oz: 0.000035274, lb: 0.00000220462, st: 0.000000157473, t: 0.000000001 },
        g: { mg: 1000, g: 1, kg: 0.001, oz: 0.035274, lb: 0.00220462, st: 0.000157473, t: 0.000001 },
        kg: { mg: 1000000, g: 1000, kg: 1, oz: 35.274, lb: 2.20462, st: 0.157473, t: 0.001 },
        oz: { mg: 28349.5, g: 28.3495, kg: 0.0283495, oz: 1, lb: 0.0625, st: 0.00446429, t: 0.0000283495 },
        lb: { mg: 453592, g: 453.592, kg: 0.453592, oz: 16, lb: 1, st: 0.0714286, t: 0.000453592 },
        st: { mg: 6350290, g: 6350.29, kg: 6.35029, oz: 224, lb: 14, st: 1, t: 0.00635029 },
        t: { mg: 1000000000, g: 1000000, kg: 1000, oz: 35274, lb: 2204.62, st: 157.473, t: 1 },
      },
    },
    volume: {
      units: [
        { value: "ml", label: "Milliliters (ml)" },
        { value: "l", label: "Liters (l)" },
        { value: "m3", label: "Cubic Meters (m³)" },
        { value: "tsp", label: "Teaspoons (tsp)" },
        { value: "tbsp", label: "Tablespoons (tbsp)" },
        { value: "fl_oz", label: "Fluid Ounces (fl oz)" },
        { value: "cup", label: "Cups" },
        { value: "pt", label: "Pints (pt)" },
        { value: "qt", label: "Quarts (qt)" },
        { value: "gal", label: "Gallons (gal)" },
      ],
      conversions: {
        ml: {
          ml: 1,
          l: 0.001,
          m3: 0.000001,
          tsp: 0.202884,
          tbsp: 0.067628,
          fl_oz: 0.033814,
          cup: 0.00422675,
          pt: 0.00211338,
          qt: 0.00105669,
          gal: 0.000264172,
        },
        l: {
          ml: 1000,
          l: 1,
          m3: 0.001,
          tsp: 202.884,
          tbsp: 67.628,
          fl_oz: 33.814,
          cup: 4.22675,
          pt: 2.11338,
          qt: 1.05669,
          gal: 0.264172,
        },
        m3: {
          ml: 1000000,
          l: 1000,
          m3: 1,
          tsp: 202884,
          tbsp: 67628,
          fl_oz: 33814,
          cup: 4226.75,
          pt: 2113.38,
          qt: 1056.69,
          gal: 264.172,
        },
        tsp: {
          ml: 4.92892,
          l: 0.00492892,
          m3: 0.00000492892,
          tsp: 1,
          tbsp: 0.333333,
          fl_oz: 0.166667,
          cup: 0.0208333,
          pt: 0.0104167,
          qt: 0.00520833,
          gal: 0.00130208,
        },
        tbsp: {
          ml: 14.7868,
          l: 0.0147868,
          m3: 0.0000147868,
          tsp: 3,
          tbsp: 1,
          fl_oz: 0.5,
          cup: 0.0625,
          pt: 0.03125,
          qt: 0.015625,
          gal: 0.00390625,
        },
        fl_oz: {
          ml: 29.5735,
          l: 0.0295735,
          m3: 0.0000295735,
          tsp: 6,
          tbsp: 2,
          fl_oz: 1,
          cup: 0.125,
          pt: 0.0625,
          qt: 0.03125,
          gal: 0.0078125,
        },
        cup: {
          ml: 236.588,
          l: 0.236588,
          m3: 0.000236588,
          tsp: 48,
          tbsp: 16,
          fl_oz: 8,
          cup: 1,
          pt: 0.5,
          qt: 0.25,
          gal: 0.0625,
        },
        pt: {
          ml: 473.176,
          l: 0.473176,
          m3: 0.000473176,
          tsp: 96,
          tbsp: 32,
          fl_oz: 16,
          cup: 2,
          pt: 1,
          qt: 0.5,
          gal: 0.125,
        },
        qt: {
          ml: 946.353,
          l: 0.946353,
          m3: 0.000946353,
          tsp: 192,
          tbsp: 64,
          fl_oz: 32,
          cup: 4,
          pt: 2,
          qt: 1,
          gal: 0.25,
        },
        gal: {
          ml: 3785.41,
          l: 3.78541,
          m3: 0.00378541,
          tsp: 768,
          tbsp: 256,
          fl_oz: 128,
          cup: 16,
          pt: 8,
          qt: 4,
          gal: 1,
        },
      },
    },
  }

  useEffect(() => {
    // Set default units when unit type changes
    if (unitType === "length") {
      setFromUnit("m")
      setToUnit("ft")
    } else if (unitType === "weight") {
      setFromUnit("kg")
      setToUnit("lb")
    } else if (unitType === "volume") {
      setFromUnit("l")
      setToUnit("gal")
    }
  }, [unitType])

  useEffect(() => {
    if (fromUnit && toUnit) {
      convertUnit()
    }
  }, [value, fromUnit, toUnit])

  const convertUnit = () => {
    const inputValue = Number.parseFloat(value)

    if (isNaN(inputValue) || inputValue < 0 || !fromUnit || !toUnit) {
      setResult(null)
      return
    }

    // Add type safety with proper checks
    const currentUnitType = unitTypes[unitType as keyof typeof unitTypes]
    if (!currentUnitType) {
      setResult(null)
      return
    }

    const conversions = currentUnitType.conversions
    if (!conversions) {
      setResult(null)
      return
    }

    const fromUnitConversions = conversions[fromUnit as any]
    if (!fromUnitConversions) {
      setResult(null)
      return
    }

    const conversionFactor = fromUnitConversions[toUnit as any]
    if (conversionFactor === undefined) {
      setResult(null)
      return
    }

    const convertedValue = inputValue * conversionFactor
    setResult(convertedValue)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Unit Converter</h2>

      <Tabs value={unitType} onValueChange={setUnitType} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="length">Length</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="from-unit">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger id="from-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {unitTypes[unitType as keyof typeof unitTypes].units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="to-unit">To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger id="to-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {unitTypes[unitType as keyof typeof unitTypes].units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result !== null && fromUnit && toUnit && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {Number.parseFloat(value).toLocaleString()} {fromUnit} =
            </p>
            <p className="text-2xl font-bold">
              {result.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 8,
              })}{" "}
              {toUnit}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              1 {fromUnit} ={" "}
              {unitTypes[unitType as keyof typeof unitTypes]?.conversions?.[fromUnit as any]?.[toUnit as any]?.toFixed(
                8,
              ) || "N/A"}{" "}
              {toUnit}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
