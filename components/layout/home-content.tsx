"use client";

import { paths } from "@/config/paths";
import { motion } from "framer-motion";

interface GridCellProps {
  title: string;
  href?: string;
  description?: string;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary";
}

const GridCell = ({
  title,
  href,
  description,
  className = "",
  variant = "primary",
}: GridCellProps) => {
  const Wrapper = href ? motion.a : motion.div;

  const variantStyles = {
    primary: "bg-white dark:bg-gray-800",
    secondary: "bg-gray-50 dark:bg-gray-700",
    tertiary: "bg-white dark:bg-gray-800",
  };

  return (
    <Wrapper
      href={href}
      className={`
        flex flex-col justify-center items-center p-6
        ${variantStyles[variant]}
        rounded-xl
        border border-gray-100 dark:border-gray-700
        transition-all duration-300 ease-in-out
        ${href ? "hover:scale-[1.02] hover:shadow-lg cursor-pointer" : ""}
        ${className}
      `}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
          {description}
        </p>
      )}
    </Wrapper>
  );
};

export function HomeContent() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Inventory Management System
        </h1>

        <div className="space-y-8">
          {/* Dashboard Section */}
          <div className="space-y-0">
            <GridCell
              title="DASHBOARD"
              href="/dashboard"
              className="col-span-3"
            />
            <div className="grid grid-cols-3 gap-4 mt-1">
              <GridCell
                title="STOCK REPORTS"
                href="/dashboard/stock"
                variant="secondary"
              />
              <GridCell
                title="PRODUCTION ANALYTICS"
                href="/dashboard/production"
                variant="secondary"
              />
              <GridCell
                title="SALES & TAX"
                href="/dashboard/sales"
                variant="secondary"
              />
            </div>
          </div>

          {/* Raw Materials Section */}
          <div className="space-y-1">
            <GridCell
              title="RAW MATERIALS"
              href="/materials"
              className="col-span-3"
            />
            <div className="grid grid-cols-3 gap-4">
              <GridCell title="NEW ORDER" href="/materials/order" />
              <GridCell
                title="INVENTORY MANAGEMENT"
                href="/materials/inventory"
              />
              <GridCell title="REPRO DRUMS" href="/materials/repro" />
            </div>
          </div>

          {/* Reference Section */}
          <div className="space-y-1">
            <GridCell
              title="REFERENCE INFO"
              href="/reference"
              className="col-span-3"
            />
            <div className="grid grid-cols-3 gap-4">
              <GridCell title="PRODUCT RANGE" href="/reference/products" />
              <GridCell title="MATERIALS" href="/reference/materials" />
              <GridCell title="SUPPLIERS" href="/reference/suppliers" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
