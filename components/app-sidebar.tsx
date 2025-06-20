"use client"

import type * as React from "react"
import {
  Bell,
  ChevronRight,
  Home,
  Package,
  Settings,
  Truck,
  Users,
  Megaphone,
  Plus,
  List,
  ShoppingCart,
  FileText,
  UserPlus,
  UsersIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeMenu?: string
  onMenuChange?: (menu: string) => void
}

const data = {
  user: {
    name: "이지한",
    email: "admin@company.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "대시보드",
      url: "#",
      icon: Home,
      key: "dashboard",
    },
    {
      title: "고객관리",
      url: "#",
      icon: Users,
      key: "customers",
      items: [
        {
          title: "고객 등록",
          url: "#",
          icon: UserPlus,
          key: "customer-register",
        },
        {
          title: "고객 목록",
          url: "#",
          icon: UsersIcon,
          key: "customer-list",
        },
      ],
    },
    {
      title: "상품관리",
      url: "#",
      icon: Package,
      key: "products",
      items: [
        {
          title: "상품 등록",
          url: "#",
          icon: ShoppingCart,
          key: "product-register",
        },
        {
          title: "상품 목록",
          url: "#",
          icon: FileText,
          key: "product-list",
        },
      ],
    },
    {
      title: "재고관리",
      url: "#",
      icon: Package,
      key: "inventory",
    },
    {
      title: "프로모션 관리",
      url: "#",
      icon: Megaphone,
      key: "promotions",
      items: [
        {
          title: "프로모션 생성",
          url: "#",
          icon: Plus,
          key: "promotion-create",
        },
        {
          title: "프로모션 게시판",
          url: "#",
          icon: List,
          key: "promotion-board",
        },
      ],
    },
    {
      title: "배송관리",
      url: "#",
      icon: Truck,
      key: "shipping",
    },
  ],
}

export function AppSidebar({ activeMenu = "promotion-create", onMenuChange, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg bg-blue-600 text-white">
                      {data.user.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">관리자: {data.user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">관리자 계정</span>
                  </div>
                  <Bell className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg bg-blue-600 text-white">
                        {data.user.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{data.user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  알림 설정
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  계정 설정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>로그아웃</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.key}
                  asChild
                  defaultOpen={item.key === "promotions" || item.key === "customers" || item.key === "products"}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={
                          activeMenu === item.key ||
                          (item.items && item.items.some((subItem) => subItem.key === activeMenu))
                        }
                        onClick={() => {
                          if (item.items && item.items.length > 0) {
                            // 상위 메뉴에 서브메뉴가 있는 경우, 첫 번째 서브메뉴로 라우팅
                            const defaultSubMenu = item.items[0].key
                            onMenuChange?.(defaultSubMenu)
                          } else {
                            // 서브메뉴가 없는 경우 해당 메뉴로 라우팅
                            onMenuChange?.(item.key)
                          }
                        }}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.items && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.key}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={activeMenu === subItem.key}
                                onClick={(e) => {
                                  e.preventDefault()
                                  onMenuChange?.(subItem.key)
                                }}
                              >
                                <a href={subItem.url}>
                                  {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                  <span>{subItem.title}</span>
                                  {activeMenu === subItem.key && (
                                    <Badge className="ml-auto bg-blue-600 text-white">현재</Badge>
                                  )}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm">
              <Settings className="h-4 w-4" />
              <span>시스템 설정</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
