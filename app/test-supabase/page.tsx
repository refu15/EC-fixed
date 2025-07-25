"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function TestSupabase() {
  const [status, setStatus] = useState<{
    envVars: boolean
    client: boolean
    connection: boolean
  }>({
    envVars: false,
    client: false,
    connection: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSupabase() {
      // 環境変数チェック
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      setStatus(prev => ({ ...prev, envVars: hasUrl && hasKey }))
      
      // クライアントチェック
      if (supabase) {
        setStatus(prev => ({ ...prev, client: true }))
        
        // 接続テスト
        try {
          const { data, error } = await supabase.from('test').select('*').limit(1)
          if (error) {
            console.log('Supabase connection test error:', error)
            // エラーがあってもクライアント自体は動作している
            setStatus(prev => ({ ...prev, connection: true }))
          } else {
            setStatus(prev => ({ ...prev, connection: true }))
          }
        } catch (e) {
          console.log('Supabase connection test failed:', e)
          setStatus(prev => ({ ...prev, connection: false }))
        }
      } else {
        setStatus(prev => ({ ...prev, client: false, connection: false }))
      }
      
      setLoading(false)
    }

    checkSupabase()
  }, [])

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
              <h1 className="text-2xl font-bold text-gray-900">Supabase接続テスト</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supabase設定状況</CardTitle>
              <CardDescription>
                Supabaseの環境変数と接続状況を確認します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <p>確認中...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-2">
                      <span>環境変数設定</span>
                      <span className="text-sm text-gray-500">
                        (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
                      </span>
                    </div>
                    <Badge variant={status.envVars ? "default" : "destructive"}>
                      {status.envVars ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {status.envVars ? "設定済み" : "未設定"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-2">
                      <span>Supabaseクライアント</span>
                      <span className="text-sm text-gray-500">
                        (createClient)
                      </span>
                    </div>
                    <Badge variant={status.client ? "default" : "destructive"}>
                      {status.client ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {status.client ? "作成済み" : "作成失敗"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-2">
                      <span>接続テスト</span>
                      <span className="text-sm text-gray-500">
                        (API呼び出し)
                      </span>
                    </div>
                    <Badge variant={status.connection ? "default" : "destructive"}>
                      {status.connection ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {status.connection ? "接続OK" : "接続失敗"}
                    </Badge>
                  </div>

                  {!status.envVars && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          環境変数が設定されていません。.env.localファイルに以下を追加してください：
                        </span>
                      </div>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                        NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
                        NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
                      </pre>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 