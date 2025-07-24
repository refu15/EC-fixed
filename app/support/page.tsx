"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Bot, User, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function Support() {
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
               <p className="text-sm text-gray-500">（β版：一部機能は今後実装予定）</p>
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
                        <strong className="text-blue-600">（この機能は、チャットボットとの対話サンプルです。実際のAI応答はGemini APIを利用します）</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg h-[60vh] flex flex-col">
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto space-y-6 p-6">
                            <div className="flex items-start space-x-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                                <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                                    <p className="text-sm">こんにちは！ご用件をお聞かせください。</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 justify-end">
                                <div className="bg-blue-600 text-white rounded-lg p-3 max-w-md">
                                    <p className="text-sm">商品の返品はできますか？</p>
                                </div>
                                 <Avatar className="h-9 w-9">
                                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                                <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                                    <p className="text-sm">
                                        はい、可能です。商品到着後7日以内で、未使用・未開封の場合に限り返品を承っております。
                                        <br/><br/>
                                        返品をご希望の場合は、注文番号を教えていただけますか？
                                    </p>
                                </div>
                            </div>

                             <div className="flex items-start space-x-3 justify-end">
                                <div className="bg-blue-600 text-white rounded-lg p-3 max-w-md">
                                    <p className="text-sm">オペレーターと話したいです。</p>
                                </div>
                                 <Avatar className="h-9 w-9">
                                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            </div>

                             <div className="flex items-start space-x-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                                <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                                    <p className="text-sm">
                                        承知いたしました。人間のオペレーターにお繋ぎします。
                                        <br/>
                                        <strong className="text-red-600">（この機能は現在開発中です。恐れ入りますが、メールまたはお電話でお問い合わせください。）</strong>
                                    </p>
                                     <div className="mt-4 flex space-x-4">
                                        <Button variant="outline" size="sm"><Mail className="h-4 w-4 mr-2"/>メール</Button>
                                        <Button variant="outline" size="sm"><Phone className="h-4 w-4 mr-2"/>電話</Button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Message Input */}
                        <div className="border-t p-4 bg-white">
                            <div className="flex items-center space-x-3">
                                <Input placeholder="メッセージを入力..." className="flex-1" disabled />
                                <Button size="icon" disabled>
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
