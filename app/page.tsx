"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Percent,
  Network,
  Ticket,
  Share2,
  Target,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  BarChart3,
  TrendingUp as TrendingUpIcon,
  AlertTriangle,
  X,
  HelpCircle,
  FileText,
  ExternalLink,
  Settings,
  BookOpen
} from "lucide-react"
import Link from "next/link"
import { generateTextWithLimit } from "@/lib/usage-limits"
import { 
  generateAllAlerts, 
  deduplicateAlerts, 
  filterExpiredAlerts,
  type Alert,
  type KPIMetrics,
  type CouponMetrics,
  type ReferralMetrics
} from "@/lib/alerts"
import { 
  getSampleReportsByCategory, 
  getLatestSampleReport, 
  getErrorType, 
  ERROR_ACTIONS, 
  HELP_INFO,
  type SampleReport
} from "@/lib/fallback-responses"

const DEMO_USER_ID = "demo-user-001"

// サンプルデータ
const SAMPLE_KPIS = {
  sales: {
    current: 2840000,
    previous: 2520000,
    change: 12.7
  },
  newCustomers: {
    current: 156,
    previous: 142,
    change: 9.9
  },
  conversionRate: {
    current: 3.2,
    previous: 2.8,
    change: 14.3
  },
  averageOrderValue: {
    current: 18200,
    previous: 17700,
    change: 2.8
  }
}

const SAMPLE_REFERRAL_STATS = {
  totalReferrals: 23,
  completedReferrals: 18,
  pendingReferrals: 5,
  totalRewards: 23000,
  avgReferralsPerUser: 2.1,
  // ROI情報を追加
  roi: {
    totalRevenue: 456000,
    totalCost: 23000,
    roiRatio: 19.8,
    revenuePerReferral: 19826
  }
}

const SAMPLE_COUPON_STATS = {
  activeCoupons: 4,
  totalUsage: 89,
  totalRevenue: 356000,
  avgUsageRate: 62.3,
  // ROI情報を追加
  roi: {
    totalRevenue: 356000,
    totalDiscount: 89000,
    netRevenue: 267000,
    roiRatio: 3.0,
    revenuePerUsage: 4000
  }
}

const SAMPLE_SNS_STATS = {
  todayShares: 24,
  monthlyShares: 156,
  avgCTR: 8.5,
  // ROI情報を追加
  roi: {
    totalRevenue: 234000,
    totalCost: 12000,
    roiRatio: 19.5,
    revenuePerShare: 1500
  }
}

// ドリルダウン用の詳細データ
const DRILLDOWN_DATA = {
  referrals: {
    byChannel: [
      { channel: "LINE", referrals: 12, revenue: 240000, roi: 20.5 },
      { channel: "Instagram", referrals: 8, revenue: 160000, roi: 18.2 },
      { channel: "Twitter", referrals: 3, revenue: 56000, roi: 15.8 }
    ],
    byTime: [
      { period: "1週間前", referrals: 5, revenue: 100000 },
      { period: "2週間前", referrals: 8, revenue: 160000 },
      { period: "3週間前", referrals: 10, revenue: 196000 }
    ]
  },
  coupons: {
    byType: [
      { type: "新規顧客限定", usage: 45, revenue: 180000, roi: 3.2 },
      { type: "友達紹介", usage: 23, revenue: 92000, roi: 2.8 },
      { type: "夏セール", usage: 21, revenue: 84000, roi: 3.5 }
    ],
    byPerformance: [
      { coupon: "WELCOME1000", usage: 45, revenue: 180000, roi: 3.2 },
      { coupon: "FRIEND500", usage: 23, revenue: 92000, roi: 2.8 },
      { coupon: "SUMMER20", usage: 21, revenue: 84000, roi: 3.5 }
    ]
  }
}

