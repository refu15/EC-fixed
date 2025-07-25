// 施策テンプレートギャラリーシステム

export interface PolicyTemplate {
  id: string
  name: string
  category: 'referral' | 'coupon' | 'email' | 'sns' | 'retention' | 'acquisition'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  expectedResults: {
    revenue: string
    customers: string
    conversionRate: string
    roi: string
  }
  steps: TemplateStep[]
  prerequisites: string[]
  estimatedTime: string
  cost: string
  tags: string[]
  isRecommended: boolean
  successRate: number
}

export interface TemplateStep {
  id: string
  title: string
  description: string
  action: string
  estimatedTime: string
  isRequired: boolean
  tips: string[]
}

// デフォルトテンプレート
export const POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: 'referral-campaign-basic',
    name: '友達紹介キャンペーン（初級）',
    category: 'referral',
    difficulty: 'beginner',
    description: 'LINE公式アカウントを使った簡単な友達紹介キャンペーン。新規顧客獲得とリピート率向上を同時に実現。',
    expectedResults: {
      revenue: '+15%',
      customers: '+20%',
      conversionRate: '+8%',
      roi: '18.5倍'
    },
    steps: [
      {
        id: 'step1',
        title: 'LINE公式アカウント設定',
        description: 'LINE公式アカウントの基本設定を行います',
        action: 'LINE公式アカウント作成・設定',
        estimatedTime: '30分',
        isRequired: true,
        tips: [
          'プロフィール画像は商品画像を使用',
          '自己紹介文に紹介キャンペーンの説明を追加',
          'QRコードを店舗に設置'
        ]
      },
      {
        id: 'step2',
        title: '紹介報酬の設定',
        description: '紹介者と被紹介者への報酬を設定します',
        action: 'クーポン作成・報酬設定',
        estimatedTime: '15分',
        isRequired: true,
        tips: [
          '紹介者：1,000円クーポン',
          '被紹介者：500円クーポン',
          '利用条件は明確に設定'
        ]
      },
      {
        id: 'step3',
        title: '紹介リンクの作成',
        description: '追跡可能な紹介リンクを作成します',
        action: '紹介リンク生成',
        estimatedTime: '10分',
        isRequired: true,
        tips: [
          '短縮URLを使用',
          'UTMパラメータを設定',
          'リンクの有効期限を設定'
        ]
      },
      {
        id: 'step4',
        title: '告知・プロモーション',
        description: '既存顧客に紹介キャンペーンを告知します',
        action: 'メール配信・SNS投稿',
        estimatedTime: '20分',
        isRequired: true,
        tips: [
          '既存顧客向けメール配信',
          'SNSでの告知投稿',
          '店舗内での告知'
        ]
      }
    ],
    prerequisites: [
      'LINE公式アカウント',
      'クーポン管理システム',
      '既存顧客データ'
    ],
    estimatedTime: '1時間15分',
    cost: '初期費用：無料',
    tags: ['新規顧客獲得', 'リピート率向上', 'LINE', '紹介'],
    isRecommended: true,
    successRate: 85
  },
  {
    id: 'welcome-coupon-strategy',
    name: '新規顧客限定クーポン戦略',
    category: 'coupon',
    difficulty: 'beginner',
    description: '新規顧客の初回購入を促進し、リピート率を向上させるクーポン戦略。',
    expectedResults: {
      revenue: '+12%',
      customers: '+25%',
      conversionRate: '+10%',
      roi: '3.2倍'
    },
    steps: [
      {
        id: 'step1',
        title: 'クーポン設計',
        description: '新規顧客向けのクーポンを設計します',
        action: 'クーポン内容決定',
        estimatedTime: '20分',
        isRequired: true,
        tips: [
          '割引率：10-20%',
          '最低購入金額：1,000円',
          '有効期限：30日',
          '利用回数：1回限定'
        ]
      },
      {
        id: 'step2',
        title: 'クーポン作成',
        description: 'ECプラットフォームでクーポンを作成します',
        action: 'クーポン作成・設定',
        estimatedTime: '15分',
        isRequired: true,
        tips: [
          'クーポンコード：WELCOME1000',
          '自動配布設定',
          '利用条件の確認'
        ]
      },
      {
        id: 'step3',
        title: 'ランディングページ作成',
        description: '新規顧客向けの専用ページを作成します',
        action: 'ページ作成・設定',
        estimatedTime: '30分',
        isRequired: false,
        tips: [
          'クーポン紹介ページ',
          '商品紹介',
          '利用手順説明'
        ]
      },
      {
        id: 'step4',
        title: '配信・告知',
        description: '新規顧客にクーポンを配信します',
        action: 'メール配信・広告出稿',
        estimatedTime: '25分',
        isRequired: true,
        tips: [
          '新規登録時メール',
          'SNS広告',
          '検索広告'
        ]
      }
    ],
    prerequisites: [
      'ECプラットフォーム',
      'クーポン機能',
      'メール配信システム'
    ],
    estimatedTime: '1時間30分',
    cost: '初期費用：無料',
    tags: ['新規顧客', 'クーポン', 'CVR向上', '初回購入'],
    isRecommended: true,
    successRate: 78
  },
  {
    id: 'cart-abandonment-email',
    name: 'カート放棄メール戦略',
    category: 'email',
    difficulty: 'intermediate',
    description: 'カート放棄した顧客を回収し、売上を向上させるメール戦略。',
    expectedResults: {
      revenue: '+8%',
      customers: '+5%',
      conversionRate: '+15%',
      roi: '12.5倍'
    },
    steps: [
      {
        id: 'step1',
        title: '放棄データの分析',
        description: 'カート放棄の原因を分析します',
        action: 'データ分析・原因特定',
        estimatedTime: '30分',
        isRequired: true,
        tips: [
          '放棄率の算出',
          '放棄タイミングの分析',
          '商品別放棄率の確認'
        ]
      },
      {
        id: 'step2',
        title: 'メールテンプレート作成',
        description: '効果的なメールテンプレートを作成します',
        action: 'テンプレート作成',
        estimatedTime: '45分',
        isRequired: true,
        tips: [
          '3段階のメール配信',
          'パーソナライズ',
          'クーポン付与'
        ]
      },
      {
        id: 'step3',
        title: '配信タイミング設定',
        description: '最適な配信タイミングを設定します',
        action: '配信スケジュール設定',
        estimatedTime: '20分',
        isRequired: true,
        tips: [
          '1時間後：リマインダー',
          '24時間後：特別オファー',
          '72時間後：最終案内'
        ]
      },
      {
        id: 'step4',
        title: '効果測定・改善',
        description: 'メールの効果を測定し改善します',
        action: '効果測定・A/Bテスト',
        estimatedTime: '30分',
        isRequired: false,
        tips: [
          '開封率・クリック率測定',
          'A/Bテスト実施',
          '継続的な改善'
        ]
      }
    ],
    prerequisites: [
      'メール配信システム',
      'カート放棄データ',
      '顧客データベース'
    ],
    estimatedTime: '2時間5分',
    cost: '初期費用：無料',
    tags: ['カート放棄', 'メール', '回収', 'CVR向上'],
    isRecommended: false,
    successRate: 72
  },
  {
    id: 'instagram-story-campaign',
    name: 'Instagramストーリー活用戦略',
    category: 'sns',
    difficulty: 'intermediate',
    description: 'Instagramストーリーを活用した商品紹介と集客戦略。',
    expectedResults: {
      revenue: '+18%',
      customers: '+30%',
      conversionRate: '+12%',
      roi: '22.3倍'
    },
    steps: [
      {
        id: 'step1',
        title: 'アカウント最適化',
        description: 'Instagramアカウントを最適化します',
        action: 'プロフィール・ハイライト設定',
        estimatedTime: '40分',
        isRequired: true,
        tips: [
          'プロフィール画像の最適化',
          'ハイライトの整理',
          'ストーリーハイライトの設定'
        ]
      },
      {
        id: 'step2',
        title: 'コンテンツ戦略策定',
        description: '効果的なコンテンツ戦略を策定します',
        action: 'コンテンツ計画作成',
        estimatedTime: '60分',
        isRequired: true,
        tips: [
          '商品紹介ストーリー',
          'ユーザー生成コンテンツ',
          'バックステージ動画'
        ]
      },
      {
        id: 'step3',
        title: 'ストーリー作成・投稿',
        description: '定期的なストーリー投稿を開始します',
        action: 'ストーリー作成・投稿',
        estimatedTime: '30分',
        isRequired: true,
        tips: [
          '毎日1-2本の投稿',
          '商品リンクの追加',
          'インタラクティブ要素'
        ]
      },
      {
        id: 'step4',
        title: 'エンゲージメント向上',
        description: 'フォロワーとのエンゲージメントを向上させます',
        action: 'コメント返信・DM対応',
        estimatedTime: '20分',
        isRequired: false,
        tips: [
          'コメントへの迅速な返信',
          'DMでの個別対応',
          'ユーザーとの関係構築'
        ]
      }
    ],
    prerequisites: [
      'Instagramビジネスアカウント',
      '商品画像・動画',
      'ストーリー作成スキル'
    ],
    estimatedTime: '2時間30分',
    cost: '初期費用：無料',
    tags: ['Instagram', 'SNS', '集客', 'ブランディング'],
    isRecommended: false,
    successRate: 68
  }
]

