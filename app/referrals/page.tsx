"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Share2, 
  TrendingUp, 
  Award, 
  Network, 
  BarChart3,
  ArrowLeft,
  RefreshCw,
  Download,
  Filter
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// サンプルデータ
const SAMPLE_REFERRALS = [
  {
    id: "1",
    referrer: { name: "田中太郎", email: "tanaka@example.com" },
    referred: { name: "佐藤花子", email: "sato@example.com" },
    status: "completed",
    reward_amount: 1000,
    created_at: "2024-01-15T10:30:00Z",
    completed_at: "2024-01-20T14:20:00Z"
  },
  {
    id: "2",
    referrer: { name: "田中太郎", email: "tanaka@example.com" },
    referred: { name: "鈴木一郎", email: "suzuki@example.com" },
    status: "pending",
    reward_amount: 1000,
    created_at: "2024-01-18T09:15:00Z",
    completed_at: null
  },
  {
    id: "3",
    referrer: { name: "佐藤花子", email: "sato@example.com" },
    referred: { name: "高橋美咲", email: "takahashi@example.com" },
    status: "completed",
    reward_amount: 1000,
    created_at: "2024-01-22T16:45:00Z",
    completed_at: "2024-01-25T11:30:00Z"
  }
]

const SAMPLE_TOP_REFERRERS = [
  { name: "田中太郎", email: "tanaka@example.com", referrals: 5, total_reward: 5000 },
  { name: "佐藤花子", email: "sato@example.com", referrals: 3, total_reward: 3000 },
  { name: "鈴木一郎", email: "suzuki@example.com", referrals: 2, total_reward: 2000 },
  { name: "高橋美咲", email: "takahashi@example.com", referrals: 1, total_reward: 1000 }
]

const SAMPLE_NETWORK_DATA = {
  nodes: [
    { id: "田中太郎", group: 1, referrals: 5 },
    { id: "佐藤花子", group: 2, referrals: 3 },
    { id: "鈴木一郎", group: 2, referrals: 2 },
    { id: "高橋美咲", group: 3, referrals: 1 },
    { id: "山田次郎", group: 3, referrals: 0 }
  ],
  links: [
    { source: "田中太郎", target: "佐藤花子", value: 1 },
    { source: "田中太郎", target: "鈴木一郎", value: 1 },
    { source: "佐藤花子", target: "高橋美咲", value: 1 },
    { source: "高橋美咲", target: "山田次郎", value: 1 }
  ]
}

export default function Referrals() {
  const [referrals, setReferrals] = useState(SAMPLE_REFERRALS)
  const [topReferrers, setTopReferrers] = useState(SAMPLE_TOP_REFERRERS)
  const [networkData, setNetworkData] = useState(SAMPLE_NETWORK_DATA)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalReferrals: 11,
    completedReferrals: 8,
    pendingReferrals: 3,
    totalRewards: 11000,
    avgReferralsPerUser: 2.2
  })

  const loadReferrals = async () => {
    setLoading(true)
    try {
      // 実際のAPI呼び出しは後で実装
      // const { data, error } = await supabase
      //   .from('referrals')
      //   .select('*')
      //   .order('created_at', { ascending: false })
      
      // 現在はサンプルデータを使用
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading referrals:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReferrals()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">完了</Badge>
      case 'pending':
        return <Badge variant="secondary">待機中</Badge>
      case 'expired':
        return <Badge variant="destructive">期限切れ</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ja-JP')
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
            <h1 className="text-2xl font-bold">紹介ネットワーク</h1>
            <p className="text-sm text-gray-500">友達紹介の可視化と管理</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadReferrals} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            更新
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </header>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総紹介数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              前月比 +12%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完了済み</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedReferrals}</div>
            <p className="text-xs text-muted-foreground">
              完了率 {Math.round((stats.completedReferrals / stats.totalReferrals) * 100)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待機中</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReferrals}</div>
            <p className="text-xs text-muted-foreground">
              アクション待ち
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総報酬</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{stats.totalRewards.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              平均 ¥{Math.round(stats.totalRewards / stats.completedReferrals).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均紹介数</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgReferralsPerUser}</div>
            <p className="text-xs text-muted-foreground">
              ユーザーあたり
            </p>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <Tabs defaultValue="network" className="space-y-4">
        <TabsList>
          <TabsTrigger value="network">ネットワーク可視化</TabsTrigger>
          <TabsTrigger value="history">紹介履歴</TabsTrigger>
          <TabsTrigger value="ranking">ランキング</TabsTrigger>
        </TabsList>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="h-5 w-5 mr-2" />
                紹介ネットワーク
              </CardTitle>
              <CardDescription>
                誰が誰を紹介したかの関係性を可視化しています
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Network className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">ネットワークグラフ</p>
                  <p className="text-sm text-gray-400">D3.js または Recharts で実装予定</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>紹介履歴</CardTitle>
              <CardDescription>
                すべての紹介履歴を時系列で表示
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{referral.referrer.name}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium">{referral.referred.name}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {referral.referrer.email} → {referral.referred.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(referral.status)}
                      <div className="text-right">
                        <div className="font-medium">¥{referral.reward_amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(referral.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>トップ紹介者ランキング</CardTitle>
              <CardDescription>
                最も多くの紹介を行ったユーザー
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topReferrers.map((referrer, index) => (
                  <div key={referrer.email} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{referrer.name}</div>
                        <div className="text-sm text-gray-500">{referrer.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{referrer.referrals}件の紹介</div>
                      <div className="text-sm text-gray-500">
                        総報酬 ¥{referrer.total_reward.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 