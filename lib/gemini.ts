import { GoogleGenerativeAI, GenerateContentRequest } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

if (!GEMINI_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn("Gemini APIキーが設定されていません。環境変数NEXT_PUBLIC_GEMINI_API_KEYを確認してください。")
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

// コスト削減のためのサンプル応答
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

/**
 * コスト削減版Gemini API呼び出し
 * サンプル応答を優先し、実際のAPI呼び出しは最小限に制限
 */
export async function generateTextWithGemini(prompt: string, options?: Partial<GenerateContentRequest>) {
  try {
    // 開発環境では100%サンプル応答を使用（コスト削減）
    if (IS_DEVELOPMENT) {
      const sampleResponse = getSampleResponse(prompt)
      if (sampleResponse) {
        return sampleResponse + "\n\n※開発環境のため、サンプル応答を表示しています。"
      }
      // サンプル応答がない場合のデフォルト
      return "こんにちは！EC Growth HubのAIアシスタントです。ご質問やお困りのことがございましたら、お気軽にお声かけください。\n\n※開発環境のため、サンプル応答を表示しています。"
    }
    
    // 本番環境でも99%の確率でサンプル応答を使用（コスト削減を最大化）
    const sampleResponse = getSampleResponse(prompt)
    if (sampleResponse) {
      if (Math.random() < 0.99) {
        return sampleResponse
      }
    }

    // 実際のAPI呼び出し（1%の確率のみ）
    if (!genAI) {
      throw new Error("Gemini APIキーが未設定です")
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    if (!text) {
      throw new Error("AI応答が空です")
    }
    
    return text
  } catch (error) {
    console.error("Gemini API エラー:", error)
    
    // エラー時はサンプル応答を返す
    const sampleResponse = getSampleResponse(prompt)
    if (sampleResponse) {
      return sampleResponse + "\n\n※実際のAI応答でエラーが発生したため、サンプル応答を表示しています。"
    }
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("Gemini APIキーが無効です")
      } else if (error.message.includes("quota") || error.message.includes("429")) {
        throw new Error("Gemini APIの無料枠利用制限に達しました。48秒後に再試行するか、有料プランへのアップグレードをご検討ください。")
      } else if (error.message.includes("network")) {
        throw new Error("ネットワーク接続エラーです")
      } else if (error.message.includes("models/") && error.message.includes("not found")) {
        throw new Error("Gemini APIモデルが見つかりません。利用可能なモデルを確認してください。")
      } else {
        throw new Error(`Gemini API エラー: ${error.message}`)
      }
    } else {
      throw new Error("予期しないエラーが発生しました")
    }
  }
}

/**
 * プロンプトに基づいてサンプル応答を取得
 */
function getSampleResponse(prompt: string): string | null {
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