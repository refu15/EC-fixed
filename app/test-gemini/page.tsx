"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Send } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"

export default function TestGemini() {
  const [status, setStatus] = useState<{
    envVar: boolean
    client: boolean
  }>({
    envVar: false,
    client: false,
  })
  const [testPrompt, setTestPrompt] = useState("こんにちは、簡単な挨拶をしてください。")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [apiKey, setApiKey] = useState("")

  // 初期状態チェック
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    setApiKey(key || "")
    setStatus(prev => ({ ...prev, envVar: !!key }))
  }, [])

  async function handleTestGemini() {
    setLoading(true)
    setError("")
    setResponse("")

    try {
      if (!apiKey) {
        throw new Error("Gemini APIキーが設定されていません")
      }

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
      
      console.log("Gemini API呼び出し開始...")
      const result = await model.generateContent(testPrompt)
      const response = await result.response
      const text = response.text()
      
      console.log("Gemini API応答:", text)
      setResponse(text)
      setStatus(prev => ({ ...prev, client: true }))
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "予期しないエラーが発生しました"
      setError(errorMessage)
      console.error("Gemini API テストエラー:", e)
    } finally {
      setLoading(false)
    }
  }

  async function handleTestWithSample() {
    setLoading(true)
    setError("")
    setResponse("")

    try {
      // サンプル応答をテスト
      const sampleResponse = "こんにちは！EC Growth HubのAIアシスタントです。ご質問やお困りのことがございましたら、お気軽にお声かけください。"
      setResponse(sampleResponse + "\n\n※これはサンプル応答です。")
      setStatus(prev => ({ ...prev, client: true }))
    } catch (e) {
      setError("サンプル応答のテストに失敗しました")
    } finally {
      setLoading(false)
    }
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Gemini API接続テスト</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gemini API設定状況</CardTitle>
              <CardDescription>
                Gemini APIの環境変数と接続状況を確認します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-2">
                  <span>環境変数設定</span>
                  <span className="text-sm text-gray-500">
                    (NEXT_PUBLIC_GEMINI_API_KEY)
                  </span>
                </div>
                <Badge variant={status.envVar ? "default" : "destructive"}>
                  {status.envVar ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-1" />
                  )}
                  {status.envVar ? "設定済み" : "未設定"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-2">
                  <span>API呼び出しテスト</span>
                  <span className="text-sm text-gray-500">
                    (実際のAPI呼び出し)
                  </span>
                </div>
                <Badge variant={status.client ? "default" : "secondary"}>
                  {status.client ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-1" />
                  )}
                  {status.client ? "成功" : "未テスト"}
                </Badge>
              </div>

              {!status.envVar && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      環境変数が設定されていません。.env.localファイルに以下を追加してください：
                    </span>
                  </div>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                    NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
                  </pre>
                </div>
              )}

              {status.envVar && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">
                      APIキーが設定されています（最初の10文字: {apiKey.substring(0, 10)}...）
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gemini APIテスト</CardTitle>
              <CardDescription>
                実際にGemini APIを呼び出してテストします
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">テストプロンプト:</label>
                <Input
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="テスト用のプロンプトを入力してください"
                  disabled={loading}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleTestGemini} 
                  disabled={loading || !testPrompt.trim() || !status.envVar}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      API呼び出し中...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      実際のGemini APIをテスト
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleTestWithSample} 
                  disabled={loading}
                  variant="outline"
                >
                  サンプル応答をテスト
                </Button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-800 font-medium">エラー:</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              )}

              {response && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">AI応答:</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1 whitespace-pre-line">{response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 