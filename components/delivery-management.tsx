"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, CalendarIcon, Eye, Package, Truck, CheckCircle, Clock, Filter, FileSpreadsheet } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface DeliveryOrder {
  id: string
  orderNumber: string
  orderDate: Date
  customerName: string
  customerPhone: string
  deliveryAddress: string
  orderItems: string
  deliveryStatus: "배송 준비중" | "배송중" | "배송완료"
  courierCompany: string
  trackingNumber: string
  shippingDate?: Date
  memo?: string
  totalAmount: number
}

const courierCompanies = [
  { value: "", label: "택배사 선택" },
  { value: "cj", label: "CJ대한통운" },
  { value: "logen", label: "로젠택배" },
  { value: "hanjin", label: "한진택배" },
  { value: "lotte", label: "롯데택배" },
  { value: "kdexp", label: "경동택배" },
]

// Mock 데이터 생성
const generateMockOrders = (): DeliveryOrder[] => {
  const customers = [
    { name: "김지은", phone: "010-1234-5678", address: "서울시 강남구 테헤란로 123, 101동 1001호" },
    { name: "이민수", phone: "010-2345-6789", address: "부산시 해운대구 해운대로 456, 202동 502호" },
    { name: "박서연", phone: "010-3456-7890", address: "대구시 중구 중앙대로 789, 상가 1층" },
    { name: "정우진", phone: "010-4567-8901", address: "인천시 남동구 구월로 321, 빌라 2층" },
    { name: "최하늘", phone: "010-5678-9012", address: "광주시 서구 상무대로 654, 아파트 15층" },
    { name: "한소영", phone: "010-6789-0123", address: "대전시 유성구 대학로 987, 오피스텔 801호" },
    { name: "윤태호", phone: "010-7890-1234", address: "울산시 남구 삼산로 147, 주택 1층" },
    { name: "강미래", phone: "010-8901-2345", address: "수원시 영통구 광교로 258, 타워 25층" },
  ]

  const products = [
    "히알 알파",
    "라멜리어 페이스 워시",
    "퍼펙퀵 이레이저 오일",
    "세라히알 비기닝",
    "비타렉트 C15 앰플",
    "락트제 세럼",
    "리노 베리어락 크림",
    "선디테일러 2.0 스틱",
  ]

  const statuses: ("배송 준비중" | "배송중" | "배송완료")[] = ["배송 준비중", "배송중", "배송완료"]
  const companies = ["cj", "logen", "hanjin", "lotte"]

  const orders: DeliveryOrder[] = []

  for (let i = 1; i <= 25; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const orderDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const itemCount = Math.floor(Math.random() * 3) + 1
    const selectedProducts = []

    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)]
      if (!selectedProducts.includes(product)) {
        selectedProducts.push(product)
      }
    }

    const orderItems =
      selectedProducts.length === 1 ? selectedProducts[0] : `${selectedProducts[0]} 외 ${selectedProducts.length - 1}건`

    const courierCompany = companies[Math.floor(Math.random() * companies.length)]
    const trackingNumber = status !== "배송 준비중" ? `${Math.floor(Math.random() * 900000000) + 100000000}` : ""

    orders.push({
      id: `order-${i}`,
      orderNumber: `ORD${format(orderDate, "yyyyMMdd")}-${String(i).padStart(4, "0")}`,
      orderDate,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryAddress: customer.address,
      orderItems,
      deliveryStatus: status,
      courierCompany,
      trackingNumber,
      shippingDate: status !== "배송 준비중" ? new Date(orderDate.getTime() + 24 * 60 * 60 * 1000) : undefined,
      memo: Math.random() > 0.7 ? "배송 시 문 앞 배치 요청" : undefined,
      totalAmount: Math.floor(Math.random() * 200000) + 50000,
    })
  }

  return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())
}

export function DeliveryManagement() {
  const [orders, setOrders] = useState<DeliveryOrder[]>(generateMockOrders())
  const [searchKeyword, setSearchKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null)
  const [dialogMemo, setDialogMemo] = useState("")

  // 필터링된 주문 목록
  const filteredOrders = orders.filter((order) => {
    const matchesKeyword =
      order.customerName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      order.orderItems.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      order.trackingNumber.includes(searchKeyword) ||
      order.orderNumber.toLowerCase().includes(searchKeyword.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.deliveryStatus === statusFilter

    const matchesDateRange = (!startDate || order.orderDate >= startDate) && (!endDate || order.orderDate <= endDate)

    return matchesKeyword && matchesStatus && matchesDateRange
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "배송 준비중":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            배송 준비중
          </Badge>
        )
      case "배송중":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Truck className="h-3 w-3 mr-1" />
            배송중
          </Badge>
        )
      case "배송완료":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            배송완료
          </Badge>
        )
      default:
        return null
    }
  }

  const getCourierName = (value: string) => {
    const courier = courierCompanies.find((c) => c.value === value)
    return courier ? courier.label : value
  }

  const updateDeliveryStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              deliveryStatus: newStatus as "배송 준비중" | "배송중" | "배송완료",
              shippingDate: newStatus !== "배송 준비중" && !order.shippingDate ? new Date() : order.shippingDate,
            }
          : order,
      ),
    )

    toast({
      title: "배송 상태 변경",
      description: `배송 상태가 "${newStatus}"로 변경되었습니다.`,
    })
  }

  const updateTrackingNumber = (orderId: string, trackingNumber: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, trackingNumber } : order)))
  }

  const updateCourierCompany = (orderId: string, courierCompany: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, courierCompany } : order)))
  }

  const handleExcelDownload = () => {
    // 실제로는 라이브러리를 사용해서 엑셀 파일을 생성
    const csvContent = [
      [
        "주문번호",
        "주문일시",
        "고객명",
        "전화번호",
        "배송주소",
        "주문상품",
        "배송상태",
        "택배사",
        "송장번호",
        "출고일",
        "주문금액",
        "비고",
      ],
      ...filteredOrders.map((order) => [
        order.orderNumber,
        format(order.orderDate, "yyyy-MM-dd HH:mm"),
        order.customerName,
        order.customerPhone,
        order.deliveryAddress,
        order.orderItems,
        order.deliveryStatus,
        getCourierName(order.courierCompany),
        order.trackingNumber,
        order.shippingDate ? format(order.shippingDate, "yyyy-MM-dd") : "",
        `₩${order.totalAmount.toLocaleString()}`,
        order.memo || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `배송목록_${format(new Date(), "yyyyMMdd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "엑셀 다운로드 완료",
      description: "배송 목록이 엑셀 파일로 다운로드되었습니다.",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value)
  }

  const updateMemo = (orderId: string, memo: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, memo } : order)))
  }

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">배송관리</h1>
        <p className="text-gray-600 mt-2">고객 주문의 배송 현황을 관리하고 추적합니다.</p>
      </div>

      {/* 필터 및 검색 영역 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            배송 목록 검색 및 필터
          </CardTitle>
          <CardDescription>주문 기간, 배송 상태, 키워드로 배송 목록을 검색할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 키워드 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="고객명, 상품명, 송장번호, 주문번호 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 배송상태 필터 */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="배송상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="배송 준비중">배송 준비중</SelectItem>
                <SelectItem value="배송중">배송중</SelectItem>
                <SelectItem value="배송완료">배송완료</SelectItem>
              </SelectContent>
            </Select>

            {/* 시작일 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: ko }) : "시작일 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>

            {/* 종료일 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: ko }) : "종료일 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* 검색 결과 및 액션 버튼 */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">총 {filteredOrders.length}건의 주문이 검색되었습니다.</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchKeyword("")
                  setStatusFilter("all")
                  setStartDate(undefined)
                  setEndDate(undefined)
                }}
              >
                <Filter className="h-4 w-4 mr-1" />
                필터 초기화
              </Button>
              <Button onClick={handleExcelDownload} className="bg-green-600 hover:bg-green-700">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                엑셀 다운로드
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 배송 목록 테이블 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">주문번호</TableHead>
                  <TableHead className="font-semibold">주문일시</TableHead>
                  <TableHead className="font-semibold">고객명</TableHead>
                  <TableHead className="font-semibold">주문상품</TableHead>
                  <TableHead className="font-semibold">배송상태</TableHead>
                  <TableHead className="font-semibold">택배사</TableHead>
                  <TableHead className="font-semibold">송장번호</TableHead>
                  <TableHead className="font-semibold">출고일</TableHead>
                  <TableHead className="font-semibold">주문금액</TableHead>
                  <TableHead className="w-[150px] font-semibold">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{format(order.orderDate, "MM-dd HH:mm")}</TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell>{order.orderItems}</TableCell>
                    <TableCell>{getStatusBadge(order.deliveryStatus)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.courierCompany}
                        onValueChange={(value) => updateCourierCompany(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {courierCompanies.slice(1).map((courier) => (
                            <SelectItem key={courier.value} value={courier.value}>
                              {courier.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={order.trackingNumber}
                        onChange={(e) => updateTrackingNumber(order.id, e.target.value)}
                        placeholder="송장번호"
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>{order.shippingDate ? format(order.shippingDate, "MM-dd") : "-"}</TableCell>
                    <TableCell className="font-semibold">₩{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order)
                                setDialogMemo(order.memo || "")
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              상세
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>주문 상세 정보</DialogTitle>
                              <DialogDescription>주문번호: {order.orderNumber}</DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">고객명</Label>
                                    <p className="text-sm">{selectedOrder.customerName}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">전화번호</Label>
                                    <p className="text-sm">{selectedOrder.customerPhone}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <Label className="text-sm font-medium">배송주소</Label>
                                    <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">주문상품</Label>
                                    <p className="text-sm">{selectedOrder.orderItems}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">주문금액</Label>
                                    <p className="text-sm font-semibold">
                                      ₩{formatCurrency(selectedOrder.totalAmount)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">배송상태</Label>
                                    <div className="mt-1">
                                      <Select
                                        value={selectedOrder.deliveryStatus}
                                        onValueChange={(value) => updateDeliveryStatus(selectedOrder.id, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="배송 준비중">배송 준비중</SelectItem>
                                          <SelectItem value="배송중">배송중</SelectItem>
                                          <SelectItem value="배송완료">배송완료</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">송장번호</Label>
                                    <Input
                                      value={selectedOrder.trackingNumber}
                                      onChange={(e) => updateTrackingNumber(selectedOrder.id, e.target.value)}
                                      placeholder="송장번호 입력"
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Label className="text-sm font-medium">관리자 메모</Label>
                                    <Textarea
                                      value={dialogMemo}
                                      onChange={(e) => setDialogMemo(e.target.value)}
                                      placeholder="배송 관련 메모를 입력하세요"
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="flex justify-end mt-4">
                              <Button
                                onClick={() => {
                                  if (selectedOrder) {
                                    updateMemo(selectedOrder.id, dialogMemo)
                                    toast({
                                      title: "메모 저장",
                                      description: "관리자 메모가 저장되었습니다.",
                                    })
                                  }
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                메모 저장
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Select
                          value={order.deliveryStatus}
                          onValueChange={(value) => updateDeliveryStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="배송 준비중">준비중</SelectItem>
                            <SelectItem value="배송중">배송중</SelectItem>
                            <SelectItem value="배송완료">완료</SelectItem>
                          </SelectContent>
                        </Select>
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
