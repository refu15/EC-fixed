// 自動アラートシステム
export interface Alert {
  id: string
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  message: string
  action: string
  severity: 'low' | 'medium' | 'high'
  category: 'kpi' | 'coupon' | 'referral' | 'system'
  timestamp: Date
  dismissed?: boolean
}

export interface KPIMetrics {
  sales: {
    current: number
    previous: number
    change: number
  }
  newCustomers: {
    current: number
    previous: number
    change: number
  }
  conversionRate: {
    current: number
    previous: number
    change: number
  }
  averageOrderValue: {
    current: number
    previous: number
    change: number
  }
}

export interface CouponMetrics {
  activeCoupons: number
  totalUsage: number
  lowStockCoupons: string[]
  expiringCoupons: string[]
}

export interface ReferralMetrics {
  totalReferrals: number
  completedReferrals: number
  conversionRate: number
  avgRewardAmount: number
}

// アラートしきい値設定
const ALERT_THRESHOLDS = {
  kpi: {
    salesDecline: -10, // 売上10%以上の下落
    cvrDecline: -15,   // CVR15%以上の下落
    customerDecline: -20, // 新規顧客20%以上の下落
    aovDecline: -5     // AOV5%以上の下落
  },
  coupon: {
    lowStockThreshold: 5, // 残り5回以下で警告
    expiringDays: 7       // 7日以内で期限切れ警告
  },
  referral: {
    lowConversionRate: 60, // 60%以下の完了率で警告
    highRewardCost: 50000  // 5万円以上の報酬コストで警告
  }
}

// KPIアラート生成
export function generateKPIAlerts(kpiMetrics: KPIMetrics): Alert[] {
  const alerts: Alert[] = []

  // 売上下落アラート
  if (kpiMetrics.sales.change < ALERT_THRESHOLDS.kpi.salesDecline) {
    alerts.push({
      id: `sales-decline-${Date.now()}`,
      type: 'warning',
      title: `売上が前月比${Math.abs(kpiMetrics.sales.change)}%下落`,
      message: '売上の急激な下落が検出されました。マーケティング施策の見直しを推奨します。',
      action: '売上分析レポート確認',
      severity: 'high',
      category: 'kpi',
      timestamp: new Date()
    })
  }

  // CVR下落アラート
  if (kpiMetrics.conversionRate.change < ALERT_THRESHOLDS.kpi.cvrDecline) {
    alerts.push({
      id: `cvr-decline-${Date.now()}`,
      type: 'warning',
      title: `CVRが前週比${Math.abs(kpiMetrics.conversionRate.change)}%低下`,
      message: 'コンバージョン率が急落しています。カート放棄メールの送信を推奨します。',
      action: 'カート放棄メール送信',
      severity: 'medium',
      category: 'kpi',
      timestamp: new Date()
    })
  }

  // 新規顧客下落アラート
  if (kpiMetrics.newCustomers.change < ALERT_THRESHOLDS.kpi.customerDecline) {
    alerts.push({
      id: `customers-decline-${Date.now()}`,
      type: 'warning',
      title: `新規顧客が前月比${Math.abs(kpiMetrics.newCustomers.change)}%減少`,
      message: '新規顧客の獲得が減少しています。集客施策の強化を検討してください。',
      action: '集客施策強化',
      severity: 'medium',
      category: 'kpi',
      timestamp: new Date()
    })
  }

  // AOV下落アラート
  if (kpiMetrics.averageOrderValue.change < ALERT_THRESHOLDS.kpi.aovDecline) {
    alerts.push({
      id: `aov-decline-${Date.now()}`,
      type: 'info',
      title: `AOVが前月比${Math.abs(kpiMetrics.averageOrderValue.change)}%低下`,
      message: '平均注文額が低下しています。クロスセル・アップセル施策の見直しを推奨します。',
      action: 'クロスセル施策確認',
      severity: 'low',
      category: 'kpi',
      timestamp: new Date()
    })
  }

  return alerts
}

