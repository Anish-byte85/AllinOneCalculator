"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0")
  const [memory, setMemory] = useState<number | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [currentValue, setCurrentValue] = useState<string | null>(null)
  const [operator, setOperator] = useState<string | null>(null)

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
      case "^":
        return Math.pow(firstValue, secondValue)
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

  const handleSin = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(Math.sin(value)))
    setWaitingForOperand(true)
  }

  const handleCos = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(Math.cos(value)))
    setWaitingForOperand(true)
  }

  const handleTan = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(Math.tan(value)))
    setWaitingForOperand(true)
  }

  const handleLog = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(Math.log10(value)))
    setWaitingForOperand(true)
  }

  const handleLn = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(Math.log(value)))
    setWaitingForOperand(true)
  }

  const handleSqrt = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(Math.sqrt(value)))
    setWaitingForOperand(true)
  }

  const handlePi = () => {
    setDisplay(String(Math.PI))
    setWaitingForOperand(true)
  }

  const handleE = () => {
    setDisplay(String(Math.E))
    setWaitingForOperand(true)
  }

  const handlePower = () => {
    performOperation("^")
  }

  const handleMemoryStore = () => {
    setMemory(Number.parseFloat(display))
  }

  const handleMemoryRecall = () => {
    if (memory !== null) {
      setDisplay(String(memory))
      setWaitingForOperand(true)
    }
  }

  const handleMemoryClear = () => {
    setMemory(null)
  }

  return (
    <Card className="p-4">
      <div className="text-right p-4 bg-gray-100 dark:bg-gray-700 rounded mb-4 h-16 flex items-center justify-end">
        <div className="text-3xl font-mono overflow-x-auto whitespace-nowrap">{display}</div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <Button variant="outline" onClick={handleMemoryStore}>
          MS
        </Button>
        <Button variant="outline" onClick={handleMemoryRecall}>
          MR
        </Button>
        <Button variant="outline" onClick={handleMemoryClear}>
          MC
        </Button>
        <Button variant="outline" onClick={clearAll}>
          C
        </Button>
        <Button variant="outline" onClick={() => performOperation("÷")}>
          ÷
        </Button>

        <Button variant="outline" onClick={handleSin}>
          sin
        </Button>
        <Button variant="outline" onClick={handleCos}>
          cos
        </Button>
        <Button variant="outline" onClick={handleTan}>
          tan
        </Button>
        <Button variant="outline" onClick={handlePower}>
          x^y
        </Button>
        <Button variant="outline" onClick={() => performOperation("×")}>
          ×
        </Button>

        <Button variant="outline" onClick={handleLog}>
          log
        </Button>
        <Button variant="outline" onClick={handleLn}>
          ln
        </Button>
        <Button variant="outline" onClick={handleSqrt}>
          √
        </Button>
        <Button variant="outline" onClick={handlePi}>
          π
        </Button>
        <Button variant="outline" onClick={() => performOperation("-")}>
          -
        </Button>

        <Button onClick={() => inputDigit("7")}>7</Button>
        <Button onClick={() => inputDigit("8")}>8</Button>
        <Button onClick={() => inputDigit("9")}>9</Button>
        <Button variant="outline" onClick={handleE}>
          e
        </Button>
        <Button variant="outline" onClick={() => performOperation("+")}>
          +
        </Button>

        <Button onClick={() => inputDigit("4")}>4</Button>
        <Button onClick={() => inputDigit("5")}>5</Button>
        <Button onClick={() => inputDigit("6")}>6</Button>
        <Button onClick={() => inputDigit("1")}>1</Button>
        <Button onClick={() => inputDigit("2")}>2</Button>

        <Button onClick={() => inputDigit("3")}>3</Button>
        <Button onClick={() => inputDigit("0")}>0</Button>
        <Button onClick={inputDecimal}>.</Button>
        <Button className="col-span-2" variant="default" onClick={handleEquals}>
          =
        </Button>
      </div>
    </Card>
  )
}
