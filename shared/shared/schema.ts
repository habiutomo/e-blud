import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User-related schemas
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'administrator', 'keuangan', 'pimpinan'
  department: text("department").notNull(),
  email: text("email"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  department: true,
  email: true,
});

// Budget Planning schemas
export const budgetPlans = pgTable("budgetPlans", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  fiscalYear: integer("fiscalYear").notNull(),
  department: text("department").notNull(),
  status: text("status").notNull(), // 'draft', 'submitted', 'approved', 'rejected'
  totalAmount: doublePrecision("totalAmount").notNull(),
  submittedBy: integer("submittedBy").notNull(),
  approvedBy: integer("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  details: json("details"),
  notes: text("notes"),
});

export const insertBudgetPlanSchema = createInsertSchema(budgetPlans).pick({
  title: true,
  fiscalYear: true,
  department: true,
  status: true,
  totalAmount: true,
  submittedBy: true,
  approvedBy: true,
  details: true,
  notes: true,
});

// Budget Execution schemas
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'income', 'expense'
  category: text("category").notNull(),
  amount: doublePrecision("amount").notNull(),
  description: text("description").notNull(),
  department: text("department").notNull(),
  budgetPlanId: integer("budgetPlanId").notNull(),
  status: text("status").notNull(), // 'pending', 'approved', 'rejected', 'completed'
  submittedBy: integer("submittedBy").notNull(),
  approvedBy: integer("approvedBy"),
  transactionDate: timestamp("transactionDate").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow(),
  documentIds: json("documentIds"), // array of document IDs related to this transaction
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  type: true,
  category: true,
  amount: true,
  description: true,
  department: true,
  budgetPlanId: true,
  status: true,
  submittedBy: true,
  approvedBy: true,
  transactionDate: true,
  documentIds: true,
});

// Document schemas
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'RKA', 'SPP', 'LRA', etc.
  department: text("department").notNull(),
  status: text("status").notNull(), // 'draft', 'submitted', 'approved', 'rejected'
  content: json("content"),
  fileUrl: text("fileUrl"),
  submittedBy: integer("submittedBy").notNull(),
  approvedBy: integer("approvedBy"),
  submissionDate: timestamp("submissionDate"),
  approvalDate: timestamp("approvalDate"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  title: true,
  type: true,
  department: true,
  status: true,
  content: true,
  fileUrl: true,
  submittedBy: true,
  approvedBy: true,
  submissionDate: true,
  approvalDate: true,
});

// Reports schemas
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'financial', 'performance', 'accountability'
  period: text("period").notNull(), // 'monthly', 'quarterly', 'yearly'
  periodValue: text("periodValue").notNull(), // 'January 2025', 'Q1 2025', '2025'
  department: text("department").notNull(),
  content: json("content"),
  fileUrl: text("fileUrl"),
  generatedBy: integer("generatedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).pick({
  title: true,
  type: true,
  period: true,
  periodValue: true,
  department: true,
  content: true,
  fileUrl: true,
  generatedBy: true,
});

// Audit trail schemas
export const auditTrails = pgTable("auditTrails", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  action: text("action").notNull(),
  entityType: text("entityType").notNull(), // 'user', 'budget', 'transaction', 'document', 'report'
  entityId: integer("entityId").notNull(),
  details: json("details"),
  ipAddress: text("ipAddress"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertAuditTrailSchema = createInsertSchema(auditTrails).pick({
  userId: true,
  action: true,
  entityType: true,
  entityId: true,
  details: true,
  ipAddress: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBudgetPlan = z.infer<typeof insertBudgetPlanSchema>;
export type BudgetPlan = typeof budgetPlans.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

export type InsertAuditTrail = z.infer<typeof insertAuditTrailSchema>;
export type AuditTrail = typeof auditTrails.$inferSelect;
