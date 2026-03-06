import { http, HttpResponse } from 'msw'

let fileNextSeq = 1

export const fileHandlers = [
  http.post('*/api/v1/files/upload', async () => {
    const mockFiles = [
      {
        id: `file-upload-${fileNextSeq++}`,
        originalName: '업로드파일.pdf',
        storedName: `stored_${Date.now()}.pdf`,
        size: 1024 * 100,
        contentType: 'application/pdf',
      },
    ]
    return HttpResponse.json(mockFiles, { status: 201 })
  }),

  http.get('*/api/v1/files/:fileId/download', () => {
    const blob = new Blob(['mock file content'], {
      type: 'application/octet-stream',
    })
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="mock-file.txt"',
      },
    })
  }),
]
