"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import * as React from "react";

// ——— shadcn/ui ———
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table as STable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAlertDialog } from "@/hooks/alert-dialog/use-alert-dialog";
import { useDebouncedValue } from "@/hooks/useDebounced";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ChevronDown,
  Loader2,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

// ——— Filtering Types ———
export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "ilike"
  | "in"
  | "is"; // is: true/false/null
export type FilterType = "text" | "number" | "select" | "date" | "boolean";
export type BulkActionDef<TData> = {
  id: string;
  label: string;
  field?: string; // not needed for delete
  type?: FilterType; // optional
  options?: Array<{ label: string; value: string }>;
  onUpdate?: (selectedRows: TData[], value: any) => Promise<void> | void;
};

export type FilterDef = {
  id: string; // accessorKey/column name in DB
  title?: string;
  type: FilterType;
  operator?: FilterOperator;
  options?: Array<{ label: string; value: string }>;
};

export type DynamicDataTableProps<TData, TValue> = {
  supabase?: SupabaseClient;
  table?: string;
  select?: string;

  data?: TData[];
  bulkActions?: BulkActionDef<TData>[];

  columns?: ColumnDef<TData, TValue>[];

  initialPagination?: { pageIndex?: number; pageSize?: number };
  initialSorting?: SortingState;
  defaultSortBy?: { id: string; desc?: boolean };

  initialVisibility?: VisibilityState;

  searchableColumns?: string[];
  filterDefs?: FilterDef[];

  staticFilters?: Record<string, any>;
  where?: Record<string, any>;

  onRowClick?: (row: Row<TData>) => void;
  renderRowActions?: (row: Row<TData>) => ReactNode;

  emptyState?: ReactNode;
  className?: string;
};

export default function DynamicDataTable<
  TData extends Record<string, any>,
  TValue = unknown
