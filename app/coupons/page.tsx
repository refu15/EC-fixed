"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Ticket, 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3,
  ArrowLeft,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Target
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// サンプルデータ
const SAMPLE_COUPONS = [
  {
    id: "1",
    code: "WELCOME1000",
    name: "新規顧客限定クーポン",
    description: "初回購入時に1000円OFF",
    discount_type: "fixed",
    discount_value: 1000,
    minimum_order_amount: 3000,
    max_uses: 100,
    used_count: 45,
    is_active: true,
    valid_from: "2024-01-01T00:00:00Z",
    valid_until: "2024-12-31T23:59:59Z",
    usage_rate: 45,
    total_revenue: 180000,
    avg_order_value: 4000
  },
  {
    id: "2",
    code: "FRIEND500",
    name: "友達紹介クーポン",
    description: "紹介者・被紹介者両方に500円OFF",
    discount_type: "fixed",
    discount_value: 500,
    minimum_order_amount: 2000,
    max_uses: 50,
    used_count: 23,
    is_active: true,
    valid_from: "2024-01-15T00:00:00Z",
    valid_until: "2024-06-30T23:59:59Z",
    usage_rate: 46,
    total_revenue: 92000,
    avg_order_value: 4000
  },
  {
    id: "3",
    code: "SUMMER20",
    name: "夏セールクーポン",
    description: "全商品20%OFF",
    discount_type: "percentage",
    discount_value: 20,
    minimum_order_amount: 5000,
    max_uses: 200,
    used_count: 156,
    is_active: true,
    valid_from: "2024-07-01T00:00:00Z",
    valid_until: "2024-08-31T23:59:59Z",
    usage_rate: 78,
    total_revenue: 312000,
    avg_order_value: 2000
  }
]

const SAMPLE_USAGE_HISTORY = [
  {
    id: "1",
    coupon_code: "WELCOME1000",
    customer_name: "田中太郎",
    customer_email: "tanaka@example.com",
    order_id: "ORD-001",
    discount_amount: 1000,
    order_total: 4500,
    used_at: "2024-01-20T14:30:00Z"
  },
  {
    id: "2",
    coupon_code: "FRIEND500",
    customer_name: "佐藤花子",
    customer_email: "sato@example.com",
    order_id: "ORD-002",
    discount_amount: 500,
    order_total: 3500,
    used_at: "2024-01-22T10:15:00Z"
  },
  {
    id: "3",
    coupon_code: "SUMMER20",
    customer_name: "鈴木一郎",
    customer_email: "suzuki@example.com",
    order_id: "ORD-003",
    discount_amount: 800,
    order_total: 4000,
    used_at: "2024-07-15T16:45:00Z"
  }
]

export default function Coupons() {
  const [coupons, setCoupons] = useState(SAMPLE_COUPONS)
  const [usageHistory, setUsageHistory] = useState(SAMPLE_USAGE_HISTORY)
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [stats, setStats] = useState({
    totalCoupons: 8,
    activeCoupons: 6,
    totalUsage: 224,
    totalRevenue: 584000,
    avgUsageRate: 56.3
  })

  const loadCoupons = async () => {
    setLoading(true)
    try {
      // 実際のAPI呼び出しは後で実装
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading coupons:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  const getDiscountTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage':
        return '割引率'
      case 'fixed':
        return '固定額'
      case 'free_shipping':
        return '送料無料'
      default:
        return type
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="default" className="bg-green-100 text-green-800">有効</Badge> :
      <Badge variant="secondary">無効</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">クーポン管理</h1>
            <p className="text-sm text-gray-500">クーポン・特典の管理と効果分析</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadCoupons} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            更新
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新規作成
          </Button>
        </div>
      </header>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総クーポン数</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoupons}</div>
            <p className="text-xs text-muted-foreground">
              有効: {stats.activeCoupons}個
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総利用回数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
            <p className="text-xs text-muted-foreground">
              前月比 +15%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総売上</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              平均利用額 {formatCurrency(Math.round(stats.totalRevenue / stats.totalUsage))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均利用率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgUsageRate}%</div>
            <p className="text-xs text-muted-foreground">
              目標: 60%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">効果分析</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">A+</div>
            <p className="text-xs text-muted-foreground">
              優秀な成績
            </p>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">クーポン一覧</TabsTrigger>
          <TabsTrigger value="usage">利用履歴</TabsTrigger>
          <TabsTrigger value="analytics">効果分析</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>クーポン一覧</CardTitle>
              <CardDescription>
                作成済みのクーポンと特典の管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{coupon.name}</span>
                          <Badge variant="outline">{coupon.code}</Badge>
                          {getStatusBadge(coupon.is_active)}
                        </div>
                        <div className="text-sm text-gray-500">{coupon.description}</div>
                        <div className="text-xs text-gray-400">
                          {formatDate(coupon.valid_from)} 〜 {formatDate(coupon.valid_until)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-medium">
                          {coupon.discount_type === 'percentage' ? 
                            `${coupon.discount_value}%OFF` : 
                            `${formatCurrency(coupon.discount_value)}OFF`
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          最低購入額: {formatCurrency(coupon.minimum_order_amount)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{coupon.used_count}/{coupon.max_uses}</div>
                        <div className="text-sm text-gray-500">
                          利用率: {coupon.usage_rate}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(coupon.total_revenue)}</div>
                        <div className="text-sm text-gray-500">
                          平均: {formatCurrency(coupon.avg_order_value)}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        編集
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>利用履歴</CardTitle>
              <CardDescription>
                クーポンの利用履歴と詳細
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageHistory.map((usage) => (
                  <div key={usage.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{usage.coupon_code}</Badge>
                          <span className="font-medium">{usage.customer_name}</span>
                        </div>
                        <div className="text-sm text-gray-500">{usage.customer_email}</div>
                        <div className="text-xs text-gray-400">注文ID: {usage.order_id}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-medium text-red-600">
                          -{formatCurrency(usage.discount_amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          割引額
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(usage.order_total)}</div>
                        <div className="text-sm text-gray-500">
                          注文総額
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {formatDate(usage.used_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  利用率分析
                </CardTitle>
                <CardDescription>
                  クーポン別の利用率と効果
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">利用率グラフ</p>
                    <p className="text-sm text-gray-400">Recharts で実装予定</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  売上貢献分析
                </CardTitle>
                <CardDescription>
                  クーポンによる売上への貢献度
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">売上貢献グラフ</p>
                    <p className="text-sm text-gray-400">Recharts で実装予定</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 新規作成フォーム（モーダル） */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>新規クーポン作成</CardTitle>
              <CardDescription>
                新しいクーポンまたは特典を作成します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">クーポン名</Label>
                <Input id="name" placeholder="例: 新規顧客限定クーポン" />
              </div>
              <div>
                <Label htmlFor="code">クーポンコード</Label>
                <Input id="code" placeholder="例: WELCOME1000" />
              </div>
              <div>
                <Label htmlFor="description">説明</Label>
                <Input id="description" placeholder="クーポンの詳細説明" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_type">割引タイプ</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">固定額</SelectItem>
                      <SelectItem value="percentage">割引率</SelectItem>
                      <SelectItem value="free_shipping">送料無料</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount_value">割引額/率</Label>
                  <Input id="discount_value" placeholder="1000" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  キャンセル
                </Button>
                <Button>
                  作成
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 