import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  extractions: defineTable({
    userId: v.string(),
    doseGrams: v.number(),
    yieldGrams: v.number(),
    timeSeconds: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId", "createdAt"]),
});

export type DataModel = typeof schema;

export default schema;