// カテゴリ別テンプレート取得
export function getTemplatesByCategory(category: string): PolicyTemplate[] {
  return POLICY_TEMPLATES.filter(template => template.category === category)
}

// 難易度別テンプレート取得
export function getTemplatesByDifficulty(difficulty: string): PolicyTemplate[] {
  return POLICY_TEMPLATES.filter(template => template.difficulty === difficulty)
}

// 推奨テンプレート取得
export function getRecommendedTemplates(): PolicyTemplate[] {
  return POLICY_TEMPLATES.filter(template => template.isRecommended)
}

// タグ別テンプレート取得
export function getTemplatesByTag(tag: string): PolicyTemplate[] {
  return POLICY_TEMPLATES.filter(template => template.tags.includes(tag))
}

// テンプレート実行プラン生成
export function generateExecutionPlan(template: PolicyTemplate): {
  timeline: string
  milestones: string[]
  risks: string[]
  successFactors: string[]
} {
  const totalSteps = template.steps.length
  const estimatedHours = parseFloat(template.estimatedTime.replace('時間', '').replace('分', '')) / 60

  const timeline = `${Math.ceil(estimatedHours)}日間の実行プラン`
  
  const milestones = template.steps.map((step, index) => 
    `Day ${index + 1}: ${step.title}`
  )

  const risks = [
    '時間的制約による実行の遅れ',
    '予算オーバー',
    '期待効果の未達',
    '技術的な問題'
  ]

  const successFactors = [
    '段階的な実行',
    '定期的な効果測定',
    '柔軟な調整',
    'チーム内での共有'
  ]

  return {
    timeline,
    milestones,
    risks,
    successFactors
  }
}

