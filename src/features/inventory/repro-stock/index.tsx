"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { ReproStock } from "../types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { MaterialFilter } from "./material-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReproStockTableProps {
  data: ReproStock[];
}

export function ReproStockTable({ data }: ReproStockTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
    // Initialize with a decent page size for tall rows
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-xl font-semibold">Repro Drums</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search all columns..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8 w-[250px] bg-white"
              />
            </div>
            <MaterialFilter table={table} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {/* Main Table */}
        <div className="rounded-md border bg-white">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="h-12 px-4 text-left align-middle font-medium text-gray-600"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center space-x-2 ${
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <ChevronRight className="ml-2 h-4 w-4" />,
                              desc: (
                                <ChevronRight className="ml-2 h-4 w-4 rotate-90" />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="h-16 px-4 align-middle">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center align-middle text-gray-500"
                    >
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 15, 20, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {table.getFilteredRowModel().rows.length}
              </span>{" "}
              entries
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-1">
              {Array.from(
                { length: Math.min(5, table.getPageCount()) },
                (_, i) => {
                  const pageIndex = i;
                  const isCurrentPage =
                    pageIndex === table.getState().pagination.pageIndex;
                  return (
                    <button
                      key={i}
                      className={`flex h-8 min-w-[2rem] items-center justify-center rounded px-3 text-sm font-medium ${
                        isCurrentPage
                          ? "bg-primary text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => table.setPageIndex(pageIndex)}
                    >
                      {pageIndex + 1}
                    </button>
                  );
                }
              )}
            </div>

            <button
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
