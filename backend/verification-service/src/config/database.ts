import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private dbPath: string;

  private constructor() {
    this.dbPath = process.env.DB_PATH || path.join(__dirname, "..", "data", "verification.db");
  }

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public getDbPath(): string {
    return this.dbPath;
  }

  public async initializeDatabase(): Promise<void> {
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const db = await open({ 
      filename: this.dbPath, 
      driver: sqlite3.Database 
    });
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS credentials (
        id TEXT PRIMARY KEY, 
        data TEXT, 
        issuedAt TEXT,
        worker TEXT
      )
    `);
    
    await db.close();
  }
}
