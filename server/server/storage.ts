import { 
  User, InsertUser, 
  BudgetPlan, InsertBudgetPlan,
  Transaction, InsertTransaction,
  Document, InsertDocument,
  Report, InsertReport,
  AuditTrail, InsertAuditTrail
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define the storage interface
export interface IStorage {
  // User-related methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Budget planning methods
  createBudgetPlan(plan: InsertBudgetPlan): Promise<BudgetPlan>;
  getBudgetPlan(id: number): Promise<BudgetPlan | undefined>;
  getBudgetPlansByDepartment(department: string): Promise<BudgetPlan[]>;
  getBudgetPlansByFiscalYear(year: number): Promise<BudgetPlan[]>;
  updateBudgetPlan(id: number, plan: Partial<BudgetPlan>): Promise<BudgetPlan | undefined>;
  
  // Transaction methods
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByDepartment(department: string): Promise<Transaction[]>;
  getTransactionsByBudgetPlan(budgetPlanId: number): Promise<Transaction[]>;
  getRecentTransactions(limit?: number): Promise<Transaction[]>;
  updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction | undefined>;
  
  // Document methods
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByDepartment(department: string): Promise<Document[]>;
  getDocumentsByStatus(status: string): Promise<Document[]>;
  getPendingDocuments(limit?: number): Promise<Document[]>;
  updateDocument(id: number, document: Partial<Document>): Promise<Document | undefined>;
  
  // Report methods
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: number): Promise<Report | undefined>;
  getReportsByDepartment(department: string): Promise<Report[]>;
  getReportsByType(type: string): Promise<Report[]>;
  updateReport(id: number, report: Partial<Report>): Promise<Report | undefined>;
  
  // Audit trail methods
  createAuditTrail(audit: InsertAuditTrail): Promise<AuditTrail>;
  getAuditTrail(id: number): Promise<AuditTrail | undefined>;
  getAuditTrailsByUser(userId: number): Promise<AuditTrail[]>;
  getAuditTrailsByEntity(entityType: string, entityId: number): Promise<AuditTrail[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private budgetPlans: Map<number, BudgetPlan>;
  private transactions: Map<number, Transaction>;
  private documents: Map<number, Document>;
  private reports: Map<number, Report>;
  private auditTrails: Map<number, AuditTrail>;
  
  sessionStore: session.SessionStore;
  currentUserId: number;
  currentBudgetPlanId: number;
  currentTransactionId: number;
  currentDocumentId: number;
  currentReportId: number;
  currentAuditTrailId: number;

  constructor() {
    this.users = new Map();
    this.budgetPlans = new Map();
    this.transactions = new Map();
    this.documents = new Map();
    this.reports = new Map();
    this.auditTrails = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    this.currentUserId = 1;
    this.currentBudgetPlanId = 1;
    this.currentTransactionId = 1;
    this.currentDocumentId = 1;
    this.currentReportId = 1;
    this.currentAuditTrailId = 1;
    
    // Initialize with an admin user (for testing purposes)
    // This will be removed in production
    this.createUser({
      username: "admin",
      password: "admin123", // This will be hashed by auth.ts
      name: "Admin SKPD",
      role: "administrator",
      department: "Dinas Kesehatan",
      email: "admin@blud.go.id"
    });
  }

  // User-related methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Budget planning methods
  async createBudgetPlan(plan: InsertBudgetPlan): Promise<BudgetPlan> {
    const id = this.currentBudgetPlanId++;
    const budgetPlan: BudgetPlan = {
      ...plan,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.budgetPlans.set(id, budgetPlan);
    return budgetPlan;
  }
  
  async getBudgetPlan(id: number): Promise<BudgetPlan | undefined> {
    return this.budgetPlans.get(id);
  }
  
  async getBudgetPlansByDepartment(department: string): Promise<BudgetPlan[]> {
    return Array.from(this.budgetPlans.values()).filter(
      (plan) => plan.department === department
    );
  }
  
  async getBudgetPlansByFiscalYear(year: number): Promise<BudgetPlan[]> {
    return Array.from(this.budgetPlans.values()).filter(
      (plan) => plan.fiscalYear === year
    );
  }
  
  async updateBudgetPlan(id: number, planUpdate: Partial<BudgetPlan>): Promise<BudgetPlan | undefined> {
    const plan = await this.getBudgetPlan(id);
    if (!plan) return undefined;
    
    const updatedPlan = { 
      ...plan, 
      ...planUpdate,
      updatedAt: new Date()
    };
    this.budgetPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  // Transaction methods
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const newTransaction: Transaction = {
      ...transaction,
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }
  
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getTransactionsByDepartment(department: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (t) => t.department === department
    );
  }
  
  async getTransactionsByBudgetPlan(budgetPlanId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (t) => t.budgetPlanId === budgetPlanId
    );
  }
  
  async getRecentTransactions(limit = 5): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  
  async updateTransaction(id: number, transactionUpdate: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = await this.getTransaction(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { 
      ...transaction, 
      ...transactionUpdate
    };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  // Document methods
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const newDocument: Document = {
      ...document,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }
  
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async getDocumentsByDepartment(department: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.department === department
    );
  }
  
  async getDocumentsByStatus(status: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.status === status
    );
  }
  
  async getPendingDocuments(limit = 5): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.status === "submitted")
      .sort((a, b) => b.submissionDate 
        ? b.submissionDate.getTime() 
        : b.createdAt.getTime() - (a.submissionDate 
          ? a.submissionDate.getTime() 
          : a.createdAt.getTime()))
      .slice(0, limit);
  }
  
  async updateDocument(id: number, documentUpdate: Partial<Document>): Promise<Document | undefined> {
    const document = await this.getDocument(id);
    if (!document) return undefined;
    
    const updatedDocument = { 
      ...document, 
      ...documentUpdate,
      updatedAt: new Date()
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  // Report methods
  async createReport(report: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const newReport: Report = {
      ...report,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reports.set(id, newReport);
    return newReport;
  }
  
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }
  
  async getReportsByDepartment(department: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.department === department
    );
  }
  
  async getReportsByType(type: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.type === type
    );
  }
  
  async updateReport(id: number, reportUpdate: Partial<Report>): Promise<Report | undefined> {
    const report = await this.getReport(id);
    if (!report) return undefined;
    
    const updatedReport = { 
      ...report, 
      ...reportUpdate,
      updatedAt: new Date()
    };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  // Audit trail methods
  async createAuditTrail(audit: InsertAuditTrail): Promise<AuditTrail> {
    const id = this.currentAuditTrailId++;
    const newAudit: AuditTrail = {
      ...audit,
      id,
      timestamp: new Date()
    };
    this.auditTrails.set(id, newAudit);
    return newAudit;
  }
  
  async getAuditTrail(id: number): Promise<AuditTrail | undefined> {
    return this.auditTrails.get(id);
  }
  
  async getAuditTrailsByUser(userId: number): Promise<AuditTrail[]> {
    return Array.from(this.auditTrails.values()).filter(
      (audit) => audit.userId === userId
    );
  }
  
  async getAuditTrailsByEntity(entityType: string, entityId: number): Promise<AuditTrail[]> {
    return Array.from(this.auditTrails.values()).filter(
      (audit) => audit.entityType === entityType && audit.entityId === entityId
    );
  }
}

export const storage = new MemStorage();
