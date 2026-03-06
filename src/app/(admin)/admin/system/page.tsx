"use client";

import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleManagement } from "@/features/admin/components/role-management";
import { MenuManagement } from "@/features/admin/components/menu-management";
import { MenuRoleManagement } from "@/features/admin/components/menu-role-management";
import { CodeManagement } from "@/features/admin/components/code-management";
import { PositionRoleManagement } from "@/features/admin/components/position-role-management";

export default function AdminSystemPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="시스템 관리" description="역할, 메뉴, 공통코드 등 시스템 설정을 관리합니다." />

      <Tabs defaultValue="roles">
        <TabsList>
          <TabsTrigger value="roles">역할</TabsTrigger>
          <TabsTrigger value="menus">메뉴</TabsTrigger>
          <TabsTrigger value="menu-roles">메뉴-역할</TabsTrigger>
          <TabsTrigger value="codes">공통코드</TabsTrigger>
          <TabsTrigger value="position-roles">직급-역할</TabsTrigger>
        </TabsList>
        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>
        <TabsContent value="menus">
          <MenuManagement />
        </TabsContent>
        <TabsContent value="menu-roles">
          <MenuRoleManagement />
        </TabsContent>
        <TabsContent value="codes">
          <CodeManagement />
        </TabsContent>
        <TabsContent value="position-roles">
          <PositionRoleManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
