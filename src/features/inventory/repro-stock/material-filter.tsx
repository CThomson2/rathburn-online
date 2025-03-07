"use client";

import { useState, useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { ReproStock } from "./types";
import { Check, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

/**
 * MaterialFilter Component
 *
 * A filter component for filtering repro stock data by material type.
 *
 * Features:
 * 1. Dynamically extracts unique material types from table data
 * 2. Allows multi-select filtering of materials
 * 3. Displays count of active filters
 * 4. Provides option to clear all filters
 *
 * @param {Object} props - Component props
 * @param {Table<ReproStock>} props.table - TanStack table instance for repro stock data
 */
interface MaterialFilterProps {
  table: Table<ReproStock>;
}

export function MaterialFilter({ table }: MaterialFilterProps) {
  // State for tracking selected materials and popover open state
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // Extract unique materials from the data and sort alphabetically
  const materials = Array.from(
    new Set(
      table
        .getPreFilteredRowModel()
        .rows.map((row) => row.getValue("material") as string)
    )
  ).sort();

  // Apply the filter when selected materials change
  useEffect(() => {
    if (selectedMaterials.length === 0) {
      // Clear filter if no materials are selected
      table.getColumn("material")?.setFilterValue(undefined);
    } else {
      // Apply filter to only show rows with selected materials
      table.getColumn("material")?.setFilterValue((value: string) => {
        return selectedMaterials.includes(value);
      });
    }
  }, [selectedMaterials, table]);

  /**
   * Toggles a material in the selected materials list
   * @param {string} material - The material to toggle
   */
  const handleSelect = (material: string) => {
    setSelectedMaterials((prev) => {
      if (prev.includes(material)) {
        return prev.filter((m) => m !== material);
      }
      return [...prev, material];
    });
  };

  /**
   * Clears all selected material filters
   */
  const clearFilters = () => {
    setSelectedMaterials([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          Material
          {selectedMaterials.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedMaterials.length}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No materials found.</CommandEmpty>
            <CommandGroup>
              {materials.map((material) => (
                <CommandItem
                  key={material}
                  onSelect={() => handleSelect(material)}
                  className="flex items-center justify-between"
                >
                  <span>{material}</span>
                  {selectedMaterials.includes(material) && (
                    <Check className="h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {selectedMaterials.length > 0 && (
          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-xs"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
