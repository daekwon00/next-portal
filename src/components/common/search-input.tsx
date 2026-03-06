"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect } from "react";

interface SearchInputProps {
  onSearch: (search: string, searchType: string) => void;
  defaultSearch?: string;
  defaultSearchType?: string;
}

export function SearchInput({
  onSearch,
  defaultSearch = "",
  defaultSearchType = "all",
}: SearchInputProps) {
  const [search, setSearch] = useState(defaultSearch);
  const [searchType, setSearchType] = useState(defaultSearchType);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    onSearch(debouncedSearch, searchType);
  }, [debouncedSearch, searchType, onSearch]);

  return (
    <div className="flex gap-2">
      <Select value={searchType} onValueChange={setSearchType}>
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="author">작성자</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder="검색어를 입력하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
