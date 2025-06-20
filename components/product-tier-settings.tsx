"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle, RotateCcw, Save, Package } from "lucide-react"

interface CustomerTier {
  id: string
  name: string
  maxQuantity: number
  discountRate: number
  salesLimit: number
  color: string
}

interface Product {
  id: string
  name: string
  category: string
}

const products: Product[] = [
  { id: "1", name: "라멜리어 페이스 워시 클렌징 젤 / Lamelier Face Wash", category: "클렌징" },
  {
    id: "2",
    name: "퍼펙퀵 이레이저 오일 [프리미엄 클렌징 오일] / PerfecQuick Eraser Oil [Premium Cleansing Oil]",
    category: "클렌징",
  },
  {
    id: "3",
    name: "세라히알 비기닝 [프리미엄 세럼 토너] / Cera Hyal Beginning [Premium Serum Toner]",
    category: "토너",
  },
  {
    id: "4",
    name: "호호바 쉴드 오일 프리미엄 페이스 오일 / Jojoba Shield Oil [Premium Face Oil]",
    category: "페이스 오일",
  },
  { id: "5", name: "비타렉트 C15 하이브리드 앰플 / Vitarect C15 Hybrid Ampoule", category: "앰플" },
  { id: "6", name: "락트제 세럼 / LactZe Serum", category: "세럼" },
  { id: "7", name: "알로줄렌 로션 젤 / Alo-Zelene Lotion Gel", category: "로션" },
  { id: "8", name: "토코맥스 20 / TocoMax 20", category: "트리트먼트" },
  { id: "9", name: "리노 베리어락 크림 / Reno BarrierLock Cream", category: "크림" },
  { id: "10", name: "스플래쉬 다이브 크림 / Splash Dive Cream", category: "크림" },
  { id: "11", name: "선디테일러 2.0 스틱 / Sun Detailer 2.0 Stick", category: "선케어" },
  { id: "12", name: "선스틸러 하이드로핏 선세럼 / Sun Stealer Hydrofoil Sun Serum", category: "선케어" },
  { id: "13", name: "엑소 15698 / EXO 15698", category: "스페셜 케어" },
  { id: "14", name: "KP 카밍 부스터 / KP Calming Booster", category: "부스터" },
  { id: "15", name: "PN 리젠 부스터 / PN Regen Booster", category: "부스터" },
  { id: "16", name: "히알 알파 / Hyal α", category: "세럼" },
  { id: "17", name: "바이젝션 / BY JECTION", category: "스페셜 케어" },
]

const defaultTiers: CustomerTier[] = [
  { id: "bronze", name: "브론즈", maxQuantity: 3, discountRate: 0, salesLimit: 500000, color: "bg-amber-600" },
  { id: "silver", name: "실버", maxQuantity: 5, discountRate: 5, salesLimit: 1000000, color: "bg-gray-400" },
  { id: "gold", name: "골드", maxQuantity: 10, discountRate: 10, salesLimit: 2000000, color: "bg-yellow-500" },
  { id: "platinum", name: "플래티넘", maxQuantity: 20, discountRate: 15, salesLimit: 5000000, color: "bg-slate-300" },
  { id: "diamond", name: "다이아몬드", maxQuantity: 50, discountRate: 20, salesLimit: 10000000, color: "bg-blue-400" },
]

