"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export function FileUpload({
  files,
  onChange,
  maxFiles = 5,
  maxSizeMB = 10,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      const added = Array.from(newFiles).filter((f) => {
        if (f.size > maxSizeMB * 1024 * 1024) {
          alert(`${f.name}: ${maxSizeMB}MB 이하만 업로드 가능합니다.`);
          return false;
        }
        return true;
      });
      const merged = [...files, ...added].slice(0, maxFiles);
      onChange(merged);
    },
    [files, onChange, maxFiles, maxSizeMB]
  );

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="text-muted-foreground mb-2 size-8" />
        <p className="text-muted-foreground text-sm">
          파일을 드래그하거나 클릭하여 업로드
        </p>
        <p className="text-muted-foreground text-xs">
          최대 {maxFiles}개, 각 {maxSizeMB}MB 이하
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => removeFile(i)}
                >
                  <X className="size-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
