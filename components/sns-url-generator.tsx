"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Facebook, Instagram, MessageCircle, Twitter } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const snsOptions = [
  { value: "twitter", label: "트위터", icon: Twitter, color: "bg-blue-400" },
  { value: "instagram", label: "인스타그램", icon: Instagram, color: "bg-pink-500" },
  { value: "facebook", label: "페이스북", icon: Facebook, color: "bg-blue-600" },
  { value: "kakao", label: "카카오톡", icon: MessageCircle, color: "bg-yellow-400" },
]

export function SnsUrlGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [generatedUrl, setGeneratedUrl] = useState("")

  const generateUrl = () => {
    if (!selectedPlatform || !customMessage) {
      toast({
        title: "입력 오류",
        description: "SNS 플랫폼과 메시지를 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    // 실제로는 백엔드 API를 호출하여 URL을 생성
    const baseUrl = "https://promotion.company.com/promo"
    const encodedMessage = encodeURIComponent(customMessage)
    const url = `${baseUrl}?platform=${selectedPlatform}&message=${encodedMessage}&utm_source=${selectedPlatform}`

    setGeneratedUrl(url)
    toast({
      title: "URL 생성 완료",
      description: "프로모션 URL이 성공적으로 생성되었습니다.",
    })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl)
      toast({
        title: "복사 완료",
        description: "URL이 클립보드에 복사되었습니다.",
      })
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "URL 복사에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const selectedPlatformInfo = snsOptions.find((option) => option.value === selectedPlatform)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SNS 공유용 URL 생성</CardTitle>
          <CardDescription>소셜 미디어에서 공유할 프로모션 URL을 생성합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SNS 플랫폼 선택 */}
          <div className="space-y-2">
            <Label>SNS 플랫폼 선택 *</Label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="공유할 SNS 플랫폼을 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {snsOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 커스텀 메시지 */}
          <div className="space-y-2">
            <Label htmlFor="custom-message">커스텀 메시지 *</Label>
            <Textarea
              id="custom-message"
              placeholder="SNS에 함께 게시될 메시지를 입력해주세요"
              className="min-h-[100px]"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">{customMessage.length}/280자</p>
          </div>

          {/* URL 생성 버튼 */}
          <Button onClick={generateUrl} className="w-full bg-blue-600 hover:bg-blue-700">
            프로모션 URL 생성
          </Button>
        </CardContent>
      </Card>

      {/* 생성된 URL 결과 */}
      {generatedUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              생성된 프로모션 URL
              {selectedPlatformInfo && (
                <Badge className={`${selectedPlatformInfo.color} text-white`}>
                  <selectedPlatformInfo.icon className="h-3 w-3 mr-1" />
                  {selectedPlatformInfo.label}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* URL 표시 및 복사 */}
            <div className="flex gap-2">
              <Input value={generatedUrl} readOnly className="flex-1" />
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
              <Button asChild variant="outline">
                <a href={generatedUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* 미리보기 */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium mb-2">SNS 게시물 미리보기</h4>
              <div className="space-y-2">
                <p className="text-sm">{customMessage}</p>
                <div className="text-xs text-blue-600 break-all">{generatedUrl}</div>
              </div>
            </div>

            {/* SNS 아이콘 버튼들 */}
            <div className="flex gap-2">
              {snsOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedPlatform === option.value ? "default" : "outline"}
                  size="sm"
                  className={selectedPlatform === option.value ? option.color : ""}
                >
                  <option.icon className="h-4 w-4 mr-1" />
                  {option.label}에서 공유
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
