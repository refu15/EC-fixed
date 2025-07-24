// Sample customer analytics data for MVP demo
// 顧客分析ダッシュボード用のサンプルデータ
export const customerKpis = {
  totalCustomers: 12450,
  totalRevenue: 2450000,
  conversionRate: 3.24, // %
  averageOrderValue: 8750, // 円
}

// 年齢層の分布 (yearsOldRange -> count)
export const ageDistribution = [
  { range: "18-24", value: 1550 },
  { range: "25-34", value: 4020 },
  { range: "35-44", value: 3170 },
  { range: "45-54", value: 2100 },
  { range: "55+", value: 1610 },
]

// 地域分布（都道府県 / その他）
export const regionDistribution = [
  { region: "東京", value: 38 }, // %
  { region: "大阪", value: 14 },
  { region: "神奈川", value: 11 },
  { region: "愛知", value: 7 },
  { region: "その他", value: 30 },
]
