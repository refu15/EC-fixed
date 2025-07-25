// AI解析失敗時のフォールバック機能

export interface SampleReport {
  id: string
  title: string
  content: string
  category: 'kpi' | 'referral' | 'coupon' | 'general'
  timestamp: Date
}

// サンプルレポートデータ
export const SAMPLE_REPORTS: SampleReport[] = [
  {
    id: 'sample-1',
    title: '売上向上のための施策提案',
    content: `現在の売上状況を分析した結果、以下の施策が効果的と考えられます：

1. **紹介プログラムの強化**
   - 現在の紹介完了率78%を85%以上に向上
   - 紹介報酬を1,000円から1,500円に増額
   - 期待効果：月間売上+15%

2. **クーポン戦略の最適化**
   - 新規顧客限定クーポンの利用率向上
   - リピート顧客向けの段階的割引導入
   - 期待効果：CVR+8%、AOV+5%

3. **SNS拡散の促進**
   - LINE公式アカウントでの紹介キャンペーン
   - Instagramストーリーでの商品紹介
   - 期待効果：新規顧客+20%`,
    category: 'kpi',
    timestamp: new Date()
  },
  {
    id: 'sample-2',
    title: '紹介ネットワーク分析レポート',
    content: `紹介ネットワークの現状分析：

**現在の状況**
- 総紹介数：23件
- 完了率：78.3%
- 平均報酬：1,000円
- 総売上貢献：456,000円

**改善提案**
1. **LINE経由の紹介強化**
   - 現在の12件を20件以上に増加
   - LINE公式アカウントでの積極的な紹介促進
   - 期待効果：紹介数+67%

2. **紹介完了率の向上**
   - 紹介プロセスの簡素化
   - 自動フォローアップメールの導入
   - 期待効果：完了率85%以上

3. **報酬体系の見直し**
   - 段階的報酬制度の導入
   - 紹介者向けの特典追加
   - 期待効果：紹介意欲向上`,
    category: 'referral',
    timestamp: new Date()
  },
  {
    id: 'sample-3',
    title: 'クーポン効果分析レポート',
    content: `クーポン利用状況の詳細分析：

**現在の状況**
- 有効クーポン：4種類
- 総利用回数：89回
- 利用率：62.3%
- 売上貢献：356,000円

**改善提案**
1. **新規顧客限定クーポンの最適化**
   - 現在の利用率45回を60回以上に向上
   - クーポン金額を1,000円から1,200円に増額
   - 期待効果：新規顧客獲得+25%

2. **友達紹介クーポンの強化**
   - 紹介者・被紹介者両方への特典付与
   - 利用条件の緩和
   - 期待効果：紹介促進+30%

3. **季節限定クーポンの戦略的展開**
   - 夏セールクーポンの効果測定
   - 次期キャンペーンの計画立案
   - 期待効果：季節売上+15%`,
    category: 'coupon',
    timestamp: new Date()
  },
  {
    id: 'sample-4',
    title: '総合成長戦略レポート',
    content: `ECサイトの総合的な成長戦略：

**現状分析**
- 売上：前月比+12.7%（良好）
- 新規顧客：前月比+9.9%（安定）
- CVR：前月比+14.3%（優秀）
- AOV：前月比+2.8%（微増）

**優先施策（ROI順）**
1. **紹介プログラム拡大** (ROI: 19.8倍)
   - 最も効果的な施策
   - 即座に実行推奨

2. **クーポン戦略最適化** (ROI: 3.0倍)
   - 中期的な効果期待
   - 段階的改善推奨

3. **SNS拡散強化** (ROI: 19.5倍)
   - 高ROIだが実行コスト要
   - リソース確保後実行

**今月の目標**
- 売上：+15%
- 新規顧客：+20%
- 紹介完了率：85%以上`,
    category: 'general',
    timestamp: new Date()
  }
]

// カテゴリ別のサンプルレポート取得
export function getSampleReportsByCategory(category: string): SampleReport[] {
  return SAMPLE_REPORTS.filter(report => report.category === category)
}

