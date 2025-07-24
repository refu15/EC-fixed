"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Mail, Target, Users, BarChart3, Edit, Play, Pause } from "lucide-react"
import Link from "next/link"

export default function Campaigns() {
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
              <h1 className="text-2xl font-bold text-gray-900">マーケティング自動化</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button disabled>
                <Plus className="h-4 w-4 mr-2" />
                新規キャンペーン (今後実装)
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>自動化されたマーケティングキャンペーン</CardTitle>
              <CardDescription>
                顧客セグメントに基づき、パーソナライズされたメッセージを自動配信します。
                <br />
                <strong className="text-blue-600">（この機能は、キャンペーンのサンプル結果を表示し、実際の配信機能は今後実装されます）</strong>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Campaign Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">アクティブキャンペーン</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">（サンプル値）</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総配信数</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,678</div>
                <p className="text-xs text-muted-foreground">（サンプル値）</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均開封率</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.5%</div>
                <p className="text-xs text-muted-foreground">（サンプル値）</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">コンバージョン率</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.8%</div>
                <p className="text-xs text-muted-foreground">（サンプル値）</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">実行中</TabsTrigger>
              <TabsTrigger value="scheduled">予定</TabsTrigger>
              <TabsTrigger value="completed">完了</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  {
                    name: "春のセールキャンペーン",
                    type: "メール",
                    segment: "全顧客",
                    sent: 12847,
                    opened: 3156,
                    clicked: 487,
                    converted: 73,
                  },
                  {
                    name: "新商品紹介キャンペーン",
                    type: "SNS",
                    segment: "20-30代女性",
                    sent: 5432,
                    opened: 1876,
                    clicked: 234,
                    converted: 45,
                  },
                ].map((campaign, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{campaign.name}</CardTitle>
                          <CardDescription className="flex items-center space-x-2">
                            <Badge variant="outline">{campaign.type}</Badge>
                            <span>対象: {campaign.segment}</span>
                          </CardDescription>
                        </div>
                        <Badge variant="default">実行中</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                       <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{campaign.sent.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">配信数</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {((campaign.opened / campaign.sent) * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">開封率</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-4 text-center">※このデータはサンプルです。</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  {
                    name: "3月決算セール",
                    type: "メール + SNS",
                    segment: "全顧客",
                    revenue: 2450000,
                    roi: 485,
                  },
                  {
                    name: "新規会員獲得キャンペーン",
                    type: "広告 + メール",
                    segment: "新規見込み客",
                    revenue: 890000,
                    roi: 234,
                  },
                ].map((campaign, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{campaign.name}</CardTitle>
                          <CardDescription className="flex items-center space-x-2">
                            <Badge variant="outline">{campaign.type}</Badge>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">完了</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">¥{campaign.revenue.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">売上</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{campaign.roi}%</div>
                          <div className="text-xs text-gray-500">ROI</div>
                        </div>
                      </div>
                       <p className="text-xs text-gray-500 mt-4 text-center">※このデータはサンプルです。</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