>(props: DynamicDataTableProps<TData, TValue>) {
  const {
    supabase,
    table: tableName,
    select,
    data: initialData,
    columns: userColumns,
    initialPagination,
    initialSorting,
    defaultSortBy, // 👈 NEW
    initialVisibility,
    searchableColumns = [],
    filterDefs = [],
    staticFilters,
    onRowClick,
    renderRowActions,
    emptyState,
    className,
  } = props;

  const isServerMode = !!(supabase && tableName);

  // ——— Table state ———
  const [data, setData] = React.useState<TData[]>(() => initialData ?? []);
  const [rowCount, setRowCount] = React.useState<number>(
    () => initialData?.length ?? 0
  );

  const [sorting, setSorting] = React.useState<SortingState>(
    initialSorting ??
      (defaultSortBy
        ? [{ id: defaultSortBy.id, desc: defaultSortBy.desc ?? false }]
        : [])
  );

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialVisibility ?? {});
  const [pageIndex, setPageIndex] = React.useState<number>(
    initialPagination?.pageIndex ?? 0
  );
  const [pageSize, setPageSize] = React.useState<number>(
    initialPagination?.pageSize ?? 10
  );
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const debouncedGlobal = useDebouncedValue(globalFilter, 400);

  // ——— Columns ———
  const autoColumns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    if (userColumns && userColumns.length)
      return userColumns as ColumnDef<TData, any>[];
    const sample = data?.[0];
    if (!sample) return [];
    return Object.keys(sample).map((key) => ({
      accessorKey: key as keyof TData as string,
      header: key.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      cell: ({ getValue }) => String(getValue() ?? ""),
    }));
  }, [userColumns, data]);

  const columns = React.useMemo(() => {
    if (!renderRowActions) return autoColumns;
    return [
      ...autoColumns,
      {
        id: "_actions",
        header: "",
        cell: ({ row }: { row: Row<TData> }) => (
          <div className="flex justify-end">{renderRowActions(row)}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<TData, any>,
    ];
  }, [autoColumns, renderRowActions]);

  // ——— Server-side fetch (Supabase) ———
  const fetchServerData = React.useCallback(async () => {
    if (!isServerMode || !supabase || !tableName) return;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from(tableName)
        .select(select ?? "*", { count: "exact" });

      // Static filters
      if (staticFilters) {
        for (const [k, v] of Object.entries(staticFilters)) {
          if (v === null) query = query.is(k, null);
          else query = query.eq(k, v);
        }
      }

      if (props.where) {
        for (const [k, v] of Object.entries(props.where)) {
          if (v === null) query = query.is(k, null);
          else query = query.eq(k, v);
        }
      }

      // Global search
      if (debouncedGlobal && searchableColumns.length) {
        const term = debouncedGlobal.replace(/%/g, "");
        const ors = searchableColumns
          .map((c) => `${c}.ilike.%${term}%`)
          .join(",");
        query = query.or(ors);
      }

      // Column filters
      for (const f of columnFilters) {
        const def = filterDefs.find((d) => d.id === f.id);
        const op: FilterOperator = (def?.operator ??
          (def?.type === "text"
            ? "ilike"
            : def?.type === "boolean"
            ? "is"
            : "eq")) as FilterOperator;
        const col = f.id;
        const val = f.value as any;
        if (val === undefined || val === "") continue;

        switch (op) {
          case "ilike":
            query = query.ilike(col, `%${String(val)}%`);
            break;
          case "in":
            {
              const arr = Array.isArray(val)
                ? val
                : String(val)
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
              query = query.in(col, arr);
            }
            break;
          case "gt":
          case "gte":
          case "lt":
          case "lte":
          case "eq":
          case "neq":
            query = (query as any)[op](col, val);
            break;
          case "is":
            query = query.is(col, val);
            break;
        }
      }

      // Sorting
      if (sorting.length) {
        for (const s of sorting) {
          query = query.order(s.id, { ascending: !s.desc as boolean });
        }
      }

      // Pagination
      const from = pageIndex * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data: rows, count, error: qErr } = await query;
      if (qErr) throw qErr;

      setData((rows as unknown as TData[]) ?? []);
      setRowCount(count ?? 0);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load data");
      setData([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    isServerMode,
    supabase,
    tableName,
    select,
    staticFilters,
    debouncedGlobal,
    searchableColumns,
    columnFilters,
    filterDefs,
    sorting,
    pageIndex,
    pageSize,
  ]);

  React.useEffect(() => {
    if (isServerMode) fetchServerData();
  }, [isServerMode, fetchServerData]);

  // Client-side search
  const clientFilteredData = React.useMemo(() => {
    if (isServerMode) return data;
    if (!debouncedGlobal || !searchableColumns.length) return data;
    const q = debouncedGlobal.toLowerCase();
    return data.filter((row) =>
      searchableColumns.some((col) =>
        String((row as any)[col] ?? "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [isServerMode, data, debouncedGlobal, searchableColumns]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: clientFilteredData,
    columns: columns as ColumnDef<TData, unknown>[],
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter: debouncedGlobal,
      pagination: { pageIndex, pageSize },
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    onSortingChange: (updater) =>
      setSorting((old) =>
        typeof updater === "function" ? updater(old) : updater
      ),
    onColumnFiltersChange: (updater) =>
      setColumnFilters((old) =>
        typeof updater === "function" ? updater(old) : updater
      ),
    onColumnVisibilityChange: (updater) =>
      setColumnVisibility((old) =>
        typeof updater === "function" ? updater(old) : updater
      ),
    getCoreRowModel: getCoreRowModel(),
    manualSorting: isServerMode,
    manualFiltering: isServerMode,
    manualPagination: isServerMode,
    pageCount: isServerMode
      ? Math.ceil(rowCount / pageSize)
      : Math.ceil((clientFilteredData?.length ?? 0) / pageSize),
  });

  const totalRows = isServerMode ? rowCount : clientFilteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  return (
    <div className={cn("space-y-3", className)}>
      <DataTableToolbar
        table={table}
        searchableColumns={searchableColumns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        setPageIndex={setPageIndex}
        filterDefs={filterDefs}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        isServerMode={isServerMode}
        loading={loading}
        onRefresh={isServerMode ? fetchServerData : undefined}
      />
      <BulkActionsToolbar table={table} bulkActions={props.bulkActions} />

      {/* Active filter chips */}
      {!!columnFilters.length && (
        <div className="flex flex-wrap items-center gap-2">
          {columnFilters.map((f) => (
            <Badge key={f.id} variant="secondary" className="text-xs">
              <span className="mr-1 font-medium">{f.id}:</span>{" "}
              {String(f.value)}
            </Badge>
          ))}
        </div>
      )}

      <div className="rounded-md border">
        <STable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            "flex items-center gap-2"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.column.columnDef.header as any}
                          {header.column.getIsSorted() === "asc" && (
                            <span className="text-xs">▲</span>
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <span className="text-xs">▼</span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-muted/50"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {typeof cell.column.columnDef.cell === "function"
                        ? (
                            cell.column.columnDef.cell as (
                              props: any
                            ) => React.ReactNode
                          )({
                            ...cell.getContext(),
                            value: cell.getValue(),
                          })
                        : (cell.column.columnDef.cell as any)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyState ?? "No results"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </STable>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium">
            {Math.min(pageIndex * pageSize + 1, totalRows) || 0}
          </span>
          –
          <span className="font-medium">
            {Math.min((pageIndex + 1) * pageSize, totalRows) || 0}
          </span>{" "}
          of
          <span className="font-medium"> {totalRows}</span>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageIndex(0);
              setPageSize(Number(v));
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50, 100].map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(0)}
              disabled={pageIndex === 0 || loading}
            >
              « First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
              disabled={pageIndex === 0 || loading}
            >
              ‹ Prev
            </Button>
            <span className="px-2 text-sm">
              Page <span className="font-medium">{pageIndex + 1}</span> /{" "}
              {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPageIndex((i) => Math.min(totalPages - 1, i + 1))
              }
              disabled={pageIndex + 1 >= totalPages || loading}
            >
              Next ›
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(totalPages - 1)}
              disabled={pageIndex + 1 >= totalPages || loading}
            >
              Last »
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ——— Toolbar ———
function DataTableToolbar({
  table,
  searchableColumns,
  globalFilter,
  setGlobalFilter,
  setPageIndex,
  filterDefs,
  columnFilters,
  setColumnFilters,
  loading,
  onRefresh,
}: {
  table: any;
  searchableColumns: string[];
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  filterDefs: FilterDef[];
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  isServerMode: boolean;
  loading: boolean;
  onRefresh?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex w-full gap-2 md:max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              searchableColumns.length
                ? `Search ${searchableColumns.join(", ")}...`
                : "Search..."
            }
            value={globalFilter}
            onChange={(e) => {
              setPageIndex(0);
              setGlobalFilter(e.target.value);
            }}
            className="pl-8"
          />
        </div>

        {filterDefs.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
              <div className="space-y-3">
                {filterDefs.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No filters configured.
                  </p>
                )}
                {filterDefs.map((f) => (
                  <FilterControl
                    key={f.id}
                    def={f}
                    value={
                      (columnFilters.find((c) => c.id === f.id)
                        ?.value as any) ?? ""
                    }
                    onChange={(val) => {
                      setPageIndex(0);
                      setColumnFilters((prev) => {
                        const next = prev.filter((c) => c.id !== f.id);
                        if (
                          val !== undefined &&
                          val !== "" &&
                          !(Array.isArray(val) && val.length === 0)
                        )
                          next.push({ id: f.id, value: val });
                        return next;
                      });
                    }}
                  />
                ))}
                {!!columnFilters.length && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 px-2 text-xs"
                      onClick={() => setColumnFilters([])}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              View <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {table.getAllLeafColumns().map((col: any) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                className="capitalize"
                checked={col.getIsVisible()}
                onCheckedChange={(v) => col.toggleVisibility(!!v)}
              >
                {col.id.replace(/_/g, " ")}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRefresh?.()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

// ——— Individual Filter Controls ———
function FilterControl({
  def,
  value,
  onChange,
}: {
  def: FilterDef;
  value: any;
  onChange: (v: any) => void;
}) {
  const id = `filter-${def.id}`;
  switch (def.type) {
    case "text":
      return (
        <div className="space-y-1">
          <label htmlFor={id} className="text-xs text-muted-foreground">
            {def.title ?? def.id}
          </label>
          <Input
            id={id}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Contains…"
          />
        </div>
      );
    case "number":
      return (
        <div className="space-y-1">
          <label htmlFor={id} className="text-xs text-muted-foreground">
            {def.title ?? def.id}
          </label>
          <Input
            id={id}
            type="number"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case "boolean":
      return (
        <div className="space-y-1">
          <label htmlFor={id} className="text-xs text-muted-foreground">
            {def.title ?? def.id}
          </label>
          <Select
            value={value === "" ? "" : String(value)}
            onValueChange={(v) => onChange(v === "" ? "" : v === "true")}
          >
            <SelectTrigger id={id}>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    case "select":
      return (
        <div className="space-y-1">
          <label htmlFor={id} className="text-xs text-muted-foreground">
            {def.title ?? def.id}
          </label>
          <Select value={value ?? ""} onValueChange={onChange}>
            <SelectTrigger id={id}>
              <SelectValue placeholder="Choose…" />
            </SelectTrigger>
            <SelectContent>
              {(def.options ?? []).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case "date":
      return (
        <div className="space-y-1">
          <label
            htmlFor={id}
            className="text-xs text-muted-foreground flex items-center gap-1"
          >
            <CalendarIcon className="h-3 w-3" /> {def.title ?? def.id}
          </label>
          <Input
            id={id}
            type="date"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    default:
      return null;
  }
}
function BulkActionsToolbar<TData>({
  table,
  bulkActions = [],
}: {
  table: any;
  bulkActions?: BulkActionDef<TData>[];
}) {
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((r: any) => r.original);

  const [action, setAction] = React.useState<string>("");
  const [value, setValue] = React.useState<any>("");

  const def = bulkActions.find((a) => a.id === action);

  const { openDialog } = useAlertDialog();

  if (selectedRows.length === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
      <span className="text-sm">{selectedRows.length} selected</span>

      {/* Action selector */}
      <Select value={action} onValueChange={setAction}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Choose action" />
        </SelectTrigger>
        <SelectContent>
          {bulkActions.length === 0 && (
            <SelectItem value="null" disabled>
              No actions
            </SelectItem>
          )}
          {bulkActions.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value input if action requires it */}
      {def?.type && (
        <FilterControl
          def={{ ...def, id: def.field! } as any}
          value={value}
          onChange={setValue}
        />
      )}

      {/* Apply button */}
      {def && (
        <Button
          size="sm"
          onClick={() => {
            openDialog({
              title: "Confirm bulk action",
              description: def.type
                ? `Apply "${def.label}" with value "${value}" to ${selectedRows.length} row(s)?`
                : `Apply "${def.label}" to ${selectedRows.length} row(s)?`,
              onConfirm: async () => {
                await def.onUpdate?.(selectedRows, value);
                setAction("");
                setValue("");
                table.resetRowSelection();
              },
            });
          }}
        >
          Apply
        </Button>
      )}
    </div>
  );
}
