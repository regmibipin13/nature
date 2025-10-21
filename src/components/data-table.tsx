"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import * as React from "react";

// Interface for defining a customizable bulk action
export interface BulkAction<T> {
  field: keyof T;
  label: string;
  // Use 'options' for predefined values (e.g., a status dropdown)
  options?: { label: string; value: any }[];
  // Use 'renderInput' for a completely custom input component
  renderInput?: (value: any, onChange: (value: any) => void) => React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  data: initialData,
  columns: columnsProp,
  bulkActions,
  onBulkUpdate,
}: {
  data: T[];
  columns: ColumnDef<T>[];
  bulkActions?: BulkAction<T>[];
  onBulkUpdate?: (selectedRows: T[], field: keyof T, value: any) => void;
}) {
  const [data] = React.useState<T[]>(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // State for bulk update UI
  const [selectedBulkAction, setSelectedBulkAction] =
    React.useState<BulkAction<T> | null>(null);
  const [bulkValue, setBulkValue] = React.useState<any>("");

  const table = useReactTable({
    data,
    columns: columnsProp,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => String(row.id),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const numSelected = table.getSelectedRowModel().rows.length;

  const handleApplyBulkAction = () => {
    if (!onBulkUpdate || !selectedBulkAction || numSelected === 0) return;

    const selectedOriginalRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    onBulkUpdate(selectedOriginalRows, selectedBulkAction.field, bulkValue);

    // Reset state after applying
    table.resetRowSelection();
    setSelectedBulkAction(null);
    setBulkValue("");
  };

  React.useEffect(() => {
    // Reset bulk action state if selection is cleared
    if (numSelected === 0) {
      setSelectedBulkAction(null);
      setBulkValue("");
    }
  }, [numSelected]);

  return (
    <div className="space-y-4">
      {/* Bulk Action Toolbar */}
      {numSelected > 0 && bulkActions && onBulkUpdate && (
        <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-muted p-4">
          <p className="flex-shrink-0 text-sm font-medium">
            {numSelected} row(s) selected.
          </p>
          <Select
            onValueChange={(field) => {
              const action = bulkActions.find((a) => a.field === field);
              setSelectedBulkAction(action || null);
              setBulkValue(""); // Reset value when action changes
            }}
          >
            <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px]">
              <SelectValue placeholder="Select bulk action..." />
            </SelectTrigger>
            <SelectContent>
              {bulkActions.map((action) => (
                <SelectItem
                  key={String(action.field)}
                  value={String(action.field)}
                >
                  Update {action.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Dynamic Input for the new value */}
          {selectedBulkAction && (
            <div className="flex w-full sm:w-auto flex-grow items-center gap-2">
              {selectedBulkAction.renderInput ? (
                selectedBulkAction.renderInput(bulkValue, setBulkValue)
              ) : selectedBulkAction.options ? (
                <Select onValueChange={setBulkValue} value={bulkValue}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={`Set new ${selectedBulkAction.label}...`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBulkAction.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder={`Enter new ${selectedBulkAction.label}...`}
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                  className="w-full"
                />
              )}
            </div>
          )}

          <div className="flex flex-shrink-0 items-center gap-2 ml-auto">
            <Button
              onClick={handleApplyBulkAction}
              disabled={!selectedBulkAction || bulkValue === ""}
            >
              Apply
            </Button>
            <Button variant="ghost" onClick={() => table.resetRowSelection()}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : (() => {
                            const canSort = header.column.getCanSort();
                            const isSorted = header.column.getIsSorted();

                            if (canSort) {
                              return (
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 text-left"
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  <span className="ml-1">
                                    {isSorted === "asc" ? (
                                      "▲"
                                    ) : isSorted === "desc" ? (
                                      "▼"
                                    ) : (
                                      <ArrowUpDown className="inline h-3 w-3 opacity-40" />
                                    )}
                                  </span>
                                </button>
                              );
                            }

                            return flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            );
                          })()}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsProp.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
