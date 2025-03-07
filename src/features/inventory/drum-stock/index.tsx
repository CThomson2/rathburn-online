"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  ColumnDef,
  ColumnSort,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  Row,
} from "@tanstack/react-table";

// Example shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

// ------------------------------------------------------
// 1) Define the shape of a single drum record
// ------------------------------------------------------
interface Drum {
  drum_id: number;
  po_number: string;
  material: string;
  in_stock: boolean;
  supplier: string;
  created_at: string; // or Date
  // add other fields as needed
}

// A "GroupRow" can hold subRows for each PO number
interface GroupRow {
  // We'll store the shared fields (like po_number) here
  po_number: string;
  supplier: string;
  material: string;
  // Optionally any aggregated info, e.g. total drums in that PO
  totalDrums: number;

  // The actual child drum records
  subRows: Drum[];
}

// ------------------------------------------------------
// 2) Fetch data & group by po_number
// ------------------------------------------------------
async function fetchDrums(): Promise<Drum[]> {
  const res = await fetch("/api/drums");
  if (!res.ok) {
    throw new Error("Failed to fetch drums");
  }
  return res.json();
}

function groupByPO(drums: Drum[]): GroupRow[] {
  // create a map keyed by po_number
  const map = new Map<string, Drum[]>();

  for (const drum of drums) {
    if (!map.has(drum.po_number)) {
      map.set(drum.po_number, []);
    }
    map.get(drum.po_number)!.push(drum);
  }

  // build the array of group rows
  const groupRows: GroupRow[] = [];
  for (const [po_number, subRows] of map.entries()) {
    // Assume each group has uniform supplier/material in your business logic
    const first = subRows[0];
    groupRows.push({
      po_number,
      supplier: first.supplier,
      material: first.material,
      totalDrums: subRows.length,
      subRows,
    });
  }
  return groupRows;
}

// ------------------------------------------------------
// 3) Define TanStack Table columns
// ------------------------------------------------------
const columns: ColumnDef<GroupRow>[] = [
  // Expander column
  {
    id: "expander",
    header: "",
    cell: ({ row }) =>
      // row.getCanExpand() is built-in. We'll use subRows to handle expansions
      row.getCanExpand() ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={row.getToggleExpandedHandler()}
          className="mr-2"
        >
          {row.getIsExpanded() ? "▼" : "▶"}
        </Button>
      ) : null,
  },
  {
    accessorKey: "po_number",
    header: "PO #",
    // We can enable sorting if needed
    enableSorting: true,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    enableSorting: true,
  },
  {
    accessorKey: "material",
    header: "Material",
    enableSorting: true,
  },
  {
    accessorKey: "totalDrums",
    header: "Count",
    enableSorting: false,
    cell: (info) => info.getValue(),
  },
];

// ------------------------------------------------------
// 4) The main table component
// ------------------------------------------------------
export default function GroupedDrumsTable() {
  // fetch data
  const {
    data: drums,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["drums"],
    queryFn: fetchDrums,
  });

  // group them by po_number
  const groupedData = useMemo(() => {
    if (!drums) return [];
    return groupByPO(drums);
  }, [drums]);

  // define the table
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data: groupedData,
    columns,
    state: {
      sorting,
      expanded,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // If you want pagination, define pageCount or let it handle client pagination
    manualPagination: false,
  });

  // Expand or collapse all
  const handleExpandAll = () => {
    // build an object that sets each rowId to true
    const newExpanded: Record<string, boolean> = {};
    table.getRowModel().rows.forEach((row) => {
      newExpanded[row.id] = true;
    });
    setExpanded(newExpanded);
  };

  const handleCollapseAll = () => {
    setExpanded({});
  };

  if (isLoading) return <div className="p-4">Loading drums...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading data</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleExpandAll}>
          Expand All
        </Button>
        <Button variant="outline" onClick={handleCollapseAll}>
          Collapse All
        </Button>
      </div>

      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="whitespace-nowrap">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>

              {/* If expanded, render subRows: these are the actual Drums */}
              {row.getIsExpanded() && (
                <tr>
                  <td colSpan={row.getVisibleCells().length}>
                    <SubRowTable drums={row.original.subRows} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Basic pagination controls */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}

// ------------------------------------------------------
// 5) SubRowTable for child drum records
// ------------------------------------------------------
function SubRowTable({ drums }: { drums: Drum[] }) {
  // For simplicity, just show a mini table or a list
  // Optionally you can also create a small TanStack sub-table
  return (
    <div className="p-2 ml-6 bg-slate-50 rounded-md border border-slate-200">
      <h4 className="font-medium mb-2">Drums in this order:</h4>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-300">
            <th className="p-2 text-left">Drum ID</th>
            <th className="p-2 text-left">Material</th>
            <th className="p-2 text-left">In Stock?</th>
            <th className="p-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {drums.map((drum) => (
            <tr key={drum.drum_id} className="border-b last:border-0">
              <td className="p-2">{drum.drum_id}</td>
              <td className="p-2">{drum.material}</td>
              <td className="p-2">
                {drum.in_stock ? (
                  <span className="text-green-600">Yes</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </td>
              <td className="p-2">
                {new Date(drum.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
