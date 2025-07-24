export interface Proposal {
  id: string
  title: string
  description: string
  createdAt: string // ISO date
  expectedROI: number
  status: "pending" | "approved" | "executed"
}

export const proposals: Proposal[] = [
  {
    id: "email_reengage",
    title: "休眠顧客再活性メール",
    description: "90日間購入がない顧客へクーポン付きメールを送信し再購入を促進。",
    createdAt: "2025-07-01",
    expectedROI: 450,
    status: "pending",
  },
  {
    id: "sms_flash_sale",
    title: "SMS フラッシュセール",
    description: "週末限定で20%OFFセールをSMSで告知。",
    createdAt: "2025-06-20",
    expectedROI: 380,
    status: "approved",
  },
  {
    id: "ab_test_checkout",
    title: "チェックアウト UI A/B テスト",
    description: "簡易チェックアウト vs 現行フローで転換率を比較。",
    createdAt: "2025-05-15",
    expectedROI: 290,
    status: "executed",
  },
]
