import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const listExtractions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return ctx.db
      .query("extractions")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const createExtraction = mutation({
  args: {
    doseGrams: v.number(),
    yieldGrams: v.number(),
    timeSeconds: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required.");
    }

    return ctx.db.insert("extractions", {
      userId: identity.subject,
      doseGrams: args.doseGrams,
      yieldGrams: args.yieldGrams,
      timeSeconds: args.timeSeconds,
      notes: args.notes,
      createdAt: Date.now(),
    });
  },
});
