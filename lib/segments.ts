// セグメント別パフォーマンス分析システム

export interface Segment {
  id: string
  name: string
  type: 'channel' | 'ltv' | 'customer_type' | 'campaign' | 'referral_source'
  description: string
  filter: SegmentFilter
  metrics: SegmentMetrics
  isActive: boolean
}

export interface SegmentFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: string | number | string[] | number[]
}

export interface SegmentMetrics {
  totalCustomers: number
  totalRevenue: number
  averageOrderValue: number
  conversionRate: number
  repeatPurchaseRate: number
  customerLifetimeValue: number
  roi: number
  growthRate: number
}

export interface SegmentComparison {
  segment1: Segment
  segment2: Segment
  differences: {
    revenue: number
    conversionRate: number
    aov: number
    roi: number
  }
  insights: string[]
}

// デフォルトセグメント定義
export const DEFAULT_SEGMENTS: Segment[] = [
  {
    id: 'line-referrals',
    name: 'LINE経由紹介',
    type: 'channel',
    description: 'LINE公式アカウント経由の紹介顧客',
    filter: {
      field: 'referral_channel',
      operator: 'equals',
      value: 'line'
    },
    metrics: {
      totalCustomers: 45,
      totalRevenue: 890000,
      averageOrderValue: 19778,
      conversionRate: 4.2,
      repeatPurchaseRate: 35,
      customerLifetimeValue: 45000,
      roi: 18.5,
      growthRate: 12.3
    },
    isActive: true
  },
  {
    id: 'instagram-referrals',
    name: 'Instagram経由紹介',
    type: 'channel',
    description: 'Instagram経由の紹介顧客',
    filter: {
      field: 'referral_channel',
      operator: 'equals',
      value: 'instagram'
    },
    metrics: {
      totalCustomers: 28,
      totalRevenue: 520000,
      averageOrderValue: 18571,
      conversionRate: 3.8,
      repeatPurchaseRate: 42,
      customerLifetimeValue: 38000,
      roi: 15.2,
      growthRate: 8.7
    },
    isActive: true
  },
  {
    id: 'high-ltv',
    name: '高LTV顧客',
    type: 'ltv',
    description: '顧客生涯価値が高い顧客層',
    filter: {
      field: 'customer_lifetime_value',
      operator: 'greater_than',
      value: 50000
    },
    metrics: {
      totalCustomers: 23,
      totalRevenue: 1200000,
      averageOrderValue: 52174,
      conversionRate: 6.5,
      repeatPurchaseRate: 78,
      customerLifetimeValue: 85000,
      roi: 25.3,
      growthRate: 15.8
    },
    isActive: true
  },
  {
    id: 'new-customers',
    name: '新規顧客',
    type: 'customer_type',
    description: '初回購入の新規顧客',
    filter: {
      field: 'purchase_count',
      operator: 'equals',
      value: 1
    },
    metrics: {
      totalCustomers: 156,
      totalRevenue: 2840000,
      averageOrderValue: 18205,
      conversionRate: 3.2,
      repeatPurchaseRate: 0,
      customerLifetimeValue: 18205,
      roi: 12.7,
      growthRate: 9.9
    },
    isActive: true
  },
  {
    id: 'repeat-customers',
    name: 'リピート顧客',
    type: 'customer_type',
    description: '2回以上の購入実績がある顧客',
    filter: {
      field: 'purchase_count',
      operator: 'greater_than',
      value: 1
    },
    metrics: {
      totalCustomers: 89,
      totalRevenue: 2100000,
      averageOrderValue: 23596,
      conversionRate: 5.8,
      repeatPurchaseRate: 100,
      customerLifetimeValue: 42000,
      roi: 18.9,
      growthRate: 12.1
    },
    isActive: true
  },
  {
    id: 'welcome-coupon',
    name: 'WELCOME1000クーポン利用',
    type: 'campaign',
    description: '新規顧客限定クーポンを利用した顧客',
    filter: {
      field: 'used_coupons',
      operator: 'contains',
      value: 'WELCOME1000'
    },
    metrics: {
      totalCustomers: 45,
      totalRevenue: 180000,
      averageOrderValue: 4000,
      conversionRate: 4.5,
      repeatPurchaseRate: 22,
      customerLifetimeValue: 12000,
      roi: 3.2,
      growthRate: 8.3
    },
    isActive: true
  }
]

// セグメント別メトリクス計算
export function calculateSegmentMetrics(segment: Segment, data: any[]): SegmentMetrics {
  const filteredData = filterDataBySegment(data, segment.filter)
  
  if (filteredData.length === 0) {
    return {
      totalCustomers: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      conversionRate: 0,
      repeatPurchaseRate: 0,
      customerLifetimeValue: 0,
      roi: 0,
      growthRate: 0
    }
  }

  const totalCustomers = filteredData.length
  const totalRevenue = filteredData.reduce((sum, item) => sum + (item.revenue || 0), 0)
  const averageOrderValue = totalRevenue / totalCustomers
  const conversionRate = (filteredData.filter(item => item.converted).length / totalCustomers) * 100
  const repeatCustomers = filteredData.filter(item => item.purchase_count > 1).length
  const repeatPurchaseRate = (repeatCustomers / totalCustomers) * 100
  const customerLifetimeValue = totalRevenue / totalCustomers
  const roi = calculateROI(segment, totalRevenue)
  const growthRate = calculateGrowthRate(filteredData)

  return {
    totalCustomers,
    totalRevenue,
    averageOrderValue,
    conversionRate,
    repeatPurchaseRate,
    customerLifetimeValue,
    roi,
    growthRate
  }
}