// クーポンアラート生成
export function generateCouponAlerts(couponMetrics: CouponMetrics): Alert[] {
  const alerts: Alert[] = []

  // 在庫不足アラート
  if (couponMetrics.lowStockCoupons.length > 0) {
    alerts.push({
      id: `coupon-low-stock-${Date.now()}`,
      type: 'warning',
      title: `クーポン「${couponMetrics.lowStockCoupons[0]}」残り${ALERT_THRESHOLDS.coupon.lowStockThreshold}回`,
      message: '新規顧客限定クーポンの利用可能回数が少なくなっています。',
      action: 'クーポン追加発行',
      severity: 'medium',
      category: 'coupon',
      timestamp: new Date()
    })
  }

  // 期限切れアラート
  if (couponMetrics.expiringCoupons.length > 0) {
    alerts.push({
      id: `coupon-expiring-${Date.now()}`,
      type: 'info',
      title: `クーポン「${couponMetrics.expiringCoupons[0]}」が${ALERT_THRESHOLDS.coupon.expiringDays}日後に期限切れ`,
      message: 'クーポンの有効期限が近づいています。利用促進を検討してください。',
      action: '利用促進キャンペーン',
      severity: 'low',
      category: 'coupon',
      timestamp: new Date()
    })
  }

  return alerts
}

// 紹介アラート生成
export function generateReferralAlerts(referralMetrics: ReferralMetrics): Alert[] {
  const alerts: Alert[] = []

  // 完了率低下アラート
  const completionRate = (referralMetrics.completedReferrals / referralMetrics.totalReferrals) * 100
  if (completionRate < ALERT_THRESHOLDS.referral.lowConversionRate) {
    alerts.push({
      id: `referral-low-rate-${Date.now()}`,
      type: 'warning',
      title: `紹介完了率が${completionRate.toFixed(1)}%と低い`,
      message: '紹介の完了率が低下しています。紹介プロセスの改善を検討してください。',
      action: '紹介プロセス改善',
      severity: 'medium',
      category: 'referral',
      timestamp: new Date()
    })
  }

  // 報酬コスト高額アラート
  const totalRewardCost = referralMetrics.totalReferrals * referralMetrics.avgRewardAmount
  if (totalRewardCost > ALERT_THRESHOLDS.referral.highRewardCost) {
    alerts.push({
      id: `referral-high-cost-${Date.now()}`,
      type: 'info',
      title: `紹介報酬コストが${totalRewardCost.toLocaleString()}円と高額`,
      message: '紹介報酬の総コストが高くなっています。報酬設定の見直しを検討してください。',
      action: '報酬設定見直し',
      severity: 'low',
      category: 'referral',
      timestamp: new Date()
    })
  }

  return alerts
}

// システムアラート生成
export function generateSystemAlerts(usageInfo: any): Alert[] {
  const alerts: Alert[] = []

  // 利用制限アラート
  if (usageInfo && !usageInfo.canUse) {
    alerts.push({
      id: `usage-limit-${Date.now()}`,
      type: 'error',
      title: '利用制限に達しました',
      message: usageInfo.message || '本日の利用制限に達しました。プランのアップグレードを検討してください。',
      action: 'プランアップグレード',
      severity: 'high',
      category: 'system',
      timestamp: new Date()
    })
  }

  // 利用回数警告
  if (usageInfo && usageInfo.remaining && usageInfo.remaining.daily < 3) {
    alerts.push({
      id: `usage-warning-${Date.now()}`,
      type: 'warning',
      title: `本日の利用回数が残り${usageInfo.remaining.daily}回`,
      message: '本日の利用回数が少なくなっています。重要な分析は早めに実行してください。',
      action: '利用制限確認',
      severity: 'medium',
      category: 'system',
      timestamp: new Date()
    })
  }

  return alerts
}

// 全アラート生成
export function generateAllAlerts(
  kpiMetrics: KPIMetrics,
  couponMetrics: CouponMetrics,
  referralMetrics: ReferralMetrics,
  usageInfo: any
): Alert[] {
  const alerts = [
    ...generateKPIAlerts(kpiMetrics),
    ...generateCouponAlerts(couponMetrics),
    ...generateReferralAlerts(referralMetrics),
    ...generateSystemAlerts(usageInfo)
  ]

  // 重要度順にソート（high > medium > low）
  const severityOrder = { high: 3, medium: 2, low: 1 }
  return alerts.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity])
}

// アラートの重複チェック
export function deduplicateAlerts(alerts: Alert[]): Alert[] {
  const seen = new Set<string>()
  return alerts.filter(alert => {
    const key = `${alert.category}-${alert.title}`
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

// アラートの有効期限チェック（24時間以上古いアラートを削除）
export function filterExpiredAlerts(alerts: Alert[]): Alert[] {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  
  return alerts.filter(alert => {
    return alert.timestamp > oneDayAgo
  })
} 