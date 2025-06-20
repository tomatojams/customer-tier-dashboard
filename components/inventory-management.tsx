"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Plus,
  Minus,
  CalendarIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  TrendingUp,
  TrendingDown,
  Settings,
} from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

// 상품 목록에서 가져온 데이터 (기존 product-list.tsx와 동일)
interface Product {
  id: string
  name: string
  nameEn: string
  category: string
  basePrice: number
  createdAt: Date
  status: "활성" | "비활성"
}

interface InventoryItem extends Product {
  productCode: string
  currentStock: number
  minStockLevel: number
  stockStatus: "정상" | "부족" | "품절"
  lastRestockDate: Date
}

interface StockTransaction {
  id: string
  date: Date
  type: "입고" | "출고"
  productId: string
  productName: string
  quantity: number
  reason?: string
  memo?: string
  manager: string
}

// 기존 상품 목록 데이터
const baseProducts: Product[] = [
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
]

// 재고 데이터 생성 (상품 목록 기반)
const generateInventoryData = (): InventoryItem[] => {
  return baseProducts.map((product, index) => {
    const currentStock = Math.floor(Math.random() * 200) + 10
    const minStockLevel = 30
    let stockStatus: "정상" | "부족" | "품절" = "정상"

    if (currentStock === 0) stockStatus = "품절"
    else if (currentStock <= minStockLevel) stockStatus = "부족"

    return {
      ...product,
      productCode: `PRD${String(index + 1).padStart(3, "0")}`,
      currentStock,
      minStockLevel,
      stockStatus,
      lastRestockDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    }
  })
}

