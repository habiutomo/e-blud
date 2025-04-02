import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertBudgetPlanSchema, 
  insertTransactionSchema, 
  insertDocumentSchema, 
  insertReportSchema 
} from "@shared/schema";

// Middleware to check authentication
const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check user role
const hasRole = (roles: string[]) => {
  return (req: Request, res: Response, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (roles.includes(req.user.role)) {
      return next();
    }
    
    res.status(403).json({ message: "Forbidden: Insufficient permissions" });
  };
};

// Create audit trail helper
const createAudit = async (req: Request, action: string, entityType: string, entityId: number, details: any = {}) => {
  if (!req.user) return;
  
  await storage.createAuditTrail({
    userId: req.user.id,
    action,
    entityType,
    entityId,
    details,
    ipAddress: req.ip || "127.0.0.1"
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Budget Plans routes
  app.post("/api/budget-plans", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBudgetPlanSchema.parse({
        ...req.body,
        submittedBy: req.user.id
      });
      
      const budgetPlan = await storage.createBudgetPlan(validatedData);
      
      // Create audit trail
      await createAudit(req, "create", "budget", budgetPlan.id, {
        title: budgetPlan.title,
        fiscalYear: budgetPlan.fiscalYear
      });
      
      res.status(201).json(budgetPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create budget plan" });
    }
  });

  app.get("/api/budget-plans", isAuthenticated, async (req, res) => {
    try {
      const fiscalYear = req.query.fiscalYear ? parseInt(req.query.fiscalYear as string) : null;
      const department = req.query.department as string;
      
      let budgetPlans;
      if (fiscalYear) {
        budgetPlans = await storage.getBudgetPlansByFiscalYear(fiscalYear);
      } else if (department) {
        budgetPlans = await storage.getBudgetPlansByDepartment(department);
      } else {
        // In a real app with a database, we would implement pagination
        budgetPlans = [];
      }
      
      res.json(budgetPlans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budget plans" });
    }
  });

  app.get("/api/budget-plans/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const budgetPlan = await storage.getBudgetPlan(id);
      
      if (!budgetPlan) {
        return res.status(404).json({ message: "Budget plan not found" });
      }
      
      res.json(budgetPlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budget plan" });
    }
  });

  app.patch("/api/budget-plans/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const budgetPlan = await storage.getBudgetPlan(id);
      
      if (!budgetPlan) {
        return res.status(404).json({ message: "Budget plan not found" });
      }
      
      // In a real app, we would check permissions here
      const updatedPlan = await storage.updateBudgetPlan(id, {
        ...req.body,
        updatedAt: new Date()
      });
      
      // Create audit trail
      await createAudit(req, "update", "budget", id, {
        changes: req.body
      });
      
      res.json(updatedPlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to update budget plan" });
    }
  });
  
  // Transaction routes
  app.post("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        submittedBy: req.user.id
      });
      
      const transaction = await storage.createTransaction(validatedData);
      
      // Create audit trail
      await createAudit(req, "create", "transaction", transaction.id, {
        type: transaction.type,
        amount: transaction.amount
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.get("/api/transactions/recent", isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const transactions = await storage.getRecentTransactions(limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent transactions" });
    }
  });

  app.get("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const budgetPlanId = req.query.budgetPlanId ? parseInt(req.query.budgetPlanId as string) : null;
      const department = req.query.department as string;
      
      let transactions;
      if (budgetPlanId) {
        transactions = await storage.getTransactionsByBudgetPlan(budgetPlanId);
      } else if (department) {
        transactions = await storage.getTransactionsByDepartment(department);
      } else {
        // In a real app with a database, we would implement pagination
        transactions = [];
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.patch("/api/transactions/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransaction(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      // In a real app, we would check permissions here
      const updatedTransaction = await storage.updateTransaction(id, req.body);
      
      // Create audit trail
      await createAudit(req, "update", "transaction", id, {
        changes: req.body
      });
      
      res.json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });
  
  // Document routes
  app.post("/api/documents", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse({
        ...req.body,
        submittedBy: req.user.id
      });
      
      const document = await storage.createDocument(validatedData);
      
      // Create audit trail
      await createAudit(req, "create", "document", document.id, {
        title: document.title,
        type: document.type
      });
      
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  app.get("/api/documents/pending", isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const documents = await storage.getPendingDocuments(limit);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending documents" });
    }
  });

  app.get("/api/documents", isAuthenticated, async (req, res) => {
    try {
      const status = req.query.status as string;
      const department = req.query.department as string;
      
      let documents;
      if (status) {
        documents = await storage.getDocumentsByStatus(status);
      } else if (department) {
        documents = await storage.getDocumentsByDepartment(department);
      } else {
        // In a real app with a database, we would implement pagination
        documents = [];
      }
      
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.patch("/api/documents/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // In a real app, we would check permissions here
      const updatedDocument = await storage.updateDocument(id, req.body);
      
      // Create audit trail
      await createAudit(req, "update", "document", id, {
        changes: req.body
      });
      
      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ message: "Failed to update document" });
    }
  });
  
  // Report routes
  app.post("/api/reports", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse({
        ...req.body,
        generatedBy: req.user.id
      });
      
      const report = await storage.createReport(validatedData);
      
      // Create audit trail
      await createAudit(req, "create", "report", report.id, {
        title: report.title,
        type: report.type
      });
      
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get("/api/reports", isAuthenticated, async (req, res) => {
    try {
      const type = req.query.type as string;
      const department = req.query.department as string;
      
      let reports;
      if (type) {
        reports = await storage.getReportsByType(type);
      } else if (department) {
        reports = await storage.getReportsByDepartment(department);
      } else {
        // In a real app with a database, we would implement pagination
        reports = [];
      }
      
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getReport(id);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });
  
  // Audit trail routes (admin only)
  app.get("/api/audit-trails", hasRole(["administrator"]), async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      const entityType = req.query.entityType as string;
      const entityId = req.query.entityId ? parseInt(req.query.entityId as string) : null;
      
      let auditTrails;
      if (userId) {
        auditTrails = await storage.getAuditTrailsByUser(userId);
      } else if (entityType && entityId) {
        auditTrails = await storage.getAuditTrailsByEntity(entityType, entityId);
      } else {
        // In a real app with a database, we would implement pagination
        auditTrails = [];
      }
      
      res.json(auditTrails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit trails" });
    }
  });

  // Dashboard data route
  app.get("/api/dashboard", isAuthenticated, async (req, res) => {
    try {
      // In a real application, this would be fetched from the database
      const dashboardData = {
        budgetOverview: {
          totalBudget: 12500000000, // Rp 12.5M
          realization: 7800000000, // Rp 7.8M
          remaining: 4700000000, // Rp 4.7M
          documentCount: 143
        },
        budgetDistribution: [
          { name: "Program Kesehatan", percentage: 45 },
          { name: "Pendidikan", percentage: 25 },
          { name: "Administrasi", percentage: 20 },
          { name: "Lainnya", percentage: 10 }
        ],
        monthlyRealization: [
          { month: "Jan", amount: 700000000 },
          { month: "Feb", amount: 950000000 },
          { month: "Mar", amount: 1200000000 },
          { month: "Apr", amount: 1000000000 },
          { month: "May", amount: 1350000000 },
          { month: "Jun", amount: 1500000000 },
          { month: "Jul", amount: 1400000000 },
          { month: "Aug", amount: 1800000000 },
          { month: "Sep", amount: 1350000000 },
          { month: "Oct", amount: 0 },
          { month: "Nov", amount: 0 },
          { month: "Dec", amount: 0 }
        ]
      };
      
      const recentTransactions = await storage.getRecentTransactions(4);
      const pendingDocuments = await storage.getPendingDocuments(4);
      
      res.json({
        ...dashboardData,
        recentTransactions,
        pendingDocuments
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
