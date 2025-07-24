"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, Calendar, Zap, CheckCircle, BarChart3, AlertTriangle, Target } from "lucide-react"
import Link from "next/link"

export default function Prediction() {
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
              <h1 className="text-2xl font-bold text-gray-900">AI売上予測</h1>
            </div>
             <div className="flex items-center space-x-4">
               <p className="text-sm text-gray-500">（β版：一部機能は今後実装予定）</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Prediction Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  来月の売上予測
                </CardTitle>
                <CardDescription>
                  AIが過去のデータや市場トレンドを分析して、将来の売上を予測します。
                  <br />
                  <strong className="text-blue-600">（この機能は、Gemini APIを利用して売上予測のサンプルと解説を提示します）</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">¥2,890,000</div>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      前月比 +18.2%
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-blue-500" />
                      信頼度 85%
                    </span>
                  </div>
                   <p className="text-xs text-gray-500 mt-2">（サンプル値）</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">予測範囲</span>
                    <span className="text-sm text-gray-600">¥2,450,000 〜 ¥3,330,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">最終更新</span>
                    <span className="text-sm text-gray-600">2024年7月23日</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>予測の根拠</CardTitle>
                 <CardDescription>AIが予測に使用した主な要因</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-blue-500"/>
                    <span className="text-sm">過去の売上トレンド</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500"/>
                    <span className="text-sm">季節性・イベント要因</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-blue-500"/>
                    <span className="text-sm">最近のマーケティング効果</span>
                  </div>
                   <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500"/>
                    <span className="text-sm">競合の動向（リスク要因）</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">※この内容はサンプルです。</p>
              </CardContent>
            </Card>
          </div>

          <Card>
             <CardHeader>
                <CardTitle>AIによる解説と推奨アクション</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-800">
                    来月は、季節的な需要の高まりと、最近実施したSNSキャンペーンの効果により、売上が<span className="font-bold">約18%増加</span>すると予測されます。
                    特に、主力商品である「ワイヤレスイヤホン」の売上が伸びを牽引するでしょう。
                    <br/><br/>
                    <span className="font-bold">推奨アクション：</span>
                    この勢いを活かすため、関連商品（スマホケース、充電器など）のクロスセルを強化することをお勧めします。
                    また、在庫レベルを確認し、機会損失を防ぐ準備をしてください。
                </p>
                <p className="text-xs text-gray-500 mt-4">※この文章はGemini APIによって生成されたサンプルです。</p>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
