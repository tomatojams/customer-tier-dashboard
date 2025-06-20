"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, Edit, Trash2, Filter } from "lucide-react"

interface Customer {
  id: string
  name: string
  nickname: string
  companyName?: string
  businessNumber?: string
  phoneNumber: string
  address?: string
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
  profileImage?: string
  createdAt: Date
  status: "활성" | "비활성"
}

const customerTiers = [
  { value: "bronze", label: "브론즈", color: "bg-amber-600" },
  { value: "silver", label: "실버", color: "bg-gray-400" },
  { value: "gold", label: "골드", color: "bg-yellow-500" },
  { value: "platinum", label: "플래티넘", color: "bg-slate-300" },
  { value: "diamond", label: "다이아몬드", color: "bg-blue-400" },
]

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "김철수",
    nickname: "철수킴",
    companyName: "㈜뷰티코스메틱",
    businessNumber: "123-45-67890",
    phoneNumber: "010-1234-5678",
    address: "서울시 강남구 테헤란로 123",
    tier: "diamond",
    createdAt: new Date("2024-01-15"),
    status: "활성",
  },
  {
    id: "2",
    name: "이영희",
    nickname: "영희리",
    companyName: "스킨케어플러스",
    businessNumber: "234-56-78901",
    phoneNumber: "010-2345-6789",
    address: "서울시 서초구 서초대로 456",
    tier: "platinum",
    createdAt: new Date("2024-01-10"),
    status: "활성",
  },
  {
    id: "3",
    name: "박민수",
    nickname: "민수박",
    phoneNumber: "010-3456-7890",
    address: "부산시 해운대구 해운대로 789",
    tier: "gold",
    createdAt: new Date("2024-01-08"),
    status: "활성",
  },
  {
    id: "4",
    name: "정수진",
    nickname: "수진정",
    companyName: "코스메틱월드",
    businessNumber: "345-67-89012",
    phoneNumber: "010-4567-8901",
    address: "대구시 중구 중앙대로 321",
    tier: "silver",
    createdAt: new Date("2024-01-05"),
    status: "활성",
  },
  {
    id: "5",
    name: "최동현",
    nickname: "동현최",
    phoneNumber: "010-5678-9012",
    address: "인천시 남동구 구월로 654",
    tier: "bronze",
    createdAt: new Date("2024-01-03"),
    status: "비활성",
  },
]

export function CustomerList() {
  const [customers] = useState<Customer[]>(mockCustomers)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredCustomers = customers.filter((customer) => {
    const matchesKeyword =
      customer.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      customer.nickname.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      customer.phoneNumber.includes(searchKeyword) ||
      (customer.companyName && customer.companyName.toLowerCase().includes(searchKeyword.toLowerCase()))

    const matchesTier = tierFilter === "all" || customer.tier === tierFilter
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesKeyword && matchesTier && matchesStatus
  })

  const getTierInfo = (tier: string) => {
    return customerTiers.find((t) => t.value === tier) || customerTiers[0]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "활성":
        return "bg-green-100 text-green-800"
      case "비활성":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>고객 목록</CardTitle>
          <CardDescription>등록된 고객을 검색하고 관리할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 검색 및 필터 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 키워드 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="이름, 닉네임, 전화번호, 회사명 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 고객등급 필터 */}
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="고객등급 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 등급</SelectItem>
                {customerTiers.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${tier.color}`} />
                      <span>{tier.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 상태 필터 */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="활성">활성</SelectItem>
                <SelectItem value="비활성">비활성</SelectItem>
              </SelectContent>
            </Select>

            {/* 필터 초기화 */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchKeyword("")
                setTierFilter("all")
                setStatusFilter("all")
              }}
            >
              <Filter className="h-4 w-4 mr-1" />
              필터 초기화
            </Button>
          </div>

          {/* 검색 결과 요약 */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">총 {filteredCustomers.length}명의 고객이 검색되었습니다.</p>
          </div>
        </CardContent>
      </Card>

      {/* 고객 목록 테이블 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">고객정보</TableHead>
                  <TableHead className="font-semibold">닉네임</TableHead>
                  <TableHead className="font-semibold">회사명</TableHead>
                  <TableHead className="font-semibold">전화번호</TableHead>
                  <TableHead className="font-semibold">고객등급</TableHead>
                  <TableHead className="font-semibold">상태</TableHead>
                  <TableHead className="font-semibold">등록일</TableHead>
                  <TableHead className="w-[200px] font-semibold">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const tierInfo = getTierInfo(customer.tier)
                  return (
                    <TableRow key={customer.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={customer.profileImage || "/placeholder.svg"} alt={customer.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {customer.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            {customer.businessNumber && (
                              <div className="text-xs text-gray-500">{customer.businessNumber}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{customer.nickname}</TableCell>
                      <TableCell>{customer.companyName || "-"}</TableCell>
                      <TableCell>{customer.phoneNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${tierInfo.color}`} />
                          <span className="font-medium">{tierInfo.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            상세
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            수정
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4 mr-1" />
                            삭제
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
