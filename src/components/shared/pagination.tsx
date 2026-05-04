'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface PaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  page,
  totalPages,
  limit,
  totalItems,
  onPageChange,
  onLimitChange,
  isLoading = false,
}: PaginationProps) {
  const from = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-2 py-4 sm:flex-row">
      <div className="flex items-center gap-4">
        <Select
          value={limit.toString()}
          onValueChange={(val) => onLimitChange(Number(val))}
          disabled={isLoading}
        >
          <SelectTrigger className="hover:bg-secondary h-8 w-fit gap-1 border-none bg-transparent px-2 text-xs font-medium shadow-none transition-colors focus:ring-0 focus:outline-none">
            <span className="text-muted-foreground font-normal">Tampilkan</span>
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border shadow-xl">
            {[10, 20, 50, 100].map((val) => (
              <SelectItem
                key={val}
                value={val.toString()}
                className="rounded-lg text-xs"
              >
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="bg-border/60 h-4 w-px" />

        <p className="text-muted-foreground text-xs font-medium">
          <span className="text-foreground">
            {from}-{to}
          </span>
          <span className="mx-1">dari</span>
          <span className="text-foreground">{totalItems}</span>
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
          className="hover:bg-secondary h-8 px-3 text-xs font-semibold transition-all"
        >
          <span className="text-muted-foreground">Sebelumnya</span>
        </Button>

        <div className="bg-secondary/40 flex h-8 items-center rounded-lg px-3 text-[11px] font-bold tracking-tight">
          <span className="text-foreground">{page}</span>
          <span className="text-muted-foreground/40 mx-2">/</span>
          <span className="text-muted-foreground">{totalPages || 1}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
          className="hover:bg-secondary h-8 px-3 text-xs font-semibold transition-all"
        >
          <span className="text-muted-foreground">Berikutnya</span>
        </Button>
      </div>
    </div>
  );
}
