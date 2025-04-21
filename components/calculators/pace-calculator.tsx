"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaceCalculator() {
  const [calculationType, setCalculationType] = useState("pace")
  const [distance, setDistance] = useState("")
  const [distanceUnit, setDistanceUnit] = useState("km")
  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")
  const [seconds, setSeconds] = useState("")
  const [paceMinutes, setPaceMinutes] = useState("")
  const [paceSeconds, setPaceSeconds] = useState("")
  const [paceUnit, setPaceUnit] = useState("km")
  const [result, setResult] = useState<{
    pace?: { minutes: number; seconds: number; unit: string }
    time?: { hours: number; minutes: number; seconds: number }
    distance?: { value: number; unit: string }
    speed?: number
  } | null>(null)

  const calculatePace = () => {
    const distanceValue = Number.parseFloat(distance)

    if (calculationType === "pace") {
      // Calculate pace from distance and time
      const hoursValue = Number.parseInt(hours) || 0
      const minutesValue = Number.parseInt(minutes) || 0
      const secondsValue = Number.parseInt(seconds) || 0

      if (distanceValue <= 0 || (hoursValue === 0 && minutesValue === 0 && secondsValue === 0)) {
        setResult(null)
        return
      }

      // Convert everything to seconds
      const totalSeconds = hoursValue * 3600 + minutesValue * 60 + secondsValue

      // Convert distance to selected pace unit if needed
      let adjustedDistance = distanceValue
      if (distanceUnit !== paceUnit) {
        if (distanceUnit === "mi" && paceUnit === "km") {
          adjustedDistance = distanceValue * 1.60934
        } else if (distanceUnit === "km" && paceUnit === "mi") {
          adjustedDistance = distanceValue / 1.60934
        }
      }

      // Calculate pace in seconds per unit
      const paceInSeconds = totalSeconds / adjustedDistance

      // Convert to minutes and seconds
      const paceMinutesValue = Math.floor(paceInSeconds / 60)
      const paceSecondsValue = Math.floor(paceInSeconds % 60)

      // Calculate speed in distance unit per hour
      const speedValue = (distanceValue / totalSeconds) * 3600

      setResult({
        pace: {
          minutes: paceMinutesValue,
          seconds: paceSecondsValue,
          unit: paceUnit,
        },
        speed: speedValue,
      })
    } else if (calculationType === "time") {
      // Calculate time from distance and pace
      const paceMinutesValue = Number.parseInt(paceMinutes) || 0
      const paceSecondsValue = Number.parseInt(paceSeconds) || 0

      if (distanceValue <= 0 || (paceMinutesValue === 0 && paceSecondsValue === 0)) {
        setResult(null)
        return
      }

      // Convert pace to seconds per unit
      const paceInSeconds = paceMinutesValue * 60 + paceSecondsValue

      // Convert distance to pace unit if needed
      let adjustedDistance = distanceValue
      if (distanceUnit !== paceUnit) {
        if (distanceUnit === "mi" && paceUnit === "km") {
          adjustedDistance = distanceValue * 1.60934
        } else if (distanceUnit === "km" && paceUnit === "mi") {
          adjustedDistance = distanceValue / 1.60934
        }
      }

      // Calculate total time in seconds
      const totalSeconds = paceInSeconds * adjustedDistance

      // Convert to hours, minutes, seconds
      const hoursValue = Math.floor(totalSeconds / 3600)
      const minutesValue = Math.floor((totalSeconds % 3600) / 60)
      const secondsValue = Math.floor(totalSeconds % 60)

      // Calculate speed in distance unit per hour
      const speedValue = (distanceValue / totalSeconds) * 3600

      setResult({
        time: {
          hours: hoursValue,
          minutes: minutesValue,
          seconds: secondsValue,
        },
        speed: speedValue,
      })
    } else if (calculationType === "distance") {
      // Calculate distance from time and pace
      const hoursValue = Number.parseInt(hours) || 0
      const minutesValue = Number.parseInt(minutes) || 0
      const secondsValue = Number.parseInt(seconds) || 0
      const paceMinutesValue = Number.parseInt(paceMinutes) || 0
      const paceSecondsValue = Number.parseInt(paceSeconds) || 0

      if (
        (hoursValue === 0 && minutesValue === 0 && secondsValue === 0) ||
        (paceMinutesValue === 0 && paceSecondsValue === 0)
      ) {
        setResult(null)
        return
      }

      // Convert everything to seconds
      const totalSeconds = hoursValue * 3600 + minutesValue * 60 + secondsValue
      const paceInSeconds = paceMinutesValue * 60 + paceSecondsValue

      // Calculate distance in pace units
      const distanceInPaceUnits = totalSeconds / paceInSeconds

      // Convert to selected distance unit if needed
      let calculatedDistance = distanceInPaceUnits
      if (distanceUnit !== paceUnit) {
        if (paceUnit === "mi" && distanceUnit === "km") {
          calculatedDistance = distanceInPaceUnits * 1.60934
        } else if (paceUnit === "km" && distanceUnit === "mi") {
          calculatedDistance = distanceInPaceUnits / 1.60934
        }
      }

      // Calculate speed in distance unit per hour
      const speedValue = (calculatedDistance / totalSeconds) * 3600

      setResult({
        distance: {
          value: calculatedDistance,
          unit: distanceUnit,
        },
        speed: speedValue,
      })
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Pace Calculator</h2>

      <div className="space-y-4">
        <RadioGroup value={calculationType} onValueChange={setCalculationType} className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pace" id="pace" />
            <Label htmlFor="pace">Calculate Pace</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="time" id="time" />
            <Label htmlFor="time">Calculate Time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="distance" id="distance" />
            <Label htmlFor="distance">Calculate Distance</Label>
          </div>
        </RadioGroup>

        {(calculationType === "pace" || calculationType === "time" || calculationType === "distance") && (
          <div className="grid grid-cols-4 gap-2 items-end">
            <div className="col-span-3">
              <Label htmlFor="distance">Distance</Label>
              <Input
                id="distance"
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="0.0"
                disabled={calculationType === "distance"}
              />
            </div>
            <div>
              <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                <SelectTrigger id="distance-unit">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">km</SelectItem>
                  <SelectItem value="mi">mi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {(calculationType === "pace" || calculationType === "distance") && (
          <div>
            <Label>Time</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="hours" className="text-xs">
                  Hours
                </Label>
                <Input
                  id="hours"
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="minutes" className="text-xs">
                  Minutes
                </Label>
                <Input
                  id="minutes"
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="59"
                />
              </div>
              <div>
                <Label htmlFor="seconds" className="text-xs">
                  Seconds
                </Label>
                <Input
                  id="seconds"
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="59"
                />
              </div>
            </div>
          </div>
        )}

        {(calculationType === "time" || calculationType === "distance") && (
          <div>
            <Label>Pace</Label>
            <div className="grid grid-cols-3 gap-2 items-end">
              <div>
                <Label htmlFor="pace-minutes" className="text-xs">
                  Minutes
                </Label>
                <Input
                  id="pace-minutes"
                  type="number"
                  value={paceMinutes}
                  onChange={(e) => setPaceMinutes(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="pace-seconds" className="text-xs">
                  Seconds
                </Label>
                <Input
                  id="pace-seconds"
                  type="number"
                  value={paceSeconds}
                  onChange={(e) => setPaceSeconds(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="59"
                />
              </div>
              <div>
                <Select value={paceUnit} onValueChange={setPaceUnit}>
                  <SelectTrigger id="pace-unit">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">per km</SelectItem>
                    <SelectItem value="mi">per mi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <Button onClick={calculatePace} className="w-full">
          Calculate
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            {result.pace && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Pace</p>
                <p className="text-2xl font-bold">
                  {result.pace.minutes}:{result.pace.seconds.toString().padStart(2, "0")} min/{result.pace.unit}
                </p>
              </div>
            )}

            {result.time && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                <p className="text-2xl font-bold">
                  {result.time.hours}:{result.time.minutes.toString().padStart(2, "0")}:
                  {result.time.seconds.toString().padStart(2, "0")}
                </p>
              </div>
            )}

            {result.distance && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Distance</p>
                <p className="text-2xl font-bold">
                  {result.distance.value.toFixed(2)} {result.distance.unit}
                </p>
              </div>
            )}

            {result.speed && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Speed</p>
                <p className="text-xl font-bold">
                  {result.speed.toFixed(2)} {distanceUnit}/h
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
