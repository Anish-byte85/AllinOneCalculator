"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2 } from "lucide-react"

type Course = {
  id: string
  name: string
  grade: string
  credits: string
}

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Course 1", grade: "A", credits: "3" },
    { id: "2", name: "Course 2", grade: "B+", credits: "4" },
  ])
  const [result, setResult] = useState<{
    gpa: number
    totalCredits: number
    totalGradePoints: number
  } | null>(null)

  const gradePoints: Record<string, number> = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D-": 0.7,
    F: 0.0,
  }

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: Date.now().toString(),
        name: `Course ${courses.length + 1}`,
        grade: "A",
        credits: "3",
      },
    ])
  }

  const removeCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id))
  }

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(courses.map((course) => (course.id === id ? { ...course, [field]: value } : course)))
  }

  const calculateGPA = () => {
    let totalCredits = 0
    let totalGradePoints = 0

    for (const course of courses) {
      const credits = Number.parseFloat(course.credits)
      if (isNaN(credits) || credits <= 0) continue

      const gradePoint = gradePoints[course.grade] || 0
      totalCredits += credits
      totalGradePoints += credits * gradePoint
    }

    if (totalCredits === 0) {
      setResult(null)
      return
    }

    const gpa = totalGradePoints / totalCredits

    setResult({
      gpa,
      totalCredits,
      totalGradePoints,
    })
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">GPA Calculator</h2>

      <div className="space-y-4">
        <div className="border rounded-md p-4">
          <div className="grid grid-cols-12 gap-2 mb-2 font-medium">
            <div className="col-span-5">Course Name</div>
            <div className="col-span-3">Grade</div>
            <div className="col-span-3">Credits</div>
            <div className="col-span-1"></div>
          </div>

          {courses.map((course) => (
            <div key={course.id} className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-5">
                <Input
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  placeholder="Course name"
                />
              </div>
              <div className="col-span-3">
                <Select value={course.grade} onValueChange={(value) => updateCourse(course.id, "grade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(gradePoints).map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade} ({gradePoints[grade].toFixed(1)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                  placeholder="Credits"
                  min="0"
                  step="0.5"
                />
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full mt-2" onClick={addCourse}>
            <PlusCircle className="h-4 w-4 mr-2" /> Add Course
          </Button>
        </div>

        <Button onClick={calculateGPA} className="w-full">
          Calculate GPA
        </Button>

        {result && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Your GPA</p>
              <p className="text-3xl font-bold">{result.gpa.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Credits</p>
                <p className="text-xl font-bold">{result.totalCredits}</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Grade Points</p>
                <p className="text-xl font-bold">{result.totalGradePoints.toFixed(1)}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    result.gpa >= 3.7
                      ? "bg-green-500"
                      : result.gpa >= 3.0
                        ? "bg-green-400"
                        : result.gpa >= 2.0
                          ? "bg-yellow-400"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${(result.gpa / 4) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>0.0</span>
                <span>1.0</span>
                <span>2.0</span>
                <span>3.0</span>
                <span>4.0</span>
              </div>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">GPA Scale</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>A, A+: 4.0</div>
                <div>C+: 2.3</div>
                <div>A-: 3.7</div>
                <div>C: 2.0</div>
                <div>B+: 3.3</div>
                <div>C-: 1.7</div>
                <div>B: 3.0</div>
                <div>D+: 1.3</div>
                <div>B-: 2.7</div>
                <div>D, D-: 1.0, 0.7</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
