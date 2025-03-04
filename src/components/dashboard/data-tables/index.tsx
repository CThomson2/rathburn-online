"use client";
import Breadcrumb from "../breadcrumbs/breadcrumb";
import DataTableOne from "./data-table-one";
import DataTableTwo from "./data-table-two";
import React from "react";

const DataTables: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Data Tables" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <DataTableOne />
        <DataTableTwo />
      </div>
    </>
  );
};

export default DataTables;
