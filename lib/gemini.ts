import { GoogleGenerativeAI, GenerateContentRequest } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn("Gemini APIキーが設定されていません。環境変数NEXT_PUBLIC_GEMINI_API_KEYを確認してください。")
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

/**
 * Geminiでテキスト生成（プロンプト→レスポンス）
 * @param prompt 入力プロンプト
 * @param options 追加オプション（将来拡張用）
 */
export async function generateTextWithGemini(prompt: string, options?: Partial<GenerateContentRequest>) {
  if (!genAI) throw new Error("Gemini APIキーが未設定です")
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })
  const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }], ...options })
  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || ""
  return text
} 