import { makeApi } from "convex/server";
import type { DataModel } from "../schema";

export const api = makeApi<DataModel>();
