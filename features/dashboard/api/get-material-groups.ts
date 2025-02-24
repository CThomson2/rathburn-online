import { api } from "@/lib/api-client";
import { MaterialGroupsResponse } from "../types/api";

export const getMaterialGroups = (): Promise<MaterialGroupsResponse> => {
  return api.get("/materials/groups");
};
