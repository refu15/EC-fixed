"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  MessageCircle,
  Target,
  ArrowUpRight,
  DollarSign,
  Brain,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">EC Growth Hub</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/customers">
                <Button variant="outline">顧客分析</Button>
              </Link>
              <Link href="/campaigns">
                <Button variant="outline">マーケ自動化</Button>
              </Link>
              <Link href="/recommendations">
                <Button variant="outline">レコメンド</Button>
              </Link>
              <Link href="/scenarios">
                <Button variant="outline">シナリオ分析</Button>
              </Link>
              <Link href="/proposals">
                <Button variant="outline">施策提案</Button>
              </Link>
              <Button variant="outline" disabled>設定</Button>
              <Button variant="outline" disabled>アカウント</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">メインダッシュボード</h2>
            <p className="text-gray-600">主要なKPIとAIによるワンポイント解説</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">売上</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥2,450,000</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  +12.5% (前月比)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">新規顧客</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+234人</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  +8.2% (前月比)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">コンバージョン率</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.24%</div>
                <p className="text-xs text-muted-foreground">
                  -0.3% (前月比)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均注文額</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥8,750</div>
                <p className="text-xs text-muted-foreground">
                  +5.1% (前月比)
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-indigo-600" />
                  AIによるワンポイント解説
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  売上と新規顧客数が順調に増加しており、特にSNS経由の流入が貢献しているようです。一方で、コンバージョン率がわずかに低下しています。
                  カートから決済への導線に課題がないか、一度確認してみることをお勧めします。
                </p>
                 <p className="text-xs text-gray-500 mt-4">
                  ※この解説はAIが生成したサンプルです。
                </p>
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}
