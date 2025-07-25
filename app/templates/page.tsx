"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  BookOpen, 
  Target, 
  Clock, 
  DollarSign, 
  TrendingUp,
  ArrowLeft,
  Search,
  Filter,
  Star,
  Play,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Users,
  BarChart3,
  Calendar,
  Award,
  Zap,
  Bookmark,
  Share2
} from "lucide-react"
import Link from "next/link"
import { 
  POLICY_TEMPLATES, 
  getTemplatesByCategory, 
  getTemplatesByDifficulty,
  getRecommendedTemplates,
  getPersonalizedRecommendations,
  generateExecutionPlan,
  type PolicyTemplate
} from "@/lib/templates"

export default function Templates() {
  const [templates, setTemplates] = useState<PolicyTemplate[]>(POLICY_TEMPLATES)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null)
  const [showTemplateDetail, setShowTemplateDetail] = useState(false)
  const [userProfile, setUserProfile] = useState({
    experience: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    timeAvailable: 'medium' as 'low' | 'medium' | 'high',
    budget: 'low' as 'low' | 'medium' | 'high',
    goals: ['新規顧客獲得', '売上向上']
  })

  // フィルタリング
  useEffect(() => {
    let filtered = POLICY_TEMPLATES

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(template => template.difficulty === selectedDifficulty)
    }

    if (searchQuery) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setTemplates(filtered)
  }, [selectedCategory, selectedDifficulty, searchQuery])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '初級'
      case 'intermediate':
        return '中級'
      case 'advanced':
        return '上級'
      default:
        return '不明'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'referral':
        return <Users className="h-4 w-4" />
      case 'coupon':
        return <DollarSign className="h-4 w-4" />
      case 'email':
        return <BookOpen className="h-4 w-4" />
      case 'sns':
        return <Share2 className="h-4 w-4" />
      case 'retention':
        return <Target className="h-4 w-4" />
      case 'acquisition':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'referral':
        return '紹介'
      case 'coupon':
        return 'クーポン'
      case 'email':
        return 'メール'
      case 'sns':
        return 'SNS'
      case 'retention':
        return 'リテンション'
      case 'acquisition':
        return '集客'
      default:
        return 'その他'
    }
  }

  const handleTemplateSelect = (template: PolicyTemplate) => {
    setSelectedTemplate(template)
    setShowTemplateDetail(true)
  }

  const personalizedRecommendations = getPersonalizedRecommendations(userProfile)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ダッシュボード
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">施策テンプレートギャラリー</h1>
            <p className="text-gray-500">初心者でも迷わず実行できる施策テンプレート集</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            お気に入り
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            共有
          </Button>
        </div>
      </header>

      {/* パーソナライズ推奨 */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-blue-600" />
            あなたにおすすめの施策
          </CardTitle>
          <CardDescription>
            あなたの経験レベルと目標に合わせた最適な施策をご提案します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personalizedRecommendations.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleTemplateSelect(template)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {getDifficultyLabel(template.difficulty)}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>期待売上</span>
                      <span className="font-medium text-green-600">{template.expectedResults.revenue}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>成功率</span>
                      <span className="font-medium text-blue-600">{template.successRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>所要時間</span>
                      <span className="font-medium text-gray-600">{template.estimatedTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* フィルター・検索 */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">カテゴリ</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="referral">紹介</SelectItem>
                  <SelectItem value="coupon">クーポン</SelectItem>
                  <SelectItem value="email">メール</SelectItem>
                  <SelectItem value="sns">SNS</SelectItem>
                  <SelectItem value="retention">リテンション</SelectItem>
                  <SelectItem value="acquisition">集客</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">難易度</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="beginner">初級</SelectItem>
                  <SelectItem value="intermediate">中級</SelectItem>
                  <SelectItem value="advanced">上級</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="施策名やタグで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedDifficulty('all')
                  setSearchQuery('')
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                リセット
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* テンプレート一覧 */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">すべて ({templates.length})</TabsTrigger>
          <TabsTrigger value="recommended">推奨 ({getRecommendedTemplates().length})</TabsTrigger>
          <TabsTrigger value="beginner">初級 ({getTemplatesByDifficulty('beginner').length})</TabsTrigger>
          <TabsTrigger value="intermediate">中級 ({getTemplatesByDifficulty('intermediate').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleTemplateSelect(template)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(template.category)}
                      <Badge variant="outline">
                        {getCategoryLabel(template.category)}
                      </Badge>
                    </div>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {getDifficultyLabel(template.difficulty)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-lg font-bold text-green-600">{template.expectedResults.revenue}</div>
                      <div className="text-gray-500">期待売上</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{template.successRate}%</div>
                      <div className="text-gray-500">成功率</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>所要時間</span>
                      <span className="font-medium">{template.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>費用</span>
                      <span className="font-medium">{template.cost}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {template.isRecommended && (
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">推奨</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getRecommendedTemplates().map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer border-yellow-200" onClick={() => handleTemplateSelect(template)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(template.category)}
                      <Badge variant="outline">
                        {getCategoryLabel(template.category)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Star className="h-4 w-4 fill-current" />
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {getDifficultyLabel(template.difficulty)}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-lg font-bold text-green-600">{template.expectedResults.revenue}</div>
                      <div className="text-gray-500">期待売上</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{template.successRate}%</div>
                      <div className="text-gray-500">成功率</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>所要時間</span>
                      <span className="font-medium">{template.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>費用</span>
                      <span className="font-medium">{template.cost}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="beginner" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getTemplatesByDifficulty('beginner').map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer border-green-200" onClick={() => handleTemplateSelect(template)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(template.category)}
                      <Badge variant="outline">
                        {getCategoryLabel(template.category)}
                      </Badge>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      初級
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-lg font-bold text-green-600">{template.expectedResults.revenue}</div>
                      <div className="text-gray-500">期待売上</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{template.successRate}%</div>
                      <div className="text-gray-500">成功率</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>所要時間</span>
                      <span className="font-medium">{template.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>費用</span>
                      <span className="font-medium">{template.cost}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intermediate" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getTemplatesByDifficulty('intermediate').map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer border-yellow-200" onClick={() => handleTemplateSelect(template)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(template.category)}
                      <Badge variant="outline">
                        {getCategoryLabel(template.category)}
                      </Badge>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      中級
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-lg font-bold text-green-600">{template.expectedResults.revenue}</div>
                      <div className="text-gray-500">期待売上</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{template.successRate}%</div>
                      <div className="text-gray-500">成功率</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>所要時間</span>
                      <span className="font-medium">{template.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>費用</span>
                      <span className="font-medium">{template.cost}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* テンプレート詳細モーダル */}
      <Dialog open={showTemplateDetail} onOpenChange={setShowTemplateDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  {getCategoryIcon(selectedTemplate.category)}
                  <span className="ml-2">{selectedTemplate.name}</span>
                  <Badge className={`ml-2 ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                    {getDifficultyLabel(selectedTemplate.difficulty)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>{selectedTemplate.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* 期待結果 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      期待される結果
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedTemplate.expectedResults.revenue}</div>
                        <div className="text-sm text-gray-500">売上</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedTemplate.expectedResults.customers}</div>
                        <div className="text-sm text-gray-500">顧客数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedTemplate.expectedResults.conversionRate}</div>
                        <div className="text-sm text-gray-500">CVR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{selectedTemplate.expectedResults.roi}</div>
                        <div className="text-sm text-gray-500">ROI</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 実行ステップ */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Play className="h-5 w-5 mr-2" />
                      実行ステップ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedTemplate.steps.map((step, index) => (
                        <div key={step.id} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Step {index + 1}: {step.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{step.estimatedTime}</Badge>
                              {step.isRequired && (
                                <Badge className="bg-red-100 text-red-800">必須</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          <div className="mt-2">
                            <div className="text-sm font-medium text-gray-700">アクション:</div>
                            <p className="text-sm text-gray-600">{step.action}</p>
                          </div>
                          {step.tips.length > 0 && (
                            <div className="mt-2">
                              <div className="text-sm font-medium text-gray-700">コツ:</div>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {step.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex} className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 前提条件 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      前提条件
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedTemplate.prerequisites.map((prerequisite, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{prerequisite}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 実行プラン */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      実行プラン
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const plan = generateExecutionPlan(selectedTemplate)
                      return (
                        <div className="space-y-4">
                          <div>
                            <div className="font-medium text-gray-700">タイムライン:</div>
                            <p className="text-sm text-gray-600">{plan.timeline}</p>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">マイルストーン:</div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {plan.milestones.map((milestone, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{milestone}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>

                {/* アクションボタン */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowTemplateDetail(false)}>
                    閉じる
                  </Button>
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    この施策を開始
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 