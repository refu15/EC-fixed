"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import React from "react"
import { ArrowLeft, Star, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { recommendations } from "@/lib/sample-recommendations"

export default function Recommendations() {
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
              <h1 className="text-2xl font-bold text-gray-900">商品レコメンデーション</h1>
            </div>
             <div className="flex items-center space-x-4">
               <p className="text-sm text-gray-500">（β版：一部機能は今後実装予定）</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>AIによるパーソナライズされた商品レコメンデーション</CardTitle>
              <CardDescription>
                AIが顧客の行動データ（閲覧履歴、購買履歴など）を基に、好みに合わせた商品を提案します。
                <br />
                <strong className="text-blue-600">（この機能は、Gemini APIを利用してレコメンデーションのサンプルを提示します）</strong>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">クリック率 (CTR)</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15.8%</div>
                <p className="text-xs text-muted-foreground">（サンプル値）</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">売上貢献</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{recommendations.reduce((acc,r)=>acc+r.revenueContribution,0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">（サンプル値）</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">レコメンデーション精度</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">92.3%</div>
                <p className="text-xs text-muted-foreground">（サンプル値）</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{rec.title}</span>
                    <Badge variant="outline">売上貢献 ¥{rec.revenueContribution.toLocaleString()}</Badge>
                  </CardTitle>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium mb-2">クロスセルにおすすめ:</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {rec.crossSell.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
            <hr className="my-8"/>
            <Card>
              <CardHeader>
                <CardTitle>「あなたへのおすすめ」の例</CardTitle>
                <CardDescription>顧客の閲覧履歴や購買傾向に基づいたパーソナライズ提案です。</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "ワイヤレスイヤホン Pro", price: "¥24,800", image: "/placeholder.svg?height=150&width=150" },
                  { name: "スマートウォッチ Series 5", price: "¥45,800", image: "/placeholder.svg?height=150&width=150" },
                  { name: "高機能バックパック", price: "¥12,800", image: "/placeholder.svg?height=150&width=150" },
                  { name: "電動コーヒーミル", price: "¥8,980", image: "/placeholder.svg?height=150&width=150" },
                ].map((product, index) => (
                  <div key={index} className="border rounded-lg p-4 text-center">
                    <Image src={product.image} alt={product.name} width={150} height={150} className="rounded-lg mx-auto mb-4" />
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-gray-600">{product.price}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>「この商品と一緒に購入されています」の例</CardTitle>
                <CardDescription>特定の商品と同時によく購入される商品のクロスセル提案です。</CardDescription>
              </CardHeader>
               <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "スマートフォンケース", price: "¥3,480", image: "/placeholder.svg?height=150&width=150" },
                  { name: "画面保護フィルム", price: "¥1,980", image: "/placeholder.svg?height=150&width=150" },
                  { name: "ワイヤレス充電器", price: "¥4,980", image: "/placeholder.svg?height=150&width=150" },
                  { name: "モバイルバッテリー", price: "¥5,980", image: "/placeholder.svg?height=150&width=150" },
                ].map((product, index) => (
                  <div key={index} className="border rounded-lg p-4 text-center">
                    <Image src={product.image} alt={product.name} width={150} height={150} className="rounded-lg mx-auto mb-4" />
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-gray-600">{product.price}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">※表示されている商品はサンプルです。</p>
        </div>
      </main>
    </div>
  )
}
