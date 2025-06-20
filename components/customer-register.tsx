"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const customerTiers = [
  { value: "bronze", label: "브론즈", color: "bg-amber-600" },
  { value: "silver", label: "실버", color: "bg-gray-400" },
  { value: "gold", label: "골드", color: "bg-yellow-500" },
  { value: "platinum", label: "플래티넘", color: "bg-slate-300" },
  { value: "diamond", label: "다이아몬드", color: "bg-blue-400" },
]

export function CustomerRegister() {
  const [customerName, setCustomerName] = useState("")
  const [nickname, setNickname] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [businessNumber, setBusinessNumber] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [initialTier, setInitialTier] = useState("")
  const [profileImage, setProfileImage] = useState<string>("")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfileImage = () => {
    setProfileImage("")
  }

  const formatBusinessNumber = (value: string) => {
    // 숫자만 추출
    const numericValue = value.replace(/[^0-9]/g, "")
    // 사업자등록번호 형식 (000-00-00000)
    if (numericValue.length <= 3) return numericValue
    if (numericValue.length <= 5) return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`
    return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 5)}-${numericValue.slice(5, 10)}`
  }

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numericValue = value.replace(/[^0-9]/g, "")
    // 전화번호 형식 (000-0000-0000)
    if (numericValue.length <= 3) return numericValue
    if (numericValue.length <= 7) return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`
    return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`
  }

  const handleBusinessNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBusinessNumber(e.target.value)
    setBusinessNumber(formatted)
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  const handleSubmit = () => {
    if (!customerName || !nickname || !phoneNumber || !initialTier) {
      toast({
        title: "입력 오류",
        description: "필수 항목을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    // 실제로는 백엔드 API 호출
    toast({
      title: "고객 등록 완료",
      description: "새로운 고객이 성공적으로 등록되었습니다.",
    })

    // 폼 초기화
    setCustomerName("")
    setNickname("")
    setCompanyName("")
    setBusinessNumber("")
    setPhoneNumber("")
    setAddress("")
    setInitialTier("")
    setProfileImage("")
  }

  const selectedTier = customerTiers.find((tier) => tier.value === initialTier)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>고객 등록</CardTitle>
          <CardDescription>새로운 고객을 등록합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 왼쪽 컬럼 */}
            <div className="space-y-4">
              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="customer-name">이름 *</Label>
                <Input
                  id="customer-name"
                  placeholder="고객 이름을 입력해주세요"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              {/* 닉네임 */}
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임 *</Label>
                <Input
                  id="nickname"
                  placeholder="닉네임을 입력해주세요"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              {/* 회사명 */}
              <div className="space-y-2">
                <Label htmlFor="company-name">회사명</Label>
                <Input
                  id="company-name"
                  placeholder="회사명을 입력해주세요"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              {/* 사업자등록번호 */}
              <div className="space-y-2">
                <Label htmlFor="business-number">사업자등록번호</Label>
                <Input
                  id="business-number"
                  placeholder="000-00-00000"
                  value={businessNumber}
                  onChange={handleBusinessNumberChange}
                  maxLength={12}
                />
              </div>
            </div>

            {/* 오른쪽 컬럼 */}
            <div className="space-y-4">
              {/* 전화번호 */}
              <div className="space-y-2">
                <Label htmlFor="phone-number">전화번호 *</Label>
                <Input
                  id="phone-number"
                  placeholder="000-0000-0000"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  maxLength={13}
                />
              </div>

              {/* 초기 고객등급 */}
              <div className="space-y-2">
                <Label>초기 고객등급 *</Label>
                <Select value={initialTier} onValueChange={setInitialTier}>
                  <SelectTrigger>
                    <SelectValue placeholder="고객등급을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
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
                {selectedTier && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`h-3 w-3 rounded-full ${selectedTier.color}`} />
                    <span className="text-sm text-gray-600">선택된 등급: {selectedTier.label}</span>
                  </div>
                )}
              </div>

              {/* 프로필 이미지 업로드 */}
              <div className="space-y-2">
                <Label>프로필 이미지</Label>
                {profileImage ? (
                  <div className="relative">
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="프로필 이미지 미리보기"
                      className="w-32 h-32 object-cover rounded-full border mx-auto"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={removeProfileImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2">
                      <Label htmlFor="profile-image-upload" className="cursor-pointer">
                        <span className="text-sm font-medium text-gray-900">프로필 이미지 업로드</span>
                        <span className="block text-xs text-gray-500 mt-1">PNG, JPG (최대 5MB)</span>
                      </Label>
                      <Input
                        id="profile-image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 주소 (전체 너비) */}
          <div className="space-y-2">
            <Label htmlFor="address">주소</Label>
            <Textarea
              id="address"
              placeholder="주소를 입력해주세요"
              className="min-h-[80px]"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* 등록 버튼 */}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              고객 등록
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
