"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClipboardList, DollarSign, History, ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"
import dayjs from "dayjs"
import { useState } from "react"
import { generateTextWithLimit } from "@/lib/usage-limits" // 変更: 制限付きAPIを使用

import { proposals } from "@/lib/sample-proposals"

// デモ用のユーザーID（実際の実装では認証システムから取得）
const DEMO_USER_ID = "demo-user-001"

export default function Proposals() {
  const avgROI = Math.round(
    proposals.reduce((acc, p) => acc + p.expectedROI, 0) / proposals.length,
  )
  const pending = proposals.filter((p) => p.status === "pending").length
  const [aiComment, setAiComment] = useState<{ [id: string]: string }>({})
  const [loading, setLoading] = useState<{ [id: string]: boolean }>({})
  const [usageInfo, setUsageInfo] = useState<{
    remaining: { daily: number; monthly: number }
    canUse: boolean
    message?: string
  } | null>(null)

  async function handleAiComment(id: string, title: string, description: string) {
    setLoading((prev) => ({ ...prev, [id]: true }))
    setAiComment((prev) => ({ ...prev, [id]: "" }))
    
    try {
      const prompt = `EC施策「${title}」: ${description} の目的・期待効果・実行時の注意点を、経営者向けに200字以内で分かりやすく日本語で解説してください。`
      
      // 制限付きGemini API呼び出し
      const result = await generateTextWithLimit(DEMO_USER_ID, prompt, 'free')
      
      if (result.success) {
        setAiComment((prev) => ({ ...prev, [id]: result.text }))
        setUsageInfo({
          remaining: result.remaining!,
          canUse: true
        })
      } else {
        setAiComment((prev) => ({ ...prev, [id]: result.message || "AI解説の生成に失敗しました。" }))
        setUsageInfo({
          remaining: { daily: 0, monthly: 0 },
          canUse: false,
          message: result.message
        })
      }
    } catch (e) {
      setAiComment((prev) => ({ ...prev, [id]: "AI解説の生成に失敗しました。" }))
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }))
    }
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
                  <ArrowLeft className="h-4 w-4 mr-2" /> 戻る
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">施策提案</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/usage-status">
                <Button variant="outline" size="sm">
                  利用制限確認
                </Button>
              </Link>
              <p className="text-sm text-gray-500">（コスト削減版）</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          {/* 利用制限アラート */}
          {usageInfo && !usageInfo.canUse && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {usageInfo.message || "利用制限に達しました"}
                <Link href="/usage-status" className="ml-2 underline">
                  利用制限を確認
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* 利用状況表示 */}
          {usageInfo && usageInfo.canUse && (
            <Alert>
              <AlertDescription>
                残り利用回数: 本日 {usageInfo.remaining.daily}回 / 今月 {usageInfo.remaining.monthly}回
              </AlertDescription>
            </Alert>
          )}

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
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>
                      作成日: {dayjs(p.createdAt).format("YYYY/MM/DD")}
                    </span>
                    <span className="font-medium text-green-600">
                      期待ROI: {p.expectedROI}%
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-fit"
                    disabled={loading[p.id] || (usageInfo && !usageInfo.canUse)}
                    onClick={() => handleAiComment(p.id, p.title, p.description)}
                  >
                    {loading[p.id] ? "AI解説生成中..." : "AI解説を表示"}
                  </Button>
                  {aiComment[p.id] && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-gray-800 text-xs whitespace-pre-line">
                      {aiComment[p.id]}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