export function ProductTierSettings() {
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [tiers, setTiers] = useState<Record<string, CustomerTier[]>>({})
  const [editedTiers, setEditedTiers] = useState<Record<string, Partial<CustomerTier>>>({})

  useEffect(() => {
    if (selectedProduct && !tiers[selectedProduct]) {
      setTiers((prev) => ({
        ...prev,
        [selectedProduct]: [...defaultTiers],
      }))
    }
    setEditedTiers({})
  }, [selectedProduct, tiers])

  const handleInputChange = (tierId: string, field: keyof CustomerTier, value: string | number) => {
    setEditedTiers((prev) => ({
      ...prev,
      [tierId]: {
        ...prev[tierId],
        [field]: value,
      },
    }))
  }

  const handleSave = (tierId: string) => {
    if (!selectedProduct) return

    const editedTier = editedTiers[tierId]
    if (!editedTier) return

    setTiers((prev) => ({
      ...prev,
      [selectedProduct]: prev[selectedProduct].map((tier) => (tier.id === tierId ? { ...tier, ...editedTier } : tier)),
    }))

    setEditedTiers((prev) => {
      const { [tierId]: _, ...rest } = prev
      return rest
    })
  }

  const handleReset = (tierId: string) => {
    if (!selectedProduct) return

    const defaultTier = defaultTiers.find((tier) => tier.id === tierId)
    if (!defaultTier) return

    setTiers((prev) => ({
      ...prev,
      [selectedProduct]: prev[selectedProduct].map((tier) => (tier.id === tierId ? { ...defaultTier } : tier)),
    }))

    setEditedTiers((prev) => {
      const { [tierId]: _, ...rest } = prev
      return rest
    })
  }

  const getCurrentValue = (tierId: string, field: keyof CustomerTier) => {
    const editedValue = editedTiers[tierId]?.[field]
    if (editedValue !== undefined) return editedValue

    if (!selectedProduct || !tiers[selectedProduct]) return ""

    const tier = tiers[selectedProduct].find((t) => t.id === tierId)
    return tier?.[field] || ""
  }

  const hasChanges = (tierId: string) => {
    return editedTiers[tierId] && Object.keys(editedTiers[tierId]).length > 0
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value)
  }

  const selectedProductInfo = products.find((p) => p.id === selectedProduct)
  const currentTiers = selectedProduct ? tiers[selectedProduct] || [] : []

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>상품별 고객 등급 설정</CardTitle>
            <CardDescription>프로모션에 적용할 상품과 고객 등급별 혜택을 설정해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">상품 선택</label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="상품을 선택해주세요..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProductInfo && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">선택된 상품:</span>
                  <span className="text-lg font-bold text-blue-900">{selectedProductInfo.name}</span>
                  <Badge className="bg-blue-100 text-blue-800">{selectedProductInfo.category}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedProduct && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[200px] font-semibold">
                        <div className="flex items-center gap-2">
                          고객 등급
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>브론즈부터 다이아몬드까지의 고객 등급</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">
                        <div className="flex items-center gap-2">
                          최대 구매 수량
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>해당 등급에서 구매 가능한 최대 수량</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">
                        <div className="flex items-center gap-2">
                          할인율
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>구매 시 적용되는 할인 비율</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">
                        <div className="flex items-center gap-2">
                          판매 한도 금액
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>해당 등급에서 구매 가능한 최대 금액</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableHead>
                      <TableHead className="w-[200px] font-semibold">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTiers.map((tier) => (
                      <TableRow key={tier.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full ${tier.color}`} />
                            <div>
                              <div className="font-medium text-gray-900">{tier.name}</div>
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {tier.name.toLowerCase()}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="1"
                              value={getCurrentValue(tier.id, "maxQuantity")}
                              onChange={(e) =>
                                handleInputChange(tier.id, "maxQuantity", Number.parseInt(e.target.value) || 0)
                              }
                              className="w-24"
                            />
                            <span className="text-gray-500 text-sm">개</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={getCurrentValue(tier.id, "discountRate")}
                              onChange={(e) =>
                                handleInputChange(tier.id, "discountRate", Number.parseFloat(e.target.value) || 0)
                              }
                              className="w-20"
                            />
                            <span className="text-gray-500">%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">₩</span>
                            <Input
                              type="number"
                              min="0"
                              step="10000"
                              value={getCurrentValue(tier.id, "salesLimit")}
                              onChange={(e) =>
                                handleInputChange(tier.id, "salesLimit", Number.parseInt(e.target.value) || 0)
                              }
                              className="w-32"
                              placeholder="0"
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            ₩{formatCurrency(Number(getCurrentValue(tier.id, "salesLimit")) || 0)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSave(tier.id)}
                              disabled={!hasChanges(tier.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              저장
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReset(tier.id)}>
                              <RotateCcw className="h-4 w-4 mr-1" />
                              초기화
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
        )}
      </div>
    </TooltipProvider>
  )
}
