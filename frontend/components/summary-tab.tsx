"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface SummaryTabProps {
  hasFiles: boolean
}

// Mock data for demonstration
const mockData = {
  totalQuestions: 50,
  correctAnswers: 42,
  incorrectAnswers: 6,
  unanswered: 2,
  score: 84,
  timeSpent: "45 minutes",
  difficulty: "Medium",
  subject: "Mathematics",
  grade: "A",
}

export function SummaryTab({ hasFiles }: SummaryTabProps) {
  if (!hasFiles) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-medium text-foreground mb-1">Upload Required Files</h3>
          <p className="text-sm text-muted-foreground">Upload both OMR sheet and answer key to view summary</p>
        </div>
      </div>
    )
  }

  const scorePercentage = (mockData.correctAnswers / mockData.totalQuestions) * 100

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Overall Score</CardTitle>
            <TrendingUp className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-xl font-semibold text-foreground">{mockData.score}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Grade:{" "}
              <Badge variant="secondary" className="ml-1 text-xs">
                {mockData.grade}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Correct</CardTitle>
            <CheckCircle className="h-3 w-3 text-green-600" />
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-xl font-semibold text-green-600">{mockData.correctAnswers}</div>
            <p className="text-xs text-muted-foreground">of {mockData.totalQuestions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Incorrect</CardTitle>
            <XCircle className="h-3 w-3 text-red-600" />
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-xl font-semibold text-red-600">{mockData.incorrectAnswers}</div>
            <p className="text-xs text-muted-foreground">
              {((mockData.incorrectAnswers / mockData.totalQuestions) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Time</CardTitle>
            <Clock className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-xl font-semibold">{mockData.timeSpent}</div>
            <p className="text-xs text-muted-foreground">{Math.round(45 / mockData.totalQuestions)} min/q</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Performance</CardTitle>
            <CardDescription className="text-xs">Detailed breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Correct</span>
                <span className="font-medium">
                  {mockData.correctAnswers}/{mockData.totalQuestions}
                </span>
              </div>
              <Progress value={scorePercentage} className="h-1.5" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Incorrect</span>
                <span className="font-medium">
                  {mockData.incorrectAnswers}/{mockData.totalQuestions}
                </span>
              </div>
              <Progress value={(mockData.incorrectAnswers / mockData.totalQuestions) * 100} className="h-1.5" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Unanswered</span>
                <span className="font-medium">
                  {mockData.unanswered}/{mockData.totalQuestions}
                </span>
              </div>
              <Progress value={(mockData.unanswered / mockData.totalQuestions) * 100} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Details</CardTitle>
            <CardDescription className="text-xs">Exam information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Subject</p>
                <p className="text-sm font-medium">{mockData.subject}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Difficulty</p>
                <Badge variant="outline" className="text-xs">
                  {mockData.difficulty}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Questions</p>
                <p className="text-sm font-medium">{mockData.totalQuestions}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Grade</p>
                <Badge variant="default" className="text-sm px-2 py-0.5">
                  {mockData.grade}
                </Badge>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                {mockData.score >= 80 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className="text-xs">{mockData.score >= 80 ? "Excellent!" : "Needs improvement"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
