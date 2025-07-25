"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target,
  ArrowLeft,
  RefreshCw,
  Download,
  Filter,
  PieChart,
  LineChart,
  Award,
  Lightbulb,
  Settings,
  Eye,
  EyeOff
} from "lucide-react"
import Link from "next/link"
import { 
  DEFAULT_SEGMENTS, 
  compareSegments, 
  generateSegmentRecommendations,
  calculateSegmentPriority,
  type Segment,
  type SegmentComparison
} from "@/lib/segments"

export default function Segments() {
  const [segments, setSegments] = useState<Segment[]>(DEFAULT_SEGMENTS)
  const [selectedSegment1, setSelectedSegment1] = useState<string>('line-referrals')
  const [selectedSegment2, setSelectedSegment2] = useState<string>('instagram-referrals')
  const [comparison, setComparison] = useState<SegmentComparison | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showRecommendations, setShowRecommendations] = useState(true)

  // セグメント比較の実行
  const runComparison = () => {
    const segment1 = segments.find(s => s.id === selectedSegment1)
    const segment2 = segments.find(s => s.id === selectedSegment2)
    
    if (segment1 && segment2) {
      const comparisonResult = compareSegments(segment1, segment2)
      setComparison(comparisonResult)
    }
  }

  useEffect(() => {
    runComparison()
  }, [selectedSegment1, selectedSegment2])

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const getChangeIcon = (value: number) => {
    return value >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600"
  }

  const getSegmentTypeColor = (type: string) => {
    switch (type) {
      case 'channel':
        return 'bg-blue-100 text-blue-800'
      case 'ltv':
        return 'bg-purple-100 text-purple-800'
      case 'customer_type':
        return 'bg-green-100 text-green-800'
      case 'campaign':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSegmentTypeLabel = (type: string) => {
    switch (type) {
      case 'channel':
        return 'チャネル'
      case 'ltv':
        return 'LTV'
      case 'customer_type':
        return '顧客タイプ'
      case 'campaign':
        return 'キャンペーン'
      default:
        return 'その他'
    }
  }

  // 優先度順にソート
  const sortedSegments = [...segments].sort((a, b) => 
    calculateSegmentPriority(b) - calculateSegmentPriority(a)
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ダッシュボード
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">セグメント分析</h1>
            <p className="text-gray-500">チャネル別・顧客タイプ別のパフォーマンス比較</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            更新
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </header>

      {/* セグメント比較セクション */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            セグメント比較分析
          </CardTitle>
          <CardDescription>
            2つのセグメントを選択してパフォーマンスを比較します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">セグメント1</label>
              <Select value={selectedSegment1} onValueChange={setSelectedSegment1}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">セグメント2</label>
              <Select value={selectedSegment2} onValueChange={setSelectedSegment2}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {comparison && (
            <div className="space-y-6">
              {/* 比較結果 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(comparison.differences.revenue)}
                      </div>
                      <div className="text-sm text-gray-500">売上差</div>
                      <div className="flex items-center justify-center mt-1">
                        {getChangeIcon(comparison.differences.revenue)}
                        <span className={`text-xs ml-1 ${getChangeColor(comparison.differences.revenue)}`}>
                          {comparison.differences.revenue > 0 ? 'セグメント1有利' : 'セグメント2有利'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {comparison.differences.conversionRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">CVR差</div>
                      <div className="flex items-center justify-center mt-1">
                        {getChangeIcon(comparison.differences.conversionRate)}
                        <span className={`text-xs ml-1 ${getChangeColor(comparison.differences.conversionRate)}`}>
                          {comparison.differences.conversionRate > 0 ? 'セグメント1有利' : 'セグメント2有利'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(comparison.differences.aov)}
                      </div>
                      <div className="text-sm text-gray-500">AOV差</div>
                      <div className="flex items-center justify-center mt-1">
                        {getChangeIcon(comparison.differences.aov)}
                        <span className={`text-xs ml-1 ${getChangeColor(comparison.differences.aov)}`}>
                          {comparison.differences.aov > 0 ? 'セグメント1有利' : 'セグメント2有利'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {comparison.differences.roi.toFixed(1)}倍
                      </div>
                      <div className="text-sm text-gray-500">ROI差</div>
                      <div className="flex items-center justify-center mt-1">
                        {getChangeIcon(comparison.differences.roi)}
                        <span className={`text-xs ml-1 ${getChangeColor(comparison.differences.roi)}`}>
                          {comparison.differences.roi > 0 ? 'セグメント1有利' : 'セグメント2有利'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* インサイト */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                    分析インサイト
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {comparison.insights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* セグメント一覧 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="detailed">詳細分析</TabsTrigger>
          <TabsTrigger value="recommendations">推奨施策</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSegments.map((segment) => (
              <Card key={segment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{segment.name}</CardTitle>
                    <Badge className={getSegmentTypeColor(segment.type)}>
                      {getSegmentTypeLabel(segment.type)}
                    </Badge>
                  </div>
                  <CardDescription>{segment.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{segment.metrics.totalCustomers}</div>
                      <div className="text-gray-500">顧客数</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(segment.metrics.totalRevenue)}</div>
                      <div className="text-gray-500">売上</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CVR</span>
                      <span className="font-medium">{segment.metrics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={segment.metrics.conversionRate * 10} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ROI</span>
                      <span className="font-medium">{segment.metrics.roi.toFixed(1)}倍</span>
                    </div>
                    <Progress value={Math.min(segment.metrics.roi * 5, 100)} className="h-2" />
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-800">優先度スコア</div>
                    <div className="text-lg font-bold text-blue-600">
                      {(calculateSegmentPriority(segment) * 100).toFixed(0)}/100
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 売上比較チャート */}
            <Card>
              <CardHeader>
                <CardTitle>売上比較</CardTitle>
                <CardDescription>セグメント別の売上貢献</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">売上比較チャート</p>
                    <p className="text-sm text-gray-400">Recharts で実装予定</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CVR比較チャート */}
            <Card>
              <CardHeader>
                <CardTitle>CVR比較</CardTitle>
                <CardDescription>セグメント別のコンバージョン率</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">CVR比較チャート</p>
                    <p className="text-sm text-gray-400">Recharts で実装予定</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ROI比較チャート */}
            <Card>
              <CardHeader>
                <CardTitle>ROI比較</CardTitle>
                <CardDescription>セグメント別の投資対効果</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">ROI比較チャート</p>
                    <p className="text-sm text-gray-400">Recharts で実装予定</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 成長率比較チャート */}
            <Card>
              <CardHeader>
                <CardTitle>成長率比較</CardTitle>
                <CardDescription>セグメント別の成長トレンド</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">成長率比較チャート</p>
                    <p className="text-sm text-gray-400">Recharts で実装予定</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">セグメント別推奨施策</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowRecommendations(!showRecommendations)}
            >
              {showRecommendations ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showRecommendations ? '非表示' : '表示'}
            </Button>
          </div>

          {showRecommendations && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {segments.map((segment) => {
                const recommendations = generateSegmentRecommendations(segment)
                return (
                  <Card key={segment.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2 text-blue-600" />
                        {segment.name}
                      </CardTitle>
                      <CardDescription>{segment.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recommendations.length > 0 ? (
                        <div className="space-y-2">
                          {recommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-gray-700">{recommendation}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Award className="h-8 w-8 mx-auto text-green-600 mb-2" />
                          <p className="text-sm text-gray-500">現在のパフォーマンスは良好です</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 