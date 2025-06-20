"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, X } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function PromotionBasicInfo() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [bannerImage, setBannerImage] = useState<string>("")
  const [promotionName, setPromotionName] = useState("")
  const [promotionDescription, setPromotionDescription] = useState("")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBannerImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeBannerImage = () => {
    setBannerImage("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>프로모션 기본 정보</CardTitle>
          <CardDescription>프로모션의 기본 정보를 입력해주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 프로모션 이름 */}
          <div className="space-y-2">
            <Label htmlFor="promotion-name">프로모션 이름 *</Label>
            <Input
              id="promotion-name"
              placeholder="프로모션 이름을 입력해주세요"
              value={promotionName}
              onChange={(e) => setPromotionName(e.target.value)}
            />
          </div>

          {/* 프로모션 설명 */}
          <div className="space-y-2">
            <Label htmlFor="promotion-description">프로모션 설명</Label>
            <Textarea
              id="promotion-description"
              placeholder="프로모션에 대한 상세 설명을 입력해주세요"
              className="min-h-[100px]"
              value={promotionDescription}
              onChange={(e) => setPromotionDescription(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">{promotionDescription.length}/500자</p>
          </div>

          {/* 배너 이미지 업로드 */}
          <div className="space-y-2">
            <Label>프로모션 배너 이미지</Label>
            {bannerImage ? (
              <div className="relative">
                <img
                  src={bannerImage || "/placeholder.svg"}
                  alt="배너 미리보기"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeBannerImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="banner-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">클릭하여 이미지를 업로드하세요</span>
                    <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF (최대 10MB)</span>
                  </Label>
                  <Input
                    id="banner-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 프로모션 기간 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>시작일 *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: ko }) : "시작일을 선택해주세요"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>종료일 *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: ko }) : "종료일을 선택해주세요"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700">기본 정보 저장</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
