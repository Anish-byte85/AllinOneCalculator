"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function StandardCalculator() {
  const [display, setDisplay] = useState("0")
  const [currentValue, setCurrentValue] = useState<string | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const clearAll = () => {
    setDisplay("0")
    setCurrentValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const performOperation = (nextOperator: string) => {
    const inputValue = Number.parseFloat(display)

    if (currentValue === null) {
      setCurrentValue(display)
    } else if (operator) {
      const result = calculate(Number.parseFloat(currentValue), inputValue, operator)
      setDisplay(String(result))
      setCurrentValue(String(result))
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  const calculate = (firstValue: number, secondValue: number, op: string) => {
    switch (op) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      default:
        return secondValue
    }
  }

  const handleEquals = () => {
    if (!operator || currentValue === null) return

    const inputValue = Number.parseFloat(display)
    const result = calculate(Number.parseFloat(currentValue), inputValue, operator)

    setDisplay(String(result))
    setCurrentValue(null)
    setOperator(null)
    setWaitingForOperand(true)
  }

  const handlePercentage = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(value / 100))
  }

  const toggleSign = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(-value))
  }

  return (
    <Card className="p-4">
      <div className="text-right p-4 bg-gray-100 dark:bg-gray-700 rounded mb-4 h-16 flex items-center justify-end">
        <div className="text-3xl font-mono overflow-x-auto whitespace-nowrap">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button variant="outline" onClick={clearAll}>
          C
        </Button>
        <Button variant="outline" onClick={toggleSign}>
          +/-
        </Button>
        <Button variant="outline" onClick={handlePercentage}>
          %
        </Button>
        <Button variant="outline" onClick={() => performOperation("÷")}>
          ÷
        </Button>

        <Button onClick={() => inputDigit("7")}>7</Button>
        <Button onClick={() => inputDigit("8")}>8</Button>
        <Button onClick={() => inputDigit("9")}>9</Button>
        <Button variant="outline" onClick={() => performOperation("×")}>
          ×
        </Button>

        <Button onClick={() => inputDigit("4")}>4</Button>
        <Button onClick={() => inputDigit("5")}>5</Button>
        <Button onClick={() => inputDigit("6")}>6</Button>
        <Button variant="outline" onClick={() => performOperation("-")}>
          -
        </Button>

        <Button onClick={() => inputDigit("1")}>1</Button>
        <Button onClick={() => inputDigit("2")}>2</Button>
        <Button onClick={() => inputDigit("3")}>3</Button>
        <Button variant="outline" onClick={() => performOperation("+")}>
          +
        </Button>

        <Button className="col-span-2" onClick={() => inputDigit("0")}>
          0
        </Button>
        <Button onClick={inputDecimal}>.</Button>
        <Button variant="default" onClick={handleEquals}>
          =
        </Button>
      </div>
    </Card>
  )
}
