"use client";

import { useState, useEffect, useMemo } from "react";
import { Table } from "@tanstack/react-table";
import { ReproStock } from "../types";
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

interface MaterialFilterProps {
  table: Table<ReproStock>;
}

export function MaterialFilter({ table }: MaterialFilterProps) {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // Get unique materials from the original data
  const materials = useMemo(() => {
    // Use original data to get all possible materials
    const uniqueMaterials = new Set<string>();
    table.options.data.forEach((row) => {
      const material = row.material;
      if (material) {
        uniqueMaterials.add(material);
      }
    });
    return Array.from(uniqueMaterials).sort();
  }, [table.options.data]);

  // Apply the filter when selected materials change
  useEffect(() => {
    if (selectedMaterials.length === 0) {
      table.getColumn("material")?.setFilterValue(undefined);
    } else {
      table.getColumn("material")?.setFilterValue(selectedMaterials);
    }
  }, [selectedMaterials, table]);

  const handleSelect = (material: string) => {
    setSelectedMaterials((prev: string[]) => {
      if (prev.includes(material)) {
        return prev.filter((m: string) => m !== material);
      }
      return [...prev, material];
    });
  };

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
