import { ordersCrud } from "./orders/crud";
import { materialsCrud } from "./materials/crud";

// New CRUD pattern exports
export const crud = {
  orders: ordersCrud,
  materials: materialsCrud,
};

// Re-export model modules
export * as orders from "./orders";
export * as materials from "./materials";
export * as transactions from "./transactions";
export * as drums from "./drums";
