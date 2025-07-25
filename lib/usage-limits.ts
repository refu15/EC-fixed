import { supabase } from "./supabase"

// プラン別制限設定
export const PLAN_LIMITS = {
  free: {
    daily: 5,      // 1日5回
    monthly: 50,   // 月50回
    name: "フリープラン"
  },
  personal: {
    daily: 100,    // 1日100回
    monthly: 3000, // 月3000回
    name: "パーソナルプラン"
  },
  business: {
    daily: 500,    // 1日500回
    monthly: 15000, // 月15000回
    name: "ビジネスプラン"
  }
} as const

export type PlanType = keyof typeof PLAN_LIMITS

// 利用履歴の型定義
interface UsageLog {
  id: string
  user_id: string
  plan_type: PlanType
  api_type: 'gemini' | 'other'
  created_at: string
  tokens_used?: number
}

/**
 * ユーザーの利用制限をチェック
 */
export async function checkUsageLimit(userId: string, planType: PlanType = 'free'): Promise<{
  canUse: boolean
  remaining: {
    daily: number
    monthly: number
  }
  limits: {
    daily: number
    monthly: number
  }
  message?: string
}> {
  try {
    const limits = PLAN_LIMITS[planType]
    
    // 今日の利用回数
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { data: dailyUsage, error: dailyError } = await supabase
      .from('usage_logs')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
    
    if (dailyError) {
      console.error('Daily usage check error:', dailyError)
      return {
        canUse: false,
        remaining: { daily: 0, monthly: 0 },
        limits,
        message: '利用状況の確認に失敗しました'
      }
    }
    
    // 今月の利用回数
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    
    const { data: monthlyUsage, error: monthlyError } = await supabase
      .from('usage_logs')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', monthStart.toISOString())
    
    if (monthlyError) {
      console.error('Monthly usage check error:', monthlyError)
      return {
        canUse: false,
        remaining: { daily: 0, monthly: 0 },
        limits,
        message: '利用状況の確認に失敗しました'
      }
    }
    
    const dailyUsed = dailyUsage?.length || 0
    const monthlyUsed = monthlyUsage?.length || 0
    
    const remainingDaily = Math.max(0, limits.daily - dailyUsed)
    const remainingMonthly = Math.max(0, limits.monthly - monthlyUsed)
    
    const canUse = remainingDaily > 0 && remainingMonthly > 0
    
    let message: string | undefined
    if (!canUse) {
      if (remainingDaily <= 0) {
        message = `本日の利用制限（${limits.daily}回）に達しました。明日までお待ちください。`
      } else if (remainingMonthly <= 0) {
        message = `今月の利用制限（${limits.monthly}回）に達しました。来月までお待ちください。`
      }
    }
    
    return {
      canUse,
      remaining: {
        daily: remainingDaily,
        monthly: remainingMonthly
      },
      limits,
      message
    }
  } catch (error) {
    console.error('Usage limit check error:', error)
    return {
      canUse: false,
      remaining: { daily: 0, monthly: 0 },
      limits: PLAN_LIMITS.free,
      message: '利用制限の確認に失敗しました'
    }
  }
}

/**
 * 利用履歴を記録
 */
export async function logUsage(
  userId: string, 
  planType: PlanType = 'free',
  apiType: 'gemini' | 'other' = 'gemini',
  tokensUsed?: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        plan_type: planType,
        api_type: apiType,
        tokens_used: tokensUsed,
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Usage log error:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Usage logging error:', error)
    return false
  }
}

/**
 * 制限付きGemini API呼び出し
 */
