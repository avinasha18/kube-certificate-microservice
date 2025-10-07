import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { DatabaseConfig } from "./config/database";
import credentialRoutes from "./routes/credentialRoutes";
import { ErrorHandler } from "./middleware/errorHandler";

export class App {
  private app: express.Application;
  private dbConfig: DatabaseConfig;

  constructor() {
    this.app = express();
    this.dbConfig = DatabaseConfig.getInstance();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true
    }));
    
    this.app.use(bodyParser.json({ limit: '10mb' }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    
    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    this.app.use("/", credentialRoutes);
  }

  private setupErrorHandling(): void {
    this.app.use(ErrorHandler.handleNotFound);
    this.app.use(ErrorHandler.handleError);
  }

  public async initialize(): Promise<void> {
    await this.dbConfig.initializeDatabase();
    console.log("Database initialized successfully");
  }

  public getApp(): express.Application {
    return this.app;
  }
}
