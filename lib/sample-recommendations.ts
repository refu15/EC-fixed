// Sample data for product recommendations page
export interface Recommendation {
  id: string
  title: string
  description: string
  revenueContribution: number // yen
  crossSell: string[]
}

export const recommendations: Recommendation[] = [
  {
    id: "wireless_earbuds",
    title: "ワイヤレスイヤホン",
    description: "リピート率が高い人気商品。スマホアクセサリと相性◎",
    revenueContribution: 1380000,
    crossSell: ["スマホケース", "充電器", "シリコンカバー"],
  },
  {
    id: "phone_case",
    title: "スマホケース (強化ガラス)",
    description: "主力商品からのクロスセル先として高収益",
    revenueContribution: 820000,
    crossSell: ["保護フィルム", "ストラップ"],
  },
  {
    id: "portable_charger",
    title: "高速ポータブル充電器",
    description: "ギフト需要が高く、バンドル販売で売上向上",
    revenueContribution: 560000,
    crossSell: ["USB-C ケーブル", "収納ポーチ"],
  },
]
