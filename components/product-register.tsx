"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function ProductRegister() {
  const [productName, setProductName] = useState("")
  const [productNameEn, setProductNameEn] = useState("")
  const [productImage, setProductImage] = useState<string>("")
  const [basePrice, setBasePrice] = useState("")
  const [productDescription, setProductDescription] = useState("")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProductImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProductImage = () => {
    setProductImage("")
  }

  const formatPrice = (value: string) => {
    // 숫자만 추출
    const numericValue = value.replace(/[^0-9]/g, "")
    // 콤마 추가
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPrice = formatPrice(e.target.value)
    setBasePrice(formattedPrice)
  }

  const handleSubmit = () => {
    if (!productName || !productNameEn || !basePrice) {
      toast({
        title: "입력 오류",
        description: "필수 항목을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    // 실제로는 백엔드 API 호출
    toast({
      title: "상품 등록 완료",
      description: "새로운 상품이 성공적으로 등록되었습니다.",
    })

    // 폼 초기화
    setProductName("")
    setProductNameEn("")
    setProductImage("")
    setBasePrice("")
    setProductDescription("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>상품 등록</CardTitle>
          <CardDescription>새로운 상품을 등록합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 상품명 (한글) */}
          <div className="space-y-2">
            <Label htmlFor="product-name">상품명 (한글) *</Label>
            <Input
              id="product-name"
              placeholder="상품명을 한글로 입력해주세요"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* 영문 상품명 */}
          <div className="space-y-2">
            <Label htmlFor="product-name-en">영문 상품명 *</Label>
            <Input
              id="product-name-en"
              placeholder="Product Name in English"
              value={productNameEn}
              onChange={(e) => setProductNameEn(e.target.value)}
            />
          </div>

          {/* 상품 이미지 업로드 */}
          <div className="space-y-2">
            <Label>상품 이미지</Label>
            {productImage ? (
              <div className="relative">
                <img
                  src={productImage || "/placeholder.svg"}
                  alt="상품 이미지 미리보기"
                  className="w-full max-w-sm h-64 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeProductImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="product-image-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      클릭하여 상품 이미지를 업로드하세요
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF (최대 10MB)</span>
                  </Label>
                  <Input
                    id="product-image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 기본 가격 */}
          <div className="space-y-2">
            <Label htmlFor="base-price">기본 가격 *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₩</span>
              <Input id="base-price" placeholder="0" value={basePrice} onChange={handlePriceChange} className="pl-8" />
            </div>
            {basePrice && <p className="text-sm text-gray-600">입력된 가격: ₩{basePrice}</p>}
          </div>

          {/* 상품 설명 */}
          <div className="space-y-2">
            <Label htmlFor="product-description">상품 설명</Label>
            <Textarea
              id="product-description"
              placeholder="상품에 대한 상세 설명을 입력해주세요"
              className="min-h-[120px]"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">{productDescription.length}/1000자</p>
          </div>

          {/* 등록 버튼 */}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              상품 등록
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
