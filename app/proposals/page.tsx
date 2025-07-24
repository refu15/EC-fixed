"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, DollarSign, History, ArrowLeft } from "lucide-react"
import Link from "next/link"
import dayjs from "dayjs"

import { proposals } from "@/lib/sample-proposals"

export default function Proposals() {
  const avgROI = Math.round(
    proposals.reduce((acc, p) => acc + p.expectedROI, 0) / proposals.length,
  )
  const pending = proposals.filter((p) => p.status === "pending").length

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
              <h1 className="text-2xl font-bold text-gray-900">施策提案</h1>
            </div>
            <p className="text-sm text-gray-500">（MVP デモ）</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          {/* KPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均期待ROI</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgROI}%</div>
                <p className="text-xs text-muted-foreground">全提案の平均</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">未承認提案数</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pending}</div>
                <p className="text-xs text-muted-foreground">ステータス: pending</p>
              </CardContent>
            </Card>
          </div>

          {/* Proposal List */}
          <div className="space-y-4">
            {proposals.map((p) => (
              <Card key={p.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{p.title}</CardTitle>
                    <CardDescription>{p.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      p.status === "executed"
                        ? "default"
                        : p.status === "approved"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {p.status}
                  </Badge>
                </CardHeader>
                <CardContent className="flex justify-between text-sm">
                  <span>
                    作成日: {dayjs(p.createdAt).format("YYYY/MM/DD")}
                  </span>
                  <span className="font-medium text-green-600">
                    期待ROI: {p.expectedROI}%
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