// 입출고 이력 데이터
const generateTransactionHistory = (): StockTransaction[] => {
  const transactions: StockTransaction[] = []
  const reasons = ["판매", "반품", "손상", "샘플 제공", "이벤트"]

  for (let i = 0; i < 20; i++) {
    const product = baseProducts[Math.floor(Math.random() * baseProducts.length)]
    const isInbound = Math.random() > 0.6

    transactions.push({
      id: `TXN${String(i + 1).padStart(3, "0")}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000),
      type: isInbound ? "입고" : "출고",
      productId: product.id,
      productName: product.name,
      quantity: Math.floor(Math.random() * 50) + 1,
      reason: isInbound ? undefined : reasons[Math.floor(Math.random() * reasons.length)],
      memo: Math.random() > 0.7 ? "정기 입고" : undefined,
      manager: "이지한",
    })
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function InventoryManagement() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(generateInventoryData())
  const [transactionHistory, setTransactionHistory] = useState<StockTransaction[]>(generateTransactionHistory())
  const [searchKeyword, setSearchKeyword] = useState("")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState("name")

  // 입고 처리 상태
  const [inboundProduct, setInboundProduct] = useState("")
  const [inboundQuantity, setInboundQuantity] = useState("")
  const [inboundDate, setInboundDate] = useState<Date>(new Date())
  const [inboundMemo, setInboundMemo] = useState("")

  // 출고 처리 상태
  const [outboundProduct, setOutboundProduct] = useState("")
  const [outboundQuantity, setOutboundQuantity] = useState("")
  const [outboundReason, setOutboundReason] = useState("")

  // 필터링 및 정렬된 재고 데이터
  const filteredInventory = inventoryData
    .filter((item) => {
      const matchesKeyword =
        item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.productCode.toLowerCase().includes(searchKeyword.toLowerCase())

      const matchesFilter =
        stockFilter === "all" ||
        (stockFilter === "out-of-stock" && item.stockStatus === "품절") ||
        (stockFilter === "low-stock" && item.stockStatus === "부족")

      return matchesKeyword && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "stock":
          return b.currentStock - a.currentStock
        case "status":
          return a.stockStatus.localeCompare(b.stockStatus)
        default:
          return 0
      }
    })

  const getStockStatusBadge = (status: string, currentStock: number) => {
    switch (status) {
      case "정상":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            정상
          </Badge>
        )
      case "부족":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            부족
          </Badge>
        )
      case "품절":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            품절
          </Badge>
        )
      default:
        return null
    }
  }

  const handleInboundSubmit = () => {
    if (!inboundProduct || !inboundQuantity) {
      toast({
        title: "입력 오류",
        description: "상품과 수량을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    const quantity = Number.parseInt(inboundQuantity)
    const selectedProduct = inventoryData.find((item) => item.id === inboundProduct)

    if (!selectedProduct) return

    // 재고 업데이트
    setInventoryData((prev) =>
      prev.map((item) => {
        if (item.id === inboundProduct) {
          const newStock = item.currentStock + quantity
          let newStatus: "정상" | "부족" | "품절" = "정상"
          if (newStock === 0) newStatus = "품절"
          else if (newStock <= item.minStockLevel) newStatus = "부족"

          return {
            ...item,
            currentStock: newStock,
            stockStatus: newStatus,
            lastRestockDate: inboundDate,
          }
        }
        return item
      }),
    )

    // 이력 추가
    const newTransaction: StockTransaction = {
      id: `TXN${String(transactionHistory.length + 1).padStart(3, "0")}`,
      date: inboundDate,
      type: "입고",
      productId: inboundProduct,
      productName: selectedProduct.name,
      quantity,
      memo: inboundMemo || undefined,
      manager: "이지한",
    }

    setTransactionHistory((prev) => [newTransaction, ...prev])

    // 폼 초기화
    setInboundProduct("")
    setInboundQuantity("")
    setInboundMemo("")

    toast({
      title: "입고 완료",
      description: `${selectedProduct.name} ${quantity}개가 입고되었습니다.`,
    })
  }

  const handleOutboundSubmit = () => {
    if (!outboundProduct || !outboundQuantity || !outboundReason) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    const quantity = Number.parseInt(outboundQuantity)
    const selectedProduct = inventoryData.find((item) => item.id === outboundProduct)

    if (!selectedProduct) return

    if (selectedProduct.currentStock < quantity) {
      toast({
        title: "재고 부족",
        description: "출고 수량이 현재 재고보다 많습니다.",
        variant: "destructive",
      })
      return
    }

    // 재고 업데이트
    setInventoryData((prev) =>
      prev.map((item) => {
        if (item.id === outboundProduct) {
          const newStock = item.currentStock - quantity
          let newStatus: "정상" | "부족" | "품절" = "정상"
          if (newStock === 0) newStatus = "품절"
          else if (newStock <= item.minStockLevel) newStatus = "부족"

          return {
            ...item,
            currentStock: newStock,
            stockStatus: newStatus,
          }
        }
        return item
      }),
    )

    // 이력 추가
    const newTransaction: StockTransaction = {
      id: `TXN${String(transactionHistory.length + 1).padStart(3, "0")}`,
      date: new Date(),
      type: "출고",
      productId: outboundProduct,
      productName: selectedProduct.name,
      quantity,
      reason: outboundReason,
      manager: "이지한",
    }

    setTransactionHistory((prev) => [newTransaction, ...prev])

    // 폼 초기화
    setOutboundProduct("")
    setOutboundQuantity("")
    setOutboundReason("")

    toast({
      title: "출고 완료",
      description: `${selectedProduct.name} ${quantity}개가 출고되었습니다.`,
    })
  }

  const updateMinStockLevel = (productId: string, newLevel: number) => {
    setInventoryData((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          let newStatus: "정상" | "부족" | "품절" = "정상"
          if (item.currentStock === 0) newStatus = "품절"
          else if (item.currentStock <= newLevel) newStatus = "부족"

          return {
            ...item,
            minStockLevel: newLevel,
            stockStatus: newStatus,
          }
        }
        return item
      }),
    )
  }

  const lowStockItems = inventoryData.filter((item) => item.stockStatus === "부족" || item.stockStatus === "품절")

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">재고관리</h1>
        <p className="text-gray-600 mt-2">상품 재고 현황을 관리하고 입출고를 처리합니다.</p>
      </div>

      {/* 재고 알림 */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Bell className="h-5 w-5" />
              재고 알림
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">현재: {item.currentStock}개</span>
                    {getStockStatusBadge(item.stockStatus, item.currentStock)}
                  </div>
                </div>
              ))}
              {lowStockItems.length > 3 && (
                <p className="text-sm text-gray-600">외 {lowStockItems.length - 3}개 상품</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">재고 현황</TabsTrigger>
          <TabsTrigger value="inbound">입고 처리</TabsTrigger>
          <TabsTrigger value="outbound">출고 처리</TabsTrigger>
          <TabsTrigger value="history">입출고 이력</TabsTrigger>
        </TabsList>

        {/* 재고 현황 */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>재고 현황</CardTitle>
              <CardDescription>등록된 상품의 재고 현황을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 검색 및 필터 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="상품명, 영문명, 상품코드 검색"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="재고 상태 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="out-of-stock">품절 상품만</SelectItem>
                    <SelectItem value="low-stock">부족 상품만</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="정렬 기준" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">상품명순</SelectItem>
                    <SelectItem value="stock">재고량순</SelectItem>
                    <SelectItem value="status">상태순</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchKeyword("")
                    setStockFilter("all")
                    setSortBy("name")
                  }}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  필터 초기화
                </Button>
              </div>

              {/* 재고 테이블 */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">상품명</TableHead>
                      <TableHead className="font-semibold">영문명</TableHead>
                      <TableHead className="font-semibold">상품코드</TableHead>
                      <TableHead className="font-semibold">현재 재고</TableHead>
                      <TableHead className="font-semibold">최소 기준</TableHead>
                      <TableHead className="font-semibold">재고 상태</TableHead>
                      <TableHead className="font-semibold">최근 입고일</TableHead>
                      <TableHead className="font-semibold">설정</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-gray-600">{item.nameEn}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.productCode}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{item.currentStock}개</TableCell>
                        <TableCell>{item.minStockLevel}개</TableCell>
                        <TableCell>{getStockStatusBadge(item.stockStatus, item.currentStock)}</TableCell>
                        <TableCell>{format(item.lastRestockDate, "yyyy-MM-dd")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              value={item.minStockLevel}
                              onChange={(e) => updateMinStockLevel(item.id, Number.parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                            <Settings className="h-4 w-4 text-gray-400" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 입고 처리 */}
        <TabsContent value="inbound">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                입고 처리
              </CardTitle>
              <CardDescription>상품 입고를 등록하고 재고를 증가시킵니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>상품 선택 *</Label>
                    <Select value={inboundProduct} onValueChange={setInboundProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="입고할 상품을 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryData.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              <Badge variant="outline" className="text-xs">
                                현재: {item.currentStock}개
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inbound-quantity">입고 수량 *</Label>
                    <Input
                      id="inbound-quantity"
                      type="number"
                      min="1"
                      placeholder="입고할 수량을 입력해주세요"
                      value={inboundQuantity}
                      onChange={(e) => setInboundQuantity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>입고일</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(inboundDate, "PPP", { locale: ko })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={inboundDate}
                          onSelect={(date) => date && setInboundDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inbound-memo">메모</Label>
                    <Textarea
                      id="inbound-memo"
                      placeholder="입고 관련 메모를 입력해주세요 (선택사항)"
                      value={inboundMemo}
                      onChange={(e) => setInboundMemo(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleInboundSubmit} className="bg-green-600 hover:bg-green-700">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  입고 등록
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 출고 처리 */}
        <TabsContent value="outbound">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Minus className="h-5 w-5 text-red-600" />
                출고 처리
              </CardTitle>
              <CardDescription>상품 출고를 등록하고 재고를 감소시킵니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>상품 선택 *</Label>
                    <Select value={outboundProduct} onValueChange={setOutboundProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="출고할 상품을 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryData
                          .filter((item) => item.currentStock > 0)
                          .map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  재고: {item.currentStock}개
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outbound-quantity">출고 수량 *</Label>
                    <Input
                      id="outbound-quantity"
                      type="number"
                      min="1"
                      placeholder="출고할 수량을 입력해주세요"
                      value={outboundQuantity}
                      onChange={(e) => setOutboundQuantity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>출고 사유 *</Label>
                    <Select value={outboundReason} onValueChange={setOutboundReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="출고 사유를 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="판매">판매</SelectItem>
                        <SelectItem value="반품">반품</SelectItem>
                        <SelectItem value="손상">손상</SelectItem>
                        <SelectItem value="샘플 제공">샘플 제공</SelectItem>
                        <SelectItem value="이벤트">이벤트</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleOutboundSubmit} className="bg-red-600 hover:bg-red-700">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  출고 등록
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 입출고 이력 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>입출고 이력</CardTitle>
              <CardDescription>최근 입출고 거래 내역을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">날짜</TableHead>
                      <TableHead className="font-semibold">구분</TableHead>
                      <TableHead className="font-semibold">상품명</TableHead>
                      <TableHead className="font-semibold">수량</TableHead>
                      <TableHead className="font-semibold">사유/메모</TableHead>
                      <TableHead className="font-semibold">담당자</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionHistory.slice(0, 15).map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50">
                        <TableCell>{format(transaction.date, "yyyy-MM-dd HH:mm")}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              transaction.type === "입고" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {transaction.type === "입고" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{transaction.productName}</TableCell>
                        <TableCell className="font-semibold">{transaction.quantity}개</TableCell>
                        <TableCell>{transaction.reason || transaction.memo || "-"}</TableCell>
                        <TableCell>{transaction.manager}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
