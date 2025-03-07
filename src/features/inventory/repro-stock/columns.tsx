import { ColumnDef } from "@tanstack/react-table";
import { ReproStock } from "../types";
import { formatDate } from "@/utils/format-date";

// Define the columns configuration for the repro stock table
export const columns: ColumnDef<ReproStock>[] = [
  {
    header: "Drum ID",
    accessorKey: "repro_drum_id",
    cell: ({ row }) => (
      <span className="font-medium text-primary">
        {row.getValue("repro_drum_id")}
      </span>
    ),
  },
  {
    header: "Date Created",
    accessorKey: "date_created",
    cell: ({ row }) => {
      const date = row.getValue("date_created") as string;
      return <span>{formatDate(date)}</span>;
    },
  },
  {
    header: "Material",
    accessorKey: "material",
    filterFn: "arrIncludesSome",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("material")}</span>
    ),
  },
  {
    header: "Capacity (L)",
    accessorKey: "capacity",
    cell: ({ row }) => <span>{row.getValue("capacity")} L</span>,
  },
  {
    header: "Current Volume (L)",
    accessorKey: "current_volume",
    cell: ({ row }) => <span>{row.getValue("current_volume")} L</span>,
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return <span>{formatDate(date)}</span>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            status === "available"
              ? "bg-success/10 text-success"
              : status === "in-use"
              ? "bg-warning/10 text-warning"
              : status === "damaged"
              ? "bg-danger/10 text-danger"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
];
