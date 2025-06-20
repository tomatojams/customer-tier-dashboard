"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, UserPlus, Award, PieChart, CreditCard } from "lucide-react"

interface StatCard {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ElementType
  description?: string
}

const statsData: StatCard[] = [
  {
    title: "이번 달 총 매출",
    value: "₩32,430,000",
    change: "+12.3%",
    changeType: "positive",
    icon: DollarSign,
    description: "전월 대비",
  },
  {
    title: "신규 주문 건수",
    value: "124건",
    change: "+8.7%",
    changeType: "positive",
    icon: ShoppingBag,
    description: "전월 대비",
  },
  {
    title: "신규 가입 고객",
    value: "17명",
    change: "-5.4%",
    changeType: "negative",
    icon: UserPlus,
    description: "전월 대비",
  },
  {
    title: "가장 많이 판매된 상품",
    value: "히알 알파",
    change: "328개 판매",
    changeType: "neutral",
    icon: Award,
    description: "이번 달",
  },
  {
    title: "브론즈 등급 고객 비율",
    value: "42.6%",
    change: "+2.1%",
    changeType: "positive",
    icon: PieChart,
    description: "전월 대비",
  },
  {
    title: "평균 객단가",
    value: "₩261,000",
    change: "+3.1%",
    changeType: "positive",
    icon: CreditCard,
    description: "전월 대비",
  },
]

export function DashboardSummary() {
  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return "text-green-600 bg-green-50"
      case "negative":
        return "text-red-600 bg-red-50"
      default:
        return "text-blue-600 bg-blue-50"
    }
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3" />
      case "negative":
        return <TrendingDown className="h-3 w-3" />
      default:
        return null
    }
  }

  const getIconColor = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return "text-green-600 bg-green-100"
      case "negative":
        return "text-red-600 bg-red-100"
      default:
        return "text-blue-600 bg-blue-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">요약 통계</h1>
        <p className="text-gray-600 mt-2">주요 비즈니스 지표를 한눈에 확인하세요.</p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${getIconColor(stat.changeType)}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* 메인 값 */}
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>

                {/* 변화율 또는 추가 정보 */}
                <div className="flex items-center gap-2">
                  <Badge className={`${getChangeColor(stat.changeType)} border-0 text-xs font-medium px-2 py-1`}>
                    <div className="flex items-center gap-1">
                      {getChangeIcon(stat.changeType)}
                      <span>{stat.change}</span>
                    </div>
                  </Badge>
                  {stat.description && <span className="text-xs text-gray-500">{stat.description}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 추가 정보 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* 월별 매출 트렌드 */}
        <Card>
          <CardHeader>
            <CardTitle>월별 매출 트렌드</CardTitle>
            <CardDescription>최근 6개월간 매출 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: "1월", amount: "₩28,500,000", growth: "+5.2%" },
                { month: "2월", amount: "₩31,200,000", growth: "+9.5%" },
                { month: "3월", amount: "₩29,800,000", growth: "-4.5%" },
                { month: "4월", amount: "₩33,100,000", growth: "+11.1%" },
                { month: "5월", amount: "₩28,900,000", growth: "-12.7%" },
                { month: "6월", amount: "₩32,430,000", growth: "+12.3%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">{item.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{item.amount}</span>
                    <Badge
                      className={`${
                        item.growth.startsWith("+") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                      } border-0 text-xs`}
                    >
                      {item.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 고객 등급 분포 */}
        <Card>
          <CardHeader>
            <CardTitle>고객 등급 분포</CardTitle>
            <CardDescription>현재 등록된 고객의 등급별 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { tier: "브론즈", count: 89, percentage: 42.6, color: "bg-amber-600" },
                { tier: "실버", count: 52, percentage: 24.9, color: "bg-gray-400" },
                { tier: "골드", count: 38, percentage: 18.2, color: "bg-yellow-500" },
                { tier: "플래티넘", count: 21, percentage: 10.0, color: "bg-slate-300" },
                { tier: "다이아몬드", count: 9, percentage: 4.3, color: "bg-blue-400" },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium">{item.tier}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{item.count}명</span>
                      <span className="text-sm font-semibold">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 빠른 액션 */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 액션</CardTitle>
          <CardDescription>자주 사용하는 기능에 빠르게 접근하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "새 상품 등록", description: "상품 추가", icon: "📦" },
              { title: "고객 등록", description: "신규 고객", icon: "👤" },
              { title: "프로모션 생성", description: "이벤트 기획", icon: "🎯" },
              { title: "재고 확인", description: "재고 현황", icon: "📊" },
            ].map((action, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">{action.icon}</div>
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
