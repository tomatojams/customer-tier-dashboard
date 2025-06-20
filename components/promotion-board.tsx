"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, Eye, Edit, Trash2, Filter } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Promotion {
  id: string
  name: string
  description: string
  status: "진행중" | "종료됨" | "예정"
  startDate: Date
  endDate: Date
  createdAt: Date
}

const mockPromotions: Promotion[] = [
  {
    id: "1",
    name: "신제품 출시 기념 할인",
    description: "히알 알파 신제품 출시를 기념한 특별 할인 이벤트",
    status: "진행중",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    createdAt: new Date("2023-12-15"),
  },
  {
    id: "2",
    name: "겨울 스킨케어 프로모션",
    description: "겨울철 건조한 피부를 위한 보습 제품 할인",
    status: "종료됨",
    startDate: new Date("2023-12-01"),
    endDate: new Date("2023-12-31"),
    createdAt: new Date("2023-11-20"),
  },
  {
    id: "3",
    name: "봄맞이 클렌징 이벤트",
    description: "봄철 피부 관리를 위한 클렌징 제품 특가",
    status: "예정",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-31"),
    createdAt: new Date("2024-01-10"),
  },
]

export function PromotionBoard() {
  const [promotions] = useState<Promotion[]>(mockPromotions)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [startDateFilter, setStartDateFilter] = useState<Date>()
  const [endDateFilter, setEndDateFilter] = useState<Date>()

  const filteredPromotions = promotions.filter((promotion) => {
    const matchesKeyword =
      promotion.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchKeyword.toLowerCase())

    const matchesStatus = statusFilter === "all" || promotion.status === statusFilter

    const matchesDateRange =
      (!startDateFilter || promotion.startDate >= startDateFilter) &&
      (!endDateFilter || promotion.endDate <= endDateFilter)

    return matchesKeyword && matchesStatus && matchesDateRange
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-green-100 text-green-800"
      case "종료됨":
        return "bg-gray-100 text-gray-800"
      case "예정":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>프로모션 게시판</CardTitle>
          <CardDescription>생성된 프로모션을 검색하고 관리할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 검색 및 필터 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 키워드 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="프로모션 이름 또는 설명 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 상태 필터 */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="진행중">진행중</SelectItem>
                <SelectItem value="예정">예정</SelectItem>
                <SelectItem value="종료됨">종료됨</SelectItem>
              </SelectContent>
            </Select>

            {/* 시작일 필터 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !startDateFilter && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDateFilter ? format(startDateFilter, "PPP", { locale: ko }) : "시작일 필터"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDateFilter} onSelect={setStartDateFilter} initialFocus />
              </PopoverContent>
            </Popover>

            {/* 종료일 필터 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !endDateFilter && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDateFilter ? format(endDateFilter, "PPP", { locale: ko }) : "종료일 필터"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDateFilter} onSelect={setEndDateFilter} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* 필터 초기화 버튼 */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              총 {filteredPromotions.length}개의 프로모션이 검색되었습니다.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchKeyword("")
                setStatusFilter("all")
                setStartDateFilter(undefined)
                setEndDateFilter(undefined)
              }}
            >
              <Filter className="h-4 w-4 mr-1" />
              필터 초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 프로모션 목록 테이블 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">프로모션 이름</TableHead>
                  <TableHead className="font-semibold">설명</TableHead>
                  <TableHead className="font-semibold">상태</TableHead>
                  <TableHead className="font-semibold">시작일</TableHead>
                  <TableHead className="font-semibold">종료일</TableHead>
                  <TableHead className="font-semibold">생성일</TableHead>
                  <TableHead className="w-[200px] font-semibold">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{promotion.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{promotion.description}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(promotion.status)}>{promotion.status}</Badge>
                    </TableCell>
                    <TableCell>{format(promotion.startDate, "yyyy-MM-dd")}</TableCell>
                    <TableCell>{format(promotion.endDate, "yyyy-MM-dd")}</TableCell>
                    <TableCell>{format(promotion.createdAt, "yyyy-MM-dd")}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
