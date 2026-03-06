"use client";

import { useRecentUsers } from "../hooks/use-admin-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

export function RecentUsersCard() {
  const { data: users, isLoading } = useRecentUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 가입 사용자</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !users?.length ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            최근 가입자가 없습니다.
          </p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div>
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    {user.username}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {user.email}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
