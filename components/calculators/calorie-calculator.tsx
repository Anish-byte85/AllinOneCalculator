"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CalorieCalculator() {
  const [gender, setGender] = useState("male")
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [activityLevel, setActivityLevel] = useState("moderate")
  const [unit, setUnit] = useState("metric")
  const [goal, setGoal] = useState("maintain")
  const [result, setResult] = useState<{
    bmr: number
    maintenance: number
    goal: number
    protein: number
    carbs: number
    fat: number
  } | null>(null)

  const calculateCalories = () => {
    const ageValue = Number.parseInt(age)
    let weightValue = Number.parseFloat(weight)
    let heightValue = Number.parseFloat(height)

    if (
      isNaN(ageValue) ||
      isNaN(weightValue) ||
      isNaN(heightValue) ||
      ageValue <= 0 ||
      weightValue <= 0 ||
      heightValue <= 0
    ) {
      setResult(null)
      return
    }

    // Convert imperial to metric if needed
    if (unit === "imperial") {
      // Convert pounds to kg
      weightValue = weightValue * 0.453592
      // Convert inches to cm
      heightValue = heightValue * 2.54
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number
    if (gender === "male") {
      bmr = 10 * weightValue + 6.25 * heightValue - 5 * ageValue + 5
    } else {
      bmr = 10 * weightValue + 6.25 * heightValue - 5 * ageValue - 161
    }

    // Calculate maintenance calories based on activity level
    let maintenanceCalories: number
    switch (activityLevel) {
      case "sedentary":
        maintenanceCalories = bmr * 1.2
        break
      case "light":
        maintenanceCalories = bmr * 1.375
        break
      case "moderate":
        maintenanceCalories = bmr * 1.55
        break
      case "active":
        maintenanceCalories = bmr * 1.725
        break
      case "veryActive":
        maintenanceCalories = bmr * 1.9
        break
      default:
        maintenanceCalories = bmr * 1.55
    }

    // Calculate goal calories
    let goalCalories: number
    switch (goal) {
      case "lose":
        goalCalories = maintenanceCalories * 0.8 // 20% deficit
        break
      case "maintain":
        goalCalories = maintenanceCalories
        break
      case "gain":
        goalCalories = maintenanceCalories * 1.15 // 15% surplus
        break
      default:
        goalCalories = maintenanceCalories
    }

    // Calculate macros (protein, carbs, fat)
    // Protein: 1g per pound of bodyweight (or 2.2g per kg)
    const proteinGrams = unit === "imperial" ? Number.parseFloat(weight) : weightValue * 2.2

    // Fat: 25% of calories (9 calories per gram)
    const fatGrams = (goalCalories * 0.25) / 9

    // Carbs: remaining calories (4 calories per gram)
    const carbGrams = (goalCalories - proteinGrams * 4 - fatGrams * 9) / 4

    setResult({
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenanceCalories),
      goal: Math.round(goalCalories),
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fat: Math.round(fatGrams),
    })
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Calorie Calculator</h2>

      <div className="space-y-4">
        <RadioGroup value={unit} onValueChange={setUnit} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="metric" id="metric" />
            <Label htmlFor="metric">Metric (kg, cm)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="imperial" id="imperial" />
            <Label htmlFor="imperial">Imperial (lb, in)</Label>
          </div>
        </RadioGroup>

        <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
        </RadioGroup>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Years"
            min="15"
            max="100"
          />
        </div>

        <div>
          <Label htmlFor="weight">Weight ({unit === "metric" ? "kg" : "lb"})</Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "Kilograms" : "Pounds"}
            min="30"
          />
        </div>

        <div>
          <Label htmlFor="height">Height ({unit === "metric" ? "cm" : "in"})</Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === "metric" ? "Centimeters" : "Inches"}
            min="100"
            max="250"
          />
        </div>

        <div>
          <Label htmlFor="activity-level">Activity Level</Label>
          <Select value={activityLevel} onValueChange={setActivityLevel}>
            <SelectTrigger id="activity-level">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
              <SelectItem value="veryActive">Very Active (hard exercise daily)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="goal">Goal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger id="goal">
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">Lose Weight</SelectItem>
              <SelectItem value="maintain">Maintain Weight</SelectItem>
              <SelectItem value="gain">Gain Weight</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculateCalories} className="w-full">
          Calculate
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Daily Calories for {goal === "lose" ? "Weight Loss" : goal === "gain" ? "Weight Gain" : "Maintenance"}
              </p>
              <p className="text-2xl font-bold">{result.goal} calories</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">BMR</p>
                <p className="text-xl font-bold">{result.bmr} calories</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Maintenance</p>
                <p className="text-xl font-bold">{result.maintenance} calories</p>
              </div>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Recommended Macros</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
                  <p className="font-bold">{result.protein}g</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{result.protein * 4} calories</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
                  <p className="font-bold">{result.carbs}g</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{result.carbs * 4} calories</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fat</p>
                  <p className="font-bold">{result.fat}g</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{result.fat * 9} calories</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${((result.protein * 4) / result.goal) * 100}%` }}
                  />
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${((result.carbs * 4) / result.goal) * 100}%` }}
                  />
                  <div className="h-full bg-red-500" style={{ width: `${((result.fat * 9) / result.goal) * 100}%` }} />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-blue-500">Protein</span>
                  <span className="text-green-500">Carbs</span>
                  <span className="text-red-500">Fat</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
