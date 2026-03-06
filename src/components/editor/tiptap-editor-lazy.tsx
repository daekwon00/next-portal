'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

export const TiptapEditorLazy = dynamic(
  () =>
    import('@/components/editor/tiptap-editor').then((mod) => ({
      default: mod.TiptapEditor,
    })),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false,
  }
)
