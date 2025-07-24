// Sample scenarios for AI scenario analysis UI
export interface Scenario {
  id: string
  title: string
  description: string
  expectedRevenue: number // yen
  expectedCost: number // yen
  expectedROI: number // percent
  confidence: number // percent
}

export const scenarios: Scenario[] = [
  {
    id: "summer_sale",
    title: "サマーセール 10%OFF + 無料配送",
    description:
      "全顧客向けに10%割引クーポンと無料配送を提供。期間限定3週間。",
    expectedRevenue: 3200000,
    expectedCost: 400000,
    expectedROI: 700,
    confidence: 82,
  },
  {
    id: "member_get_member",
    title: "会員紹介プログラム強化",
    description:
      "既存会員が友人を紹介すると両者に500ポイント付与するキャンペーン。",
    expectedRevenue: 1250000,
    expectedCost: 150000,
    expectedROI: 733,
    confidence: 77,
  },
  {
    id: "bundle_campaign",
    title: "人気スマホアクセサリ3点バンドル販売",
    description:
      "イヤホン・ケース・充電器をセットで15%割引。SNS広告も実施。",
    expectedRevenue: 2100000,
    expectedCost: 350000,
    expectedROI: 500,
    confidence: 80,
  },
]
