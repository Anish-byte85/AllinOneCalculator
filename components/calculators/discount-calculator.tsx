"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("")
  const [discountValue, setDiscountValue] = useState("")
  const [discountType, setDiscountType] = useState("percentage")
  const [finalPrice, setFinalPrice] = useState<number | null>(null)
  const [savedAmount, setSavedAmount] = useState<number | null>(null)
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(null)

  useEffect(() => {
    calculateDiscount()
  }, [originalPrice, discountValue, discountType])

  const calculateDiscount = () => {
    const price = Number.parseFloat(originalPrice)
    const discount = Number.parseFloat(discountValue)

    if (isNaN(price) || price <= 0 || isNaN(discount) || discount < 0) {
      setFinalPrice(null)
      setSavedAmount(null)
      setDiscountPercentage(null)
      return
    }

    let discountAmount: number
    let calculatedFinalPrice: number
    let calculatedDiscountPercentage: number

    if (discountType === "percentage") {
      discountAmount = price * (discount / 100)
      calculatedFinalPrice = price - discountAmount
      calculatedDiscountPercentage = discount
    } else {
      discountAmount = discount
      calculatedFinalPrice = price - discountAmount
      calculatedDiscountPercentage = (discountAmount / price) * 100
    }

    setFinalPrice(calculatedFinalPrice)
    setSavedAmount(discountAmount)
    setDiscountPercentage(calculatedDiscountPercentage)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Discount Calculator</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="original-price">Original Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="original-price"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="0.00"
              className="pl-8"
            />
          </div>
        </div>

        <RadioGroup value={discountType} onValueChange={setDiscountType} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="percentage" />
            <Label htmlFor="percentage">Percentage (%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="amount" id="amount" />
            <Label htmlFor="amount">Amount ($)</Label>
          </div>
        </RadioGroup>

        <div>
          <Label htmlFor="discount-value">
            {discountType === "percentage" ? "Discount Percentage" : "Discount Amount"}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {discountType === "percentage" ? "%" : "$"}
            </span>
            <Input
              id="discount-value"
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder="0.00"
              className="pl-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Final Price</p>
            <p className="text-xl font-bold">
              {finalPrice !== null
                ? `$${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "-"}
            </p>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">You Save</p>
            <p className="text-xl font-bold">
              {savedAmount !== null
                ? `$${savedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "-"}
            </p>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Discount</p>
            <p className="text-xl font-bold">
              {discountPercentage !== null ? `${discountPercentage.toFixed(2)}%` : "-"}
            </p>
          </div>
        </div>

        {finalPrice !== null && (
          <div className="mt-4">
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${discountPercentage}%` }} />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>Final Price: ${finalPrice.toFixed(2)}</span>
              <span>Original: ${originalPrice}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