export async function generateTextWithLimit(
  userId: string,
  prompt: string,
  planType: PlanType = 'free'
): Promise<{
  success: boolean
  text: string
  message?: string
  remaining?: {
    daily: number
    monthly: number
  }
}> {
  // 利用制限チェック
  const limitCheck = await checkUsageLimit(userId, planType)
  
  if (!limitCheck.canUse) {
    return {
      success: false,
      text: '',
      message: limitCheck.message || '利用制限に達しました'
    }
  }
  
  try {
    // コスト削減のため、まずサンプル応答を試す
    const { generateTextWithGemini } = await import('./gemini')
    
    // 制限付きAPI呼び出し（90%サンプル応答、10%実際のAPI）
    const text = await generateTextWithGemini(prompt)
    
    // 利用履歴を記録（実際のAPI呼び出しがあった場合のみ）
    // サンプル応答の場合は記録しない
    if (text && !text.includes('※実際のAI応答でエラーが発生したため')) {
      await logUsage(userId, planType, 'gemini')
    }
    
    return {
      success: true,
      text,
      remaining: limitCheck.remaining
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    
    // エラー時はサンプル応答を返す
    const sampleResponse = getSampleResponse(prompt)
    if (sampleResponse) {
      return {
        success: true,
        text: sampleResponse + "\n\n※実際のAI応答でエラーが発生したため、サンプル応答を表示しています。",
        remaining: limitCheck.remaining
      }
    }
    
    return {
      success: false,
      text: '',
      message: error instanceof Error ? error.message : 'AI応答の生成に失敗しました'
    }
  }
}

/**
 * プロンプトに基づいてサンプル応答を取得（usage-limits.ts用）
 */
function getSampleResponse(prompt: string): string | null {
  const SAMPLE_RESPONSES = {
    proposal: {
      "休眠顧客再活性メール": "この施策は90日間購入がない顧客に対して、特別なクーポンやオファーを提供することで再購入を促進するものです。期待効果として、休眠顧客の20-30%が再購入に至り、平均注文額も通常より15%程度高い傾向があります。実行時の注意点として、過度な割引は利益率を下げるため、付加価値のあるオファーを検討することをお勧めします。",
      "SMS フラッシュセール": "SMSを活用した期間限定セールは、緊急性を演出することで即座の購買行動を促す効果的な施策です。特に週末限定の20%OFFは、顧客の購買意欲を高め、売上向上に直結します。注意点として、SMS配信の頻度は月1-2回程度に抑え、顧客の反応率を監視することが重要です。",
      "チェックアウト UI A/B テスト": "チェックアウトフローの最適化は、コンバージョン率向上に最も効果的な施策の一つです。簡易チェックアウトと現行フローを比較することで、ユーザビリティの改善点を特定できます。期待効果として、CVRが5-15%向上する可能性があります。テスト期間は最低2週間、統計的有意性を確保してから判断することをお勧めします。"
    },
    support: {
      "返品": "商品の返品は、商品到着後7日以内で、未使用・未開封の場合に限り承っております。返品をご希望の場合は、注文番号をお教えください。返品手続きの詳細をお送りいたします。",
      "配送": "通常の配送は3-5営業日でお届けします。お急ぎの場合は、有料の速達配送サービスもご利用いただけます。配送状況の詳細は、注文確認メールに記載されている追跡番号でご確認ください。",
      "支払い": "クレジットカード、銀行振込、代金引換、各種電子マネーをご利用いただけます。セキュリティのため、お客様の個人情報は暗号化して安全に管理しております。"
    }
  }
  
  // 施策提案関連
  if (prompt.includes("休眠顧客再活性メール")) {
    return SAMPLE_RESPONSES.proposal["休眠顧客再活性メール"]
  }
  if (prompt.includes("SMS フラッシュセール")) {
    return SAMPLE_RESPONSES.proposal["SMS フラッシュセール"]
  }
  if (prompt.includes("チェックアウト UI A/B テスト")) {
    return SAMPLE_RESPONSES.proposal["チェックアウト UI A/B テスト"]
  }
  
  // サポート関連
  if (prompt.includes("返品") || prompt.includes("返金")) {
    return SAMPLE_RESPONSES.support["返品"]
  }
  if (prompt.includes("配送") || prompt.includes("発送") || prompt.includes("配達")) {
    return SAMPLE_RESPONSES.support["配送"]
  }
  if (prompt.includes("支払い") || prompt.includes("決済") || prompt.includes("お金")) {
    return SAMPLE_RESPONSES.support["支払い"]
  }
  
  // 一般的な挨拶
  if (prompt.includes("こんにちは") || prompt.includes("挨拶")) {
    return "こんにちは！EC Growth HubのAIアシスタントです。ご質問やお困りのことがございましたら、お気軽にお声かけください。"
  }
  
  return null
}

/**
 * ユーザーの利用状況を取得
 */
export async function getUserUsage(userId: string, planType: PlanType = 'free') {
  const limitCheck = await checkUsageLimit(userId, planType)
  
  return {
    plan: PLAN_LIMITS[planType],
    usage: {
      daily: limitCheck.limits.daily - limitCheck.remaining.daily,
      monthly: limitCheck.limits.monthly - limitCheck.remaining.monthly
    },
    remaining: limitCheck.remaining,
    canUse: limitCheck.canUse
  }
} 