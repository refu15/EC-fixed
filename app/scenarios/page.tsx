"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ArrowLeft, ClipboardList } from "lucide-react"
import Link from "next/link"

import { scenarios } from "@/lib/sample-scenarios"

export default function Scenarios() {
  const totalRevenue = scenarios.reduce((acc, s) => acc + s.expectedRevenue, 0)
  const avgROI = Math.round(
    scenarios.reduce((acc, s) => acc + s.expectedROI, 0) / scenarios.length,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" /> 戻る
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">AIシナリオ分析・予測</h1>
            </div>
            <p className="text-sm text-gray-500">（MVP デモ）</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          {/* KPI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">想定総売上</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">シナリオ合計</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均ROI</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgROI}%</div>
                <p className="text-xs text-muted-foreground">シナリオ平均</p>
              </CardContent>
            </Card>
          </div>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {scenarios.map((s) => (
              <Card key={s.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{s.title}</span>
                    <Badge variant="outline">信頼度 {s.confidence}%</Badge>
                  </CardTitle>
                  <CardDescription>{s.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>想定売上</span>
                    <span className="font-medium">¥{s.expectedRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>想定コスト</span>
                    <span className="font-medium">¥{s.expectedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>期待ROI</span>
                    <span className="font-medium text-green-600">{s.expectedROI}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
