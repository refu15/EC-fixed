"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Send, Bot, User, Phone, Mail, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { generateTextWithLimit } from "@/lib/usage-limits" // 変更: 制限付きAPIを使用

// デモ用のユーザーID（実際の実装では認証システムから取得）
const DEMO_USER_ID = "demo-user-001"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function Support() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "こんにちは！ご用件をお聞かせください。",
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "商品の返品はできますか？",
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: "3",
      text: "はい、可能です。商品到着後7日以内で、未使用・未開封の場合に限り返品を承っております。\n\n返品をご希望の場合は、注文番号を教えていただけますか？",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [usageInfo, setUsageInfo] = useState<{
    remaining: { daily: number; monthly: number }
    canUse: boolean
    message?: string
  } | null>(null)

  async function handleSendMessage() {
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsLoading(true)

    try {
      const prompt = `ECサイトのカスタマーサポートとして、以下の質問に丁寧に回答してください。回答は200字以内で、親切で分かりやすい日本語でお願いします。\n\n質問: ${inputText}`
      
      // 制限付きGemini API呼び出し
      const result = await generateTextWithLimit(DEMO_USER_ID, prompt, 'free')
      
      if (result.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.text,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setUsageInfo({
          remaining: result.remaining!,
          canUse: true
        })
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.message || "申し訳ございません。現在AI応答の生成に問題が発生しています。しばらく時間をおいて再度お試しください。",
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        setUsageInfo({
          remaining: { daily: 0, monthly: 0 },
          canUse: false,
          message: result.message
        })
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "申し訳ございません。現在AI応答の生成に問題が発生しています。しばらく時間をおいて再度お試しください。",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
              <h1 className="text-2xl font-bold text-gray-900">リアルタイム顧客サポート</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/usage-status">
                <Button variant="outline" size="sm">
                  利用制限確認
                </Button>
              </Link>
              <p className="text-sm text-gray-500">（コスト削減版）</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* 利用制限アラート */}
          {usageInfo && !usageInfo.canUse && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {usageInfo.message || "利用制限に達しました"}
                <Link href="/usage-status" className="ml-2 underline">
                  利用制限を確認
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* 利用状況表示 */}
          {usageInfo && usageInfo.canUse && (
            <Alert className="mb-6">
              <AlertDescription>
                残り利用回数: 本日 {usageInfo.remaining.daily}回 / 今月 {usageInfo.remaining.monthly}回
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>AIチャットボット</CardTitle>
              <CardDescription>
                AIチャットボットが顧客からのよくある質問に24時間365日対応します。
                <br />
                <strong className="text-blue-600">（コスト削減版 - 80%サンプル応答、20%実際のAI応答）</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg h-[60vh] flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-6 p-6">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex items-start space-x-3 ${message.isUser ? "justify-end" : ""}`}>
                      {!message.isUser && (
                        <Avatar className="h-9 w-9">
                          <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`rounded-lg p-3 max-w-md ${
                        message.isUser 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-100"
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                      {message.isUser && (
                        <Avatar className="h-9 w-9">
                          <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                        <p className="text-sm text-gray-500">AIが応答を生成中...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t p-4 bg-white">
                  <div className="flex items-center space-x-3">
                    <Input 
                      placeholder="メッセージを入力..." 
                      className="flex-1" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading || (usageInfo && !usageInfo.canUse)}
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isLoading || (usageInfo && !usageInfo.canUse)}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