export default function Dashboard() {
  const [kpis, setKpis] = useState(SAMPLE_KPIS)
  const [referralStats, setReferralStats] = useState(SAMPLE_REFERRAL_STATS)
  const [couponStats, setCouponStats] = useState(SAMPLE_COUPON_STATS)
  const [snsStats, setSnsStats] = useState(SAMPLE_SNS_STATS)
  const [aiComment, setAiComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [usageInfo, setUsageInfo] = useState<{
    remaining: { daily: number; monthly: number }
    canUse: boolean
    message?: string
  } | null>(null)
  const [showDrilldown, setShowDrilldown] = useState<string | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showSampleReport, setShowSampleReport] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [currentSampleReport, setCurrentSampleReport] = useState<SampleReport | null>(null)
  const [errorType, setErrorType] = useState<string | null>(null)

  // 自動アラート生成
  const generateAlerts = () => {
    const kpiMetrics: KPIMetrics = kpis
    const couponMetrics: CouponMetrics = {
      activeCoupons: couponStats.activeCoupons,
      totalUsage: couponStats.totalUsage,
      lowStockCoupons: ['WELCOME1000'], // サンプルデータ
      expiringCoupons: ['SUMMER20'] // サンプルデータ
    }
    const referralMetrics: ReferralMetrics = {
      totalReferrals: referralStats.totalReferrals,
      completedReferrals: referralStats.completedReferrals,
      conversionRate: (referralStats.completedReferrals / referralStats.totalReferrals) * 100,
      avgRewardAmount: referralStats.totalRewards / referralStats.totalReferrals
    }

    const newAlerts = generateAllAlerts(kpiMetrics, couponMetrics, referralMetrics, usageInfo)
    const deduplicatedAlerts = deduplicateAlerts(newAlerts)
    const activeAlerts = filterExpiredAlerts(deduplicatedAlerts)
    
    setAlerts(activeAlerts)
  }

  const loadAiComment = async () => {
    setLoading(true)
    try {
      const prompt = `以下のECサイトのKPIデータを分析し、経営者向けに200字以内で分かりやすく日本語で解説してください。

売上: ¥${kpis.sales.current.toLocaleString()} (前月比${kpis.sales.change > 0 ? '+' : ''}${kpis.sales.change}%)
新規顧客: ${kpis.newCustomers.current}人 (前月比${kpis.newCustomers.change > 0 ? '+' : ''}${kpis.newCustomers.change}%)
CVR: ${kpis.conversionRate.current}% (前月比${kpis.conversionRate.change > 0 ? '+' : ''}${kpis.conversionRate.change}%)
AOV: ¥${kpis.averageOrderValue.current.toLocaleString()} (前月比${kpis.averageOrderValue.change > 0 ? '+' : ''}${kpis.averageOrderValue.change}%)

紹介ネットワーク: ${referralStats.totalReferrals}件の紹介 (完了率${Math.round((referralStats.completedReferrals / referralStats.totalReferrals) * 100)}%)
クーポン利用: ${couponStats.totalUsage}回 (利用率${couponStats.avgUsageRate}%)`

      const result = await generateTextWithLimit(DEMO_USER_ID, prompt, 'free')
      
      if (result.success) {
        setAiComment(result.text)
        setUsageInfo({ remaining: result.remaining!, canUse: true })
        setErrorType(null)
      } else {
        setAiComment("AI解説の生成に失敗しました。")
        setUsageInfo({ remaining: { daily: 0, monthly: 0 }, canUse: false, message: result.message })
        setErrorType(getErrorType(result.message || "AI解析に失敗しました"))
      }
    } catch (error) {
      console.error('Error generating AI comment:', error)
      setAiComment("AI解説の生成中にエラーが発生しました。")
      setErrorType('ai_error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAiComment()
    generateAlerts()
  }, [])

  const getChangeIcon = (change: number) => {
    return change >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'error':
        return <X className="h-4 w-4 text-red-600" />
      case 'info':
        return <HelpCircle className="h-4 w-4 text-blue-600" />
      default:
        return <HelpCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-50 border-orange-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const handleDrilldown = (type: string) => {
    setShowDrilldown(type)
  }

  const handleAlertAction = (alert: Alert) => {
    switch (alert.action) {
      case 'カート放棄メール送信':
        // カート放棄メール送信の処理
        console.log('カート放棄メール送信')
        break
      case 'クーポン追加発行':
        // クーポン追加発行の処理
        console.log('クーポン追加発行')
        break
      case 'プランアップグレード':
        // プランアップグレードの処理
        console.log('プランアップグレード')
        break
      default:
        console.log('アクション実行:', alert.action)
    }
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId))
  }

  const showSampleReportModal = () => {
    setCurrentSampleReport(getLatestSampleReport())
    setShowSampleReport(true)
  }

  const showHelpModal = () => {
    setShowHelp(true)
  }

  const handleErrorAction = (action: string) => {
    switch (action) {
      case 'retry':
        loadAiComment()
        break
      case 'show_sample':
        showSampleReportModal()
        break
      case 'show_help':
        showHelpModal()
        break
      case 'upgrade_plan':
        console.log('プランアップグレード')
        break
      case 'check_usage':
        window.open('/usage-status', '_blank')
        break
      case 'manual_analysis':
        console.log('手動分析')
        break
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EC Growth Hub</h1>
          <p className="text-gray-500">紹介ネットワーク × クーポン管理 × AI施策提案</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/usage-status">
            <Button variant="outline" size="sm">利用制限確認</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={loadAiComment} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            AI解説更新
          </Button>
        </div>
      </header>

      {/* 利用制限アラート */}
      {usageInfo && !usageInfo.canUse && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-red-800">
                <Target className="h-4 w-4" />
                <span>{usageInfo.message || "利用制限に達しました"}</span>
                <Link href="/usage-status" className="underline">利用制限を確認</Link>
              </div>
              <Button size="sm" variant="outline">プランをアップグレード</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 自動アラート */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={getAlertBgColor(alert.type)}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-gray-600">{alert.message}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAlertAction(alert)}
                    >
                      {alert.action}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 主要KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今月売上</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.sales.current)}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getChangeIcon(kpis.sales.change)}
              <span className={getChangeColor(kpis.sales.change)}>
                {kpis.sales.change > 0 ? '+' : ''}{kpis.sales.change}%
              </span>
              <span className="text-muted-foreground">前月比</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">新規顧客</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.newCustomers.current}人</div>
            <div className="flex items-center space-x-1 text-xs">
              {getChangeIcon(kpis.newCustomers.change)}
              <span className={getChangeColor(kpis.newCustomers.change)}>
                {kpis.newCustomers.change > 0 ? '+' : ''}{kpis.newCustomers.change}%
              </span>
              <span className="text-muted-foreground">前月比</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CVR</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.conversionRate.current}%</div>
            <div className="flex items-center space-x-1 text-xs">
              {getChangeIcon(kpis.conversionRate.change)}
              <span className={getChangeColor(kpis.conversionRate.change)}>
                {kpis.conversionRate.change > 0 ? '+' : ''}{kpis.conversionRate.change}%
              </span>
              <span className="text-muted-foreground">前月比</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AOV</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.averageOrderValue.current)}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getChangeIcon(kpis.averageOrderValue.change)}
              <span className={getChangeColor(kpis.averageOrderValue.change)}>
                {kpis.averageOrderValue.change > 0 ? '+' : ''}{kpis.averageOrderValue.change}%
              </span>
              <span className="text-muted-foreground">前月比</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* コア機能カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 紹介ネットワーク */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleDrilldown('referrals')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="h-5 w-5 mr-2 text-blue-600" />
              紹介ネットワーク
            </CardTitle>
            <CardDescription>
              友達紹介の可視化と管理
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold text-blue-600">{referralStats.totalReferrals}</div>
                <div className="text-gray-500">総紹介数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{referralStats.completedReferrals}</div>
                <div className="text-gray-500">完了済み</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                完了率: {Math.round((referralStats.completedReferrals / referralStats.totalReferrals) * 100)}%
              </div>
              <Progress value={Math.round((referralStats.completedReferrals / referralStats.totalReferrals) * 100)} className="h-2" />
            </div>
            {/* ROI情報を追加 */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800">ROI分析</div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div>
                  <div className="text-blue-600 font-medium">{formatCurrency(referralStats.roi.totalRevenue)}</div>
                  <div className="text-gray-500">総売上</div>
                </div>
                <div>
                  <div className="text-green-600 font-medium">{referralStats.roi.roiRatio}倍</div>
                  <div className="text-gray-500">ROI倍率</div>
                </div>
              </div>
            </div>
            <Link href="/referrals">
              <Button className="w-full" variant="outline">
                詳細を見る
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* クーポン管理 */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleDrilldown('coupons')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ticket className="h-5 w-5 mr-2 text-green-600" />
              クーポン管理
            </CardTitle>
            <CardDescription>
              クーポン・特典の管理と効果分析
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold text-green-600">{couponStats.activeCoupons}</div>
                <div className="text-gray-500">有効クーポン</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{couponStats.totalUsage}</div>
                <div className="text-gray-500">利用回数</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                利用率: {couponStats.avgUsageRate}%
              </div>
              <Progress value={couponStats.avgUsageRate} className="h-2" />
            </div>
            {/* ROI情報を追加 */}
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-green-800">ROI分析</div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div>
                  <div className="text-green-600 font-medium">{formatCurrency(couponStats.roi.netRevenue)}</div>
                  <div className="text-gray-500">純売上</div>
                </div>
                <div>
                  <div className="text-green-600 font-medium">{couponStats.roi.roiRatio}倍</div>
                  <div className="text-gray-500">ROI倍率</div>
                </div>
              </div>
            </div>
            <Link href="/coupons">
              <Button className="w-full" variant="outline">
                詳細を見る
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* SNS拡散 */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleDrilldown('sns')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Share2 className="h-5 w-5 mr-2 text-purple-600" />
              SNS拡散
            </CardTitle>
            <CardDescription>
              LINE/SNSワンクリック紹介
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold text-purple-600">{snsStats.todayShares}</div>
                <div className="text-gray-500">今日のシェア</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{snsStats.monthlyShares}</div>
                <div className="text-gray-500">今月のシェア</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              平均CTR: {snsStats.avgCTR}%
            </div>
            {/* ROI情報を追加 */}
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-purple-800">ROI分析</div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div>
                  <div className="text-purple-600 font-medium">{formatCurrency(snsStats.roi.totalRevenue)}</div>
                  <div className="text-gray-500">総売上</div>
                </div>
                <div>
                  <div className="text-purple-600 font-medium">{snsStats.roi.roiRatio}倍</div>
                  <div className="text-gray-500">ROI倍率</div>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              新規キャンペーン作成
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI解説 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
            AI分析・施策提案
          </CardTitle>
          <CardDescription>
            データに基づくAIによる分析と推奨施策
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>AI分析中...</span>
            </div>
          ) : aiComment.includes("失敗") || aiComment.includes("エラー") ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-red-800 mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">
                    {errorType && ERROR_ACTIONS[errorType as keyof typeof ERROR_ACTIONS]?.title || 'AI解析に失敗しました'}
                  </span>
                </div>
                <p className="text-red-700 mb-4">{aiComment}</p>
                <div className="flex items-center space-x-3">
                  {errorType && ERROR_ACTIONS[errorType as keyof typeof ERROR_ACTIONS]?.actions.map((action, index) => (
                    <Button 
                      key={index}
                      size="sm" 
                      variant={action.action === 'retry' ? 'default' : 'outline'}
                      onClick={() => handleErrorAction(action.action)}
                    >
                      {action.action === 'retry' && <RefreshCw className="h-4 w-4 mr-2" />}
                      {action.action === 'show_sample' && <FileText className="h-4 w-4 mr-2" />}
                      {action.action === 'show_help' && <HelpCircle className="h-4 w-4 mr-2" />}
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{aiComment}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  コスト削減版 - 99%サンプル応答
                </Badge>
                {usageInfo && usageInfo.canUse && (
                  <span className="text-xs text-gray-500">
                    残り利用回数: 本日 {usageInfo.remaining.daily}回 / 今月 {usageInfo.remaining.monthly}回
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* クイックアクション */}
      <Card>
        <CardHeader>
          <CardTitle>推奨アクション</CardTitle>
          <CardDescription>
            最も効果的な次のアクション
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col bg-blue-600 hover:bg-blue-700">
              <Network className="h-6 w-6 mb-2" />
              紹介キャンペーン開始
              <span className="text-xs opacity-90">最も効果的</span>
            </Button>
            <Link href="/segments">
              <Button variant="outline" className="w-full h-20 flex-col">
                <BarChart3 className="h-6 w-6 mb-2" />
                セグメント分析
                <span className="text-xs opacity-90">死に施策発見</span>
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" className="w-full h-20 flex-col">
                <BookOpen className="h-6 w-6 mb-2" />
                施策テンプレート
                <span className="text-xs opacity-90">初心者サポート</span>
              </Button>
            </Link>
            <Link href="/coupons">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Ticket className="h-6 w-6 mb-2" />
                クーポン作成
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ドリルダウンモーダル */}
      <Dialog open={!!showDrilldown} onOpenChange={() => setShowDrilldown(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showDrilldown === 'referrals' && '紹介ネットワーク詳細分析'}
              {showDrilldown === 'coupons' && 'クーポン効果詳細分析'}
              {showDrilldown === 'sns' && 'SNS拡散詳細分析'}
            </DialogTitle>
            <DialogDescription>
              ROI・売上貢献の詳細な内訳とトレンド分析
            </DialogDescription>
          </DialogHeader>
          
          {showDrilldown === 'referrals' && (
            <Tabs defaultValue="channel" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="channel">チャネル別</TabsTrigger>
                <TabsTrigger value="time">時系列</TabsTrigger>
                <TabsTrigger value="roi">ROI分析</TabsTrigger>
              </TabsList>
              
              <TabsContent value="channel" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {DRILLDOWN_DATA.referrals.byChannel.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{item.channel}</div>
                            <div className="text-sm text-gray-500">{item.referrals}件の紹介</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(item.revenue)}</div>
                            <div className="text-sm text-green-600">ROI {item.roi}倍</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="time" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {DRILLDOWN_DATA.referrals.byTime.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{item.period}</div>
                            <div className="text-sm text-gray-500">{item.referrals}件の紹介</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(item.revenue)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="roi" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(referralStats.roi.totalRevenue)}</div>
                        <div className="text-sm text-gray-500">総売上</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(referralStats.roi.totalCost)}</div>
                        <div className="text-sm text-gray-500">総コスト</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{referralStats.roi.roiRatio}倍</div>
                        <div className="text-sm text-gray-500">ROI倍率</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {showDrilldown === 'coupons' && (
            <Tabs defaultValue="type" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="type">タイプ別</TabsTrigger>
                <TabsTrigger value="performance">パフォーマンス</TabsTrigger>
              </TabsList>
              
              <TabsContent value="type" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {DRILLDOWN_DATA.coupons.byType.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{item.type}</div>
                            <div className="text-sm text-gray-500">{item.usage}回利用</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(item.revenue)}</div>
                            <div className="text-sm text-green-600">ROI {item.roi}倍</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {DRILLDOWN_DATA.coupons.byPerformance.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{item.coupon}</div>
                            <div className="text-sm text-gray-500">{item.usage}回利用</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(item.revenue)}</div>
                            <div className="text-sm text-green-600">ROI {item.roi}倍</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* サンプルレポートモーダル */}
      <Dialog open={showSampleReport} onOpenChange={setShowSampleReport}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>サンプル分析レポート</DialogTitle>
            <DialogDescription>
              事前に用意された分析レポートです。参考にしてください。
            </DialogDescription>
          </DialogHeader>
          {currentSampleReport && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">{currentSampleReport.title}</h3>
                <div className="text-sm text-blue-700 whitespace-pre-line">{currentSampleReport.content}</div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSampleReport(false)}>
                  閉じる
                </Button>
                <Button>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  詳細レポートを開く
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ヘルプモーダル */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ヘルプ・トラブルシューティング</DialogTitle>
            <DialogDescription>
              よくある問題と解決方法をご案内します。
            </DialogDescription>
          </DialogHeader>
          {errorType && HELP_INFO[errorType as keyof typeof HELP_INFO] && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">
                  {HELP_INFO[errorType as keyof typeof HELP_INFO].title}
                </h3>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {HELP_INFO[errorType as keyof typeof HELP_INFO].content}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowHelp(false)}>
                  閉じる
                </Button>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  設定を確認
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
