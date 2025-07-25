"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, RefreshCw, Crown, User, Building } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getUserUsage, PLAN_LIMITS, type PlanType } from "@/lib/usage-limits"

// デモ用のユーザーID（実際の実装では認証システムから取得）
const DEMO_USER_ID = "demo-user-001"

export default function UsageStatus() {
  const [usage, setUsage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('free')

  useEffect(() => {
    loadUsage()
  }, [selectedPlan])

  async function loadUsage() {
    setLoading(true)
    try {
      const usageData = await getUserUsage(DEMO_USER_ID, selectedPlan)
      setUsage(usageData)
    } catch (error) {
      console.error('Usage load error:', error)
    } finally {
      setLoading(false)
    }
  }

  const planIcons = {
    free: <User className="h-4 w-4" />,
    personal: <Crown className="h-4 w-4" />,
    business: <Building className="h-4 w-4" />
  }

  const planColors = {
    free: "bg-gray-100 text-gray-800",
    personal: "bg-blue-100 text-blue-800",
    business: "bg-purple-100 text-purple-800"
  }

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
              <h1 className="text-2xl font-bold text-gray-900">利用制限状況</h1>
            </div>
            <Button onClick={loadUsage} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              更新
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* プラン選択 */}
          <Card>
            <CardHeader>
              <CardTitle>プラン選択</CardTitle>
              <CardDescription>
                現在のプランと利用制限を確認できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(PLAN_LIMITS).map(([planKey, plan]) => (
                  <div
                    key={planKey}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlan === planKey
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan(planKey as PlanType)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {planIcons[planKey as PlanType]}
                      <span className="font-medium">{plan.name}</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>1日: {plan.daily}回</div>
                      <div>1月: {plan.monthly}回</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 利用状況 */}
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>読み込み中...</span>
                </div>
              </CardContent>
            </Card>
          ) : usage ? (
            <>
              {/* 現在のプラン */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {planIcons[selectedPlan]}
                    <span>{usage.plan.name}</span>
                    <Badge className={planColors[selectedPlan]}>
                      {selectedPlan === 'free' ? '無料' : '有料'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 日次利用状況 */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">本日の利用状況</span>
                        <span className="text-sm text-gray-600">
                          {usage.usage.daily} / {usage.plan.daily} 回
                        </span>
                      </div>
                      <Progress 
                        value={(usage.usage.daily / usage.plan.daily) * 100} 
                        className="h-2"
                      />
                      <div className="text-sm text-gray-600">
                        残り: {usage.remaining.daily} 回
                      </div>
                    </div>

                    {/* 月次利用状況 */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">今月の利用状況</span>
                        <span className="text-sm text-gray-600">
                          {usage.usage.monthly} / {usage.plan.monthly} 回
                        </span>
                      </div>
                      <Progress 
                        value={(usage.usage.monthly / usage.plan.monthly) * 100} 
                        className="h-2"
                      />
                      <div className="text-sm text-gray-600">
                        残り: {usage.remaining.monthly} 回
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 利用可能状況 */}
              <Card>
                <CardHeader>
                  <CardTitle>利用可能状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Badge variant={usage.canUse ? "default" : "destructive"}>
                      {usage.canUse ? "利用可能" : "利用制限中"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {usage.canUse 
                        ? "AI機能を正常にご利用いただけます"
                        : "利用制限に達しました。プランアップグレードをご検討ください"
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* 制限詳細 */}
              <Card>
                <CardHeader>
                  <CardTitle>制限詳細</CardTitle>
                  <CardDescription>
                    各プランの利用制限について
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="font-medium mb-1">フリープラン</div>
                        <div>• 1日5回まで</div>
                        <div>• 1月50回まで</div>
                        <div>• 基本的なAI機能</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded">
                        <div className="font-medium mb-1">パーソナルプラン</div>
                        <div>• 1日100回まで</div>
                        <div>• 1月3000回まで</div>
                        <div>• 高度なAI機能</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded">
                        <div className="font-medium mb-1">ビジネスプラン</div>
                        <div>• 1日500回まで</div>
                        <div>• 1月15000回まで</div>
                        <div>• 全機能利用可能</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <span className="text-gray-500">利用状況の取得に失敗しました</span>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
} 