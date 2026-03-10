'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useProfile } from '@/features/user/hooks/use-profile'
import { useQuery } from '@tanstack/react-query'
import { getRecentPosts } from '@/lib/api/post'
import { formatDate, formatDateTime } from '@/lib/format'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { KeyRound, UserCog, FileText } from 'lucide-react'

export default function MyPage() {
  const { data: session } = useSession()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: recentPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', 'recent'],
    queryFn: () => getRecentPosts(),
  })

  const myPosts = recentPosts?.filter(
    (post) => post.authorName === profile?.name
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">마이페이지</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 사용자 정보 카드 */}
        <Card>
          <CardHeader className="text-center">
            <Avatar className="mx-auto size-16">
              <AvatarFallback className="text-2xl">
                {profile?.name?.charAt(0) ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-2">
              {profileLoading ? (
                <Skeleton className="mx-auto h-6 w-24" />
              ) : (
                (profile?.name ?? '사용자')
              )}
            </CardTitle>
            <CardDescription>{profile?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profileLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : (
              <dl className="text-sm">
                <div className="flex justify-between border-b py-2">
                  <dt className="text-muted-foreground">아이디</dt>
                  <dd className="font-medium">{profile?.username}</dd>
                </div>
                <div className="flex justify-between border-b py-2">
                  <dt className="text-muted-foreground">부서</dt>
                  <dd className="font-medium">{profile?.department ?? '-'}</dd>
                </div>
                <div className="flex justify-between border-b py-2">
                  <dt className="text-muted-foreground">직위</dt>
                  <dd className="font-medium">{profile?.position ?? '-'}</dd>
                </div>
                <div className="flex justify-between border-b py-2">
                  <dt className="text-muted-foreground">역할</dt>
                  <dd>
                    <Badge
                      variant={
                        session?.user?.role === 'ADMIN'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {session?.user?.role ?? profile?.role}
                    </Badge>
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-muted-foreground">가입일</dt>
                  <dd className="font-medium">
                    {profile?.createdAt ? formatDate(profile.createdAt) : '-'}
                  </dd>
                </div>
              </dl>
            )}

            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/user/profile">
                  <UserCog className="mr-1 size-4" />
                  프로필 수정
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/user/change-password">
                  <KeyRound className="mr-1 size-4" />
                  비밀번호 변경
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 최근 활동 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="my-posts">
              <TabsList>
                <TabsTrigger value="my-posts">내 게시글</TabsTrigger>
                <TabsTrigger value="my-comments">내 댓글</TabsTrigger>
                <TabsTrigger value="my-files">내 파일</TabsTrigger>
              </TabsList>
              <TabsContent value="my-posts" className="mt-4">
                {postsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : !myPosts?.length ? (
                  <div className="text-muted-foreground flex flex-col items-center py-8 text-sm">
                    <FileText className="mb-2 size-8 opacity-50" />
                    <p>등록한 게시글이 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {myPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/boards/${post.boardId}/posts/${post.id}`}
                        className="hover:bg-accent flex items-center justify-between rounded-md px-3 py-2 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {post.title}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            조회 {post.viewCount}
                          </p>
                        </div>
                        <span className="text-muted-foreground shrink-0 text-xs">
                          {formatDateTime(post.createdAt)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="my-comments" className="mt-4">
                <div className="text-muted-foreground flex flex-col items-center py-8 text-sm">
                  <FileText className="mb-2 size-8 opacity-50" />
                  <p>등록한 댓글이 없습니다.</p>
                </div>
              </TabsContent>
              <TabsContent value="my-files" className="mt-4">
                <div className="text-muted-foreground flex flex-col items-center py-8 text-sm">
                  <FileText className="mb-2 size-8 opacity-50" />
                  <p>등록한 파일이 없습니다.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
