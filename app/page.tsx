"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PromotionBasicInfo } from "@/components/promotion-basic-info"
import { ProductTierSettings } from "@/components/product-tier-settings"
import { SnsUrlGenerator } from "@/components/sns-url-generator"
import { PromotionBoard } from "@/components/promotion-board"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"

// ProductRegister와 ProductList 컴포넌트를 import 추가
import { ProductRegister } from "@/components/product-register"
import { ProductList } from "@/components/product-list"
import { CustomerRegister } from "@/components/customer-register"
import { CustomerList } from "@/components/customer-list"
import { DashboardSummary } from "@/components/dashboard-summary"
import { InventoryManagement } from "@/components/inventory-management"
import { DeliveryManagement } from "@/components/delivery-management"

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("promotion-create")

  // renderMainContent 함수에 새로운 케이스들을 추가
  const renderMainContent = () => {
    switch (activeMenu) {
      case "product-register":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">상품 등록</h1>
              <p className="text-gray-600 mt-2">새로운 상품을 등록합니다.</p>
            </div>
            <ProductRegister />
          </div>
        )
      case "product-list":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">상품 목록</h1>
              <p className="text-gray-600 mt-2">등록된 상품을 검색하고 관리합니다.</p>
            </div>
            <ProductList />
          </div>
        )
      case "inventory":
        return (
          <div className="space-y-6">
            <InventoryManagement />
          </div>
        )
      case "promotion-create":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">프로모션 생성</h1>
              <p className="text-gray-600 mt-2">새로운 프로모션을 생성하고 설정을 관리합니다.</p>
            </div>
            <Tabs defaultValue="basic-info" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic-info">프로모션 기본정보</TabsTrigger>
                <TabsTrigger value="tier-settings">상품별 고객 등급 설정</TabsTrigger>
                <TabsTrigger value="sns-url">SNS 공유용 URL 생성</TabsTrigger>
              </TabsList>
              <TabsContent value="basic-info">
                <PromotionBasicInfo />
              </TabsContent>
              <TabsContent value="tier-settings">
                <ProductTierSettings />
              </TabsContent>
              <TabsContent value="sns-url">
                <SnsUrlGenerator />
              </TabsContent>
            </Tabs>
          </div>
        )
      case "promotion-board":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">프로모션 게시판</h1>
              <p className="text-gray-600 mt-2">생성된 프로모션을 검색하고 관리합니다.</p>
            </div>
            <PromotionBoard />
          </div>
        )
      case "customer-register":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">고객 등록</h1>
              <p className="text-gray-600 mt-2">새로운 고객을 등록합니다.</p>
            </div>
            <CustomerRegister />
          </div>
        )
      case "customer-list":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">고객 목록</h1>
              <p className="text-gray-600 mt-2">등록된 고객을 검색하고 관리합니다.</p>
            </div>
            <CustomerList />
          </div>
        )
      case "dashboard":
        return (
          <div className="space-y-6">
            <DashboardSummary />
          </div>
        )
      case "customers":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">고객 목록</h1>
              <p className="text-gray-600 mt-2">등록된 고객을 검색하고 관리합니다.</p>
            </div>
            <CustomerList />
          </div>
        )
      case "products":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">상품 목록</h1>
              <p className="text-gray-600 mt-2">등록된 상품을 검색하고 관리합니다.</p>
            </div>
            <ProductList />
          </div>
        )
      case "promotions":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">프로모션 게시판</h1>
              <p className="text-gray-600 mt-2">생성된 프로모션을 검색하고 관리합니다.</p>
            </div>
            <PromotionBoard />
          </div>
        )
      case "shipping":
        return (
          <div className="space-y-6">
            <DeliveryManagement />
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">준비 중인 페이지입니다</h2>
              <p className="text-gray-600">선택하신 메뉴의 기능을 준비 중입니다.</p>
            </div>
          </div>
        )
    }
  }

  // getBreadcrumbItems 함수에 새로운 케이스들을 추가
  const getBreadcrumbItems = () => {
    switch (activeMenu) {
      case "product-register":
        return (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">상품관리</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>상품 등록</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )
      case "product-list":
        return (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">상품관리</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>상품 목록</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )
      case "inventory":
        return (
          <BreadcrumbItem>
            <BreadcrumbPage>재고관리</BreadcrumbPage>
          </BreadcrumbItem>
        )
      case "promotion-create":
        return (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">프로모션 관리</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>프로모션 생성</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )
      case "promotion-board":
        return (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">프로모션 관리</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>프로모션 게시판</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )
      case "customer-register":
        return (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">고객관리</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>고객 등록</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )
      case "customer-list":
        return (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">고객관리</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>고객 목록</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )
      case "dashboard":
        return (
          <BreadcrumbItem>
            <BreadcrumbPage>대시보드</BreadcrumbPage>
          </BreadcrumbItem>
        )
      case "customers":
        return (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">고객관리</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>고객 목록</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )
      case "products":
        return (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">상품관리</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>상품 목록</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )
      case "promotions":
        return (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">프로모션 관리</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>프로모션 게시판</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )
      case "shipping":
        return (
          <BreadcrumbItem>
            <BreadcrumbPage>배송관리</BreadcrumbPage>
          </BreadcrumbItem>
        )
      default:
        return (
          <BreadcrumbItem>
            <BreadcrumbPage>대시보드</BreadcrumbPage>
          </BreadcrumbItem>
        )
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>{getBreadcrumbItems()}</BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">{renderMainContent()}</div>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
