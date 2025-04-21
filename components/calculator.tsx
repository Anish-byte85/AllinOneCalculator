"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Menu, X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

// Import calculator components
import StandardCalculator from "@/components/calculators/standard-calculator"
import ScientificCalculator from "@/components/calculators/scientific-calculator"
import PercentageCalculator from "@/components/calculators/percentage-calculator"
import BMICalculator from "@/components/calculators/bmi-calculator"
import CurrencyConverter from "@/components/calculators/currency-converter"
import UnitConverter from "@/components/calculators/unit-converter"
import DateCalculator from "@/components/calculators/date-calculator"
import LoanCalculator from "@/components/calculators/loan-calculator"
import TipCalculator from "@/components/calculators/tip-calculator"
import AgeCalculator from "@/components/calculators/age-calculator"
import DiscountCalculator from "@/components/calculators/discount-calculator"
import TimeCalculator from "@/components/calculators/time-calculator"
import FuelEconomyCalculator from "@/components/calculators/fuel-economy-calculator"
import PregnancyCalculator from "@/components/calculators/pregnancy-calculator"
import CalorieCalculator from "@/components/calculators/calorie-calculator"
import CompoundInterestCalculator from "@/components/calculators/compound-interest-calculator"
import RetirementCalculator from "@/components/calculators/retirement-calculator"
import OvulationCalculator from "@/components/calculators/ovulation-calculator"
import GPACalculator from "@/components/calculators/gpa-calculator"
import PaceCalculator from "@/components/calculators/pace-calculator"
import FuelCostCalculator from "@/components/calculators/fuel-cost-calculator"

// Define calculator categories and items
const calculatorCategories = [
  {
    name: "Basic",
    items: [
      { id: "standard", name: "Standard", component: <StandardCalculator /> },
      { id: "scientific", name: "Scientific", component: <ScientificCalculator /> },
      { id: "percentage", name: "Percentage", component: <PercentageCalculator /> },
    ],
  },
  {
    name: "Financial",
    items: [
      { id: "loan", name: "Loan", component: <LoanCalculator /> },
      { id: "tip", name: "Tip", component: <TipCalculator /> },
      { id: "discount", name: "Discount", component: <DiscountCalculator /> },
      { id: "interest", name: "Compound Interest", component: <CompoundInterestCalculator /> },
      { id: "retirement", name: "Retirement", component: <RetirementCalculator /> },
    ],
  },
  {
    name: "Health",
    items: [
      { id: "bmi", name: "BMI", component: <BMICalculator /> },
      { id: "calorie", name: "Calorie", component: <CalorieCalculator /> },
      { id: "pregnancy", name: "Pregnancy", component: <PregnancyCalculator /> },
      { id: "ovulation", name: "Ovulation", component: <OvulationCalculator /> },
    ],
  },
  {
    name: "Conversion",
    items: [
      { id: "currency", name: "Currency", component: <CurrencyConverter /> },
      { id: "unit", name: "Unit", component: <UnitConverter /> },
    ],
  },
  {
    name: "Time & Date",
    items: [
      { id: "date", name: "Date", component: <DateCalculator /> },
      { id: "age", name: "Age", component: <AgeCalculator /> },
      { id: "time", name: "Time", component: <TimeCalculator /> },
    ],
  },
  {
    name: "Travel & Fitness",
    items: [
      { id: "pace", name: "Pace", component: <PaceCalculator /> },
      { id: "fuel-economy", name: "Fuel Economy", component: <FuelEconomyCalculator /> },
      { id: "fuel-cost", name: "Fuel Cost", component: <FuelCostCalculator /> },
    ],
  },
  {
    name: "Education",
    items: [{ id: "gpa", name: "GPA", component: <GPACalculator /> }],
  },
]

// Flatten calculator items for search
const allCalculators = calculatorCategories.flatMap((category) => category.items)

export default function Calculator() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCalculator, setActiveCalculator] = useState("standard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  // Filter calculators based on search term
  const filteredCalculators = searchTerm
    ? allCalculators.filter((calc) => calc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : allCalculators

  // Get the active calculator component
  const activeComponent = allCalculators.find((calc) => calc.id === activeCalculator)?.component

  const handleCalculatorSelect = (id: string) => {
    setActiveCalculator(id)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Mobile header with menu toggle */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <h2 className="text-lg font-semibold">
          {allCalculators.find((calc) => calc.id === activeCalculator)?.name} Calculator
        </h2>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "border-r w-full md:w-64 flex-shrink-0 transition-all duration-300 ease-in-out",
          sidebarOpen ? "block" : "hidden md:block",
        )}
      >
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search calculators..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
          {searchTerm ? (
            <div className="p-2">
              <h3 className="px-3 py-2 text-sm font-semibold">Search Results</h3>
              {filteredCalculators.map((calc) => (
                <Button
                  key={calc.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-3 py-2 text-sm font-medium",
                    activeCalculator === calc.id && "bg-gray-100 dark:bg-gray-700",
                  )}
                  onClick={() => handleCalculatorSelect(calc.id)}
                >
                  {calc.name}
                </Button>
              ))}
            </div>
          ) : (
            calculatorCategories.map((category) => (
              <div key={category.name} className="p-2">
                <h3 className="px-3 py-2 text-sm font-semibold">{category.name}</h3>
                {category.items.map((calc) => (
                  <Button
                    key={calc.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start px-3 py-2 text-sm font-medium",
                      activeCalculator === calc.id && "bg-gray-100 dark:bg-gray-700",
                    )}
                    onClick={() => handleCalculatorSelect(calc.id)}
                  >
                    {calc.name}
                    <ChevronRight
                      className={cn(
                        "ml-auto h-4 w-4 opacity-0 transition-opacity",
                        activeCalculator === calc.id && "opacity-100",
                      )}
                    />
                  </Button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6">{activeComponent}</div>
    </div>
  )
}