// データフィルタリング
function filterDataBySegment(data: any[], filter: SegmentFilter): any[] {
  return data.filter(item => {
    const fieldValue = item[filter.field]
    
    switch (filter.operator) {
      case 'equals':
        return fieldValue === filter.value
      case 'contains':
        return String(fieldValue).includes(String(filter.value))
      case 'greater_than':
        return Number(fieldValue) > Number(filter.value)
      case 'less_than':
        return Number(fieldValue) < Number(filter.value)
      case 'in':
        return Array.isArray(filter.value) && filter.value.includes(fieldValue)
      case 'not_in':
        return Array.isArray(filter.value) && !filter.value.includes(fieldValue)
      default:
        return true
    }
  })
}

// ROI計算
function calculateROI(segment: Segment, revenue: number): number {
  // セグメントタイプに応じたコスト計算
  let cost = 0
  
  switch (segment.type) {
    case 'channel':
      cost = segment.metrics.totalCustomers * 1000 // 紹介報酬
      break
    case 'campaign':
      cost = segment.metrics.totalCustomers * 1000 // クーポン割引
      break
    default:
      cost = revenue * 0.1 // デフォルト10%コスト
  }
  
  return cost > 0 ? revenue / cost : 0
}

// 成長率計算
function calculateGrowthRate(data: any[]): number {
  if (data.length < 2) return 0
  
  const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const midPoint = Math.floor(sortedData.length / 2)
  
  const firstHalf = sortedData.slice(0, midPoint)
  const secondHalf = sortedData.slice(midPoint)
  
  const firstHalfRevenue = firstHalf.reduce((sum, item) => sum + (item.revenue || 0), 0)
  const secondHalfRevenue = secondHalf.reduce((sum, item) => sum + (item.revenue || 0), 0)
  
  if (firstHalfRevenue === 0) return 0
  
  return ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100
}

// セグメント比較
export function compareSegments(segment1: Segment, segment2: Segment): SegmentComparison {
  const differences = {
    revenue: segment1.metrics.totalRevenue - segment2.metrics.totalRevenue,
    conversionRate: segment1.metrics.conversionRate - segment2.metrics.conversionRate,
    aov: segment1.metrics.averageOrderValue - segment2.metrics.averageOrderValue,
    roi: segment1.metrics.roi - segment2.metrics.roi
  }

  const insights = generateInsights(segment1, segment2, differences)

  return {
    segment1,
    segment2,
    differences,
    insights
  }
}

// インサイト生成
function generateInsights(segment1: Segment, segment2: Segment, differences: any): string[] {
  const insights: string[] = []

  if (differences.revenue > 0) {
    insights.push(`${segment1.name}は${segment2.name}より${formatCurrency(differences.revenue)}の売上貢献が高い`)
  }

  if (differences.conversionRate > 2) {
    insights.push(`${segment1.name}のCVRが${segment2.name}より${differences.conversionRate.toFixed(1)}%高い`)
  }

  if (differences.aov > 5000) {
    insights.push(`${segment1.name}のAOVが${segment2.name}より${formatCurrency(differences.aov)}高い`)
  }

  if (differences.roi > 5) {
    insights.push(`${segment1.name}のROIが${segment2.name}より${differences.roi.toFixed(1)}倍高い`)
  }

  if (insights.length === 0) {
    insights.push('両セグメントのパフォーマンスは同等です')
  }

  return insights
}

// 通貨フォーマット
function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString()}`
}

// セグメント別の推奨施策生成
export function generateSegmentRecommendations(segment: Segment): string[] {
  const recommendations: string[] = []

  if (segment.metrics.conversionRate < 3) {
    recommendations.push('CVR向上のため、ターゲティング広告の最適化を検討')
  }

  if (segment.metrics.repeatPurchaseRate < 30) {
    recommendations.push('リピート率向上のため、フォローアップメールの強化を推奨')
  }

  if (segment.metrics.roi < 10) {
    recommendations.push('ROI改善のため、コスト構造の見直しを検討')
  }

  if (segment.metrics.growthRate < 5) {
    recommendations.push('成長率向上のため、新規顧客獲得施策の強化を推奨')
  }

  return recommendations
}

// セグメント別の優先度スコア計算
export function calculateSegmentPriority(segment: Segment): number {
  const weights = {
    roi: 0.3,
    growthRate: 0.25,
    conversionRate: 0.2,
    repeatPurchaseRate: 0.15,
    totalCustomers: 0.1
  }

  const normalizedROI = Math.min(segment.metrics.roi / 20, 1) // 20倍を最大値として正規化
  const normalizedGrowth = Math.min(segment.metrics.growthRate / 20, 1) // 20%を最大値として正規化
  const normalizedCVR = Math.min(segment.metrics.conversionRate / 10, 1) // 10%を最大値として正規化
  const normalizedRepeat = segment.metrics.repeatPurchaseRate / 100
  const normalizedCustomers = Math.min(segment.metrics.totalCustomers / 100, 1) // 100人を最大値として正規化

  return (
    normalizedROI * weights.roi +
    normalizedGrowth * weights.growthRate +
    normalizedCVR * weights.conversionRate +
    normalizedRepeat * weights.repeatPurchaseRate +
    normalizedCustomers * weights.totalCustomers
  )
} 