"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Bot, User, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { generateTextWithGemini } from "@/lib/gemini"

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
      const aiResponse = await generateTextWithGemini(prompt)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
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
               <p className="text-sm text-gray-500">（Gemini API連携版）</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
            <Card>
                <CardHeader>
                    <CardTitle>AIチャットボット</CardTitle>
                    <CardDescription>
                        AIチャットボットが顧客からのよくある質問に24時間365日対応します。
                        <br />
                        <strong className="text-blue-600">（Gemini APIを利用した実際のAI応答です）</strong>
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
                                  disabled={isLoading}
                                />
                                <Button 
                                  size="icon" 
                                  onClick={handleSendMessage}
                                  disabled={!inputText.trim() || isLoading}
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