// テンプレート適合性スコア計算
export function calculateTemplateFit(template: PolicyTemplate, userProfile: {
  experience: 'beginner' | 'intermediate' | 'advanced'
  timeAvailable: 'low' | 'medium' | 'high'
  budget: 'low' | 'medium' | 'high'
  goals: string[]
}): number {
  let score = 0

  // 経験レベルとの適合性
  if (template.difficulty === userProfile.experience) {
    score += 30
  } else if (
    (template.difficulty === 'beginner' && userProfile.experience === 'intermediate') ||
    (template.difficulty === 'intermediate' && userProfile.experience === 'advanced')
  ) {
    score += 20
  } else {
    score += 10
  }

  // 時間的制約との適合性
  const estimatedHours = parseFloat(template.estimatedTime.replace('時間', '').replace('分', '')) / 60
  if (userProfile.timeAvailable === 'high' || estimatedHours <= 2) {
    score += 25
  } else if (userProfile.timeAvailable === 'medium' && estimatedHours <= 4) {
    score += 20
  } else {
    score += 10
  }

  // 予算との適合性
  if (template.cost.includes('無料') || userProfile.budget === 'high') {
    score += 25
  } else if (userProfile.budget === 'medium') {
    score += 15
  } else {
    score += 5
  }

  // 目標との適合性
  const goalMatch = userProfile.goals.filter(goal => 
    template.tags.some(tag => tag.includes(goal))
  ).length
  score += (goalMatch / userProfile.goals.length) * 20

  return Math.min(score, 100)
}

// パーソナライズされた推奨テンプレート取得
export function getPersonalizedRecommendations(userProfile: {
  experience: 'beginner' | 'intermediate' | 'advanced'
  timeAvailable: 'low' | 'medium' | 'high'
  budget: 'low' | 'medium' | 'high'
  goals: string[]
}): PolicyTemplate[] {
  const scoredTemplates = POLICY_TEMPLATES.map(template => ({
    template,
    score: calculateTemplateFit(template, userProfile)
  }))

  return scoredTemplates
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.template)
} 