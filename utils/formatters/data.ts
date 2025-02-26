/**
 * Type utility functions for transforming database types to frontend-friendly formats
 */

/**
 * Checks if a value is a Date object
 */
function isDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Converts Date objects to ISO strings for client-side consumption
 * This version works with any object, even if the field names aren't in the type
 *
 * @param obj Object with Date properties
 * @param dateFields Array of field names that should be converted
 * @returns New object with dates converted to strings
 */
export function formatDates<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  dateFields: K[]
): {
  [P in keyof T]: P extends K ? string | null : T[P];
} {
  const result = { ...obj } as any;

  dateFields.forEach((field) => {
    const value = obj[field];
    // Only convert if the field exists and is a Date
    if (field in obj) {
      result[field] = isDate(value) ? value.toISOString() : value || null;
    }
  });

  return result;
}

/**
 * Type for defining a mapper between database and frontend types
 */
export type TypeMapper<DbType, FrontendType> = (dbObj: DbType) => FrontendType;

/**
 * Creates a standard formatter function that formats dates and maps DB types to Frontend types
 * @param dateFields Array of field names to format as ISO strings
 * @returns Function that transforms an object's date fields
 */
export function createFormatter<T extends Record<string, any>, U = T>(
  dateFields: string[]
): (obj: T) => U {
  return (obj: T) => formatDates(obj, dateFields as any) as unknown as U;
}

/**
 * Utility to create a response formatter with pagination
 * @param formatter Function to format individual items
 * @returns Function that formats a paginated response
 */
export function createPaginatedFormatter<T, U>(
  formatter: (item: T) => U
): (response: { items: T[]; total: number }) => { items: U[]; total: number } {
  return ({ items, total }) => ({
    items: items.map(formatter),
    total,
  });
}
