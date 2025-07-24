"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import React from "react"
import { ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Link from "next/link"
import { customerKpis, ageDistribution, regionDistribution } from "@/lib/sample-customers"
import { Users, DollarSign, Target, ShoppingCart, ArrowLeft } from "lucide-react"

const COLORS = [
  "#6366f1", // indigo-500
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#a855f7", // violet-500
]

export default function CustomerAnalytics() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  戻る
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">顧客分析ダッシュボード</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <KpiCard title="顧客総数" icon={<Users className="h-4 w-4 text-muted-foreground" />} value={`${customerKpis.totalCustomers.toLocaleString()}人`} />
            <KpiCard title="売上総額" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} value={`¥${customerKpis.totalRevenue.toLocaleString()}`} />
            <KpiCard title="CVR" icon={<Target className="h-4 w-4 text-muted-foreground" />} value={`${customerKpis.conversionRate}%`} />
            <KpiCard title="平均注文額" icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} value={`¥${customerKpis.averageOrderValue.toLocaleString()}`} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Age Distribution Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>年齢層分布</CardTitle>
                <CardDescription>主要顧客の年齢レンジ別構成比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="#6366f1">
                        {ageDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Region Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>地域分布</CardTitle>
                <CardDescription>上位 3 都道府県 + その他</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip content={<ChartTooltipContent />} />
                      <Pie data={regionDistribution} dataKey="value" nameKey="region" cx="50%" cy="50%" outerRadius={110} label>
                        {regionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartLegendContent />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function KpiCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