// 最新のサンプルレポート取得
export function getLatestSampleReport(): SampleReport {
  return SAMPLE_REPORTS[0] // 最新のものを返す
}

// ランダムなサンプルレポート取得
export function getRandomSampleReport(): SampleReport {
  const randomIndex = Math.floor(Math.random() * SAMPLE_REPORTS.length)
  return SAMPLE_REPORTS[randomIndex]
}

// エラー別の推奨アクション
export const ERROR_ACTIONS = {
  'api_limit': {
    title: 'API利用制限に達しました',
    actions: [
      {
        label: 'プランをアップグレード',
        description: 'より多くのAPI呼び出しが可能になります',
        action: 'upgrade_plan'
      },
      {
        label: '利用制限を確認',
        description: '現在の利用状況を確認します',
        action: 'check_usage'
      },
      {
        label: 'サンプルレポートを見る',
        description: '事前に用意された分析レポートを表示します',
        action: 'show_sample'
      }
    ]
  },
  'network_error': {
    title: 'ネットワークエラーが発生しました',
    actions: [
      {
        label: '再試行',
        description: '再度AI解析を実行します',
        action: 'retry'
      },
      {
        label: 'サンプルレポートを見る',
        description: '事前に用意された分析レポートを表示します',
        action: 'show_sample'
      },
      {
        label: 'ヘルプを確認',
        description: 'トラブルシューティングガイドを表示します',
        action: 'show_help'
      }
    ]
  },
  'ai_error': {
    title: 'AI解析に失敗しました',
    actions: [
      {
        label: '再試行',
        description: '再度AI解析を実行します',
        action: 'retry'
      },
      {
        label: 'サンプルレポートを見る',
        description: '事前に用意された分析レポートを表示します',
        action: 'show_sample'
      },
      {
        label: '手動分析',
        description: 'データを手動で分析します',
        action: 'manual_analysis'
      }
    ]
  }
}

// エラータイプの判定
export function getErrorType(errorMessage: string): keyof typeof ERROR_ACTIONS {
  if (errorMessage.includes('制限') || errorMessage.includes('limit')) {
    return 'api_limit'
  } else if (errorMessage.includes('ネットワーク') || errorMessage.includes('network')) {
    return 'network_error'
  } else {
    return 'ai_error'
  }
}

// ヘルプ情報
export const HELP_INFO = {
  api_limit: {
    title: 'API利用制限について',
    content: `現在のプランでは1日あたりのAI解析回数に制限があります。

**Freeプラン**: 1日5回
**Personalプラン**: 1日50回  
**Businessプラン**: 1日500回

制限に達した場合は：
1. プランのアップグレード
2. 翌日の利用
3. サンプルレポートの利用

のいずれかを選択してください。`
  },
  network_error: {
    title: 'ネットワークエラーの対処法',
    content: `ネットワークエラーが発生した場合の対処法：

1. **インターネット接続の確認**
   - ブラウザで他のサイトにアクセスできるか確認
   - Wi-Fi接続が安定しているか確認

2. **ブラウザの再読み込み**
   - ページを再読み込みして再試行
   - ブラウザのキャッシュをクリア

3. **時間をおいて再試行**
   - 数分後に再度実行
   - サーバーの負荷が高い可能性があります

4. **サポートへの問い合わせ**
   - 問題が解決しない場合はサポートまでご連絡ください`
  },
  ai_error: {
    title: 'AI解析エラーの対処法',
    content: `AI解析でエラーが発生した場合：

1. **再試行**
   - 一時的なエラーの可能性があります
   - 数秒後に再度実行してください

2. **サンプルレポートの利用**
   - 事前に用意された分析レポートを確認
   - 同様の分析結果を参考にしてください

3. **手動分析**
   - ダッシュボードの数値を手動で確認
   - 主要KPIの変化を分析してください

4. **設定の確認**
   - APIキーの設定を確認
   - 環境変数の設定を確認してください`
  }
} 