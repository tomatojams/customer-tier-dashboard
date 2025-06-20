"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Edit, Trash2, Filter } from "lucide-react"

interface Product {
  id: string
  name: string
  nameEn: string
  category: string
  basePrice: number
  createdAt: Date
  status: "활성" | "비활성"
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "라멜리어 페이스 워시 클렌징 젤",
    nameEn: "Lamelier Face Wash",
    category: "클렌징",
    basePrice: 35000,
    createdAt: new Date("2024-01-15"),
    status: "활성",
  },
  {
    id: "2",
    name: "퍼펙퀵 이레이저 오일 [프리미엄 클렌징 오일]",
    nameEn: "PerfecQuick Eraser Oil [Premium Cleansing Oil]",
    category: "클렌징",
    basePrice: 42000,
    createdAt: new Date("2024-01-10"),
    status: "활성",
  },
  {
    id: "3",
    name: "세라히알 비기닝 [프리미엄 세럼 토너]",
    nameEn: "Cera Hyal Beginning [Premium Serum Toner]",
    category: "토너",
    basePrice: 38000,
    createdAt: new Date("2024-01-08"),
    status: "활성",
  },
  {
    id: "4",
    name: "호호바 쉴드 오일 프리미엄 페이스 오일",
    nameEn: "Jojoba Shield Oil [Premium Face Oil]",
    category: "페이스 오일",
    basePrice: 45000,
    createdAt: new Date("2024-01-05"),
    status: "활성",
  },
  {
    id: "5",
    name: "비타렉트 C15 하이브리드 앰플",
    nameEn: "Vitarect C15 Hybrid Ampoule",
    category: "앰플",
    basePrice: 52000,
    createdAt: new Date("2024-01-03"),
    status: "활성",
  },
  {
    id: "6",
    name: "락트제 세럼",
    nameEn: "LactZe Serum",
    category: "세럼",
    basePrice: 48000,
    createdAt: new Date("2024-01-01"),
    status: "활성",
  },
  {
    id: "7",
    name: "알로줄렌 로션 젤",
    nameEn: "Alo-Zelene Lotion Gel",
    category: "로션",
    basePrice: 32000,
    createdAt: new Date("2023-12-28"),
    status: "활성",
  },
  {
    id: "8",
    name: "토코맥스 20",
    nameEn: "TocoMax 20",
    category: "트리트먼트",
    basePrice: 55000,
    createdAt: new Date("2023-12-25"),
    status: "활성",
  },
  {
    id: "9",
    name: "리노 베리어락 크림",
    nameEn: "Reno BarrierLock Cream",
    category: "크림",
    basePrice: 39000,
    createdAt: new Date("2023-12-22"),
    status: "활성",
  },
  {
    id: "10",
    name: "스플래쉬 다이브 크림",
    nameEn: "Splash Dive Cream",
    category: "크림",
    basePrice: 41000,
    createdAt: new Date("2023-12-20"),
    status: "활성",
  },
  {
    id: "11",
    name: "선디테일러 2.0 스틱",
    nameEn: "Sun Detailer 2.0 Stick",
    category: "선케어",
    basePrice: 28000,
    createdAt: new Date("2023-12-18"),
    status: "활성",
  },
  {
    id: "12",
    name: "선스틸러 하이드로핏 선세럼",
    nameEn: "Sun Stealer Hydrofoil Sun Serum",
    category: "선케어",
    basePrice: 33000,
    createdAt: new Date("2023-12-15"),
    status: "활성",
  },
  {
    id: "13",
    name: "엑소 15698",
    nameEn: "EXO 15698",
    category: "스페셜 케어",
    basePrice: 68000,
    createdAt: new Date("2023-12-12"),
    status: "활성",
  },
  {
    id: "14",
    name: "KP 카밍 부스터",
    nameEn: "KP Calming Booster",
    category: "부스터",
    basePrice: 44000,
    createdAt: new Date("2023-12-10"),
    status: "활성",
  },
  {
    id: "15",
    name: "PN 리젠 부스터",
    nameEn: "PN Regen Booster",
    category: "부스터",
    basePrice: 46000,
    createdAt: new Date("2023-12-08"),
    status: "활성",
  },
  {
    id: "16",
    name: "히알 알파",
    nameEn: "Hyal α",
    category: "세럼",
    basePrice: 50000,
    createdAt: new Date("2023-12-05"),
    status: "활성",
  },
  {
    id: "17",
    name: "바이젝션",
    nameEn: "BY JECTION",
    category: "스페셜 케어",
    basePrice: 72000,
    createdAt: new Date("2023-12-01"),
    status: "활성",
  },
]

export function ProductList() {
  const [products] = useState<Product[]>(mockProducts)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesKeyword =
        product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        product.nameEn.toLowerCase().includes(searchKeyword.toLowerCase())

      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

      return matchesKeyword && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "nameEn":
          return a.nameEn.localeCompare(b.nameEn)
        case "price":
          return b.basePrice - a.basePrice
        case "createdAt":
          return b.createdAt.getTime() - a.createdAt.getTime()
        default:
          return 0
      }
    })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR")
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

  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>상품 목록</CardTitle>
          <CardDescription>등록된 상품을 검색하고 관리할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 검색 및 필터 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 키워드 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="상품명 또는 영문명 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 카테고리 필터 */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 정렬 */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">이름순</SelectItem>
                <SelectItem value="nameEn">영문명순</SelectItem>
                <SelectItem value="price">가격순</SelectItem>
                <SelectItem value="createdAt">등록일순</SelectItem>
              </SelectContent>
            </Select>

            {/* 필터 초기화 */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchKeyword("")
                setCategoryFilter("all")
                setSortBy("name")
              }}
            >
              <Filter className="h-4 w-4 mr-1" />
              필터 초기화
            </Button>
          </div>

          {/* 검색 결과 요약 */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              총 {filteredAndSortedProducts.length}개의 상품이 검색되었습니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 상품 목록 테이블 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">상품명</TableHead>
                  <TableHead className="font-semibold">영문명</TableHead>
                  <TableHead className="font-semibold">카테고리</TableHead>
                  <TableHead className="font-semibold">기본 가격</TableHead>
                  <TableHead className="font-semibold">상태</TableHead>
                  <TableHead className="font-semibold">등록일</TableHead>
                  <TableHead className="w-[200px] font-semibold">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-gray-600">{product.nameEn}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">₩{formatCurrency(product.basePrice)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
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
