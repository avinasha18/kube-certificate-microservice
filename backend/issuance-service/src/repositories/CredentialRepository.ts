import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { DatabaseConfig } from "../config/database";
import { IssuedCredential } from "../models/Credential";

export class CredentialRepository {
  private dbConfig: DatabaseConfig;

  constructor() {
    this.dbConfig = DatabaseConfig.getInstance();
  }

  async insertCredential(credential: IssuedCredential): Promise<void> {
    const db = await open({ 
      filename: this.dbConfig.getDbPath(), 
      driver: sqlite3.Database 
    });
    
    try {
      await db.run(
        `INSERT INTO credentials (id, data, issuedAt, worker) VALUES (?, ?, ?, ?)`, 
        credential.id, 
        credential.data, 
        credential.issuedAt,
        credential.worker
      );
    } finally {
      await db.close();
    }
  }

  async findCredentialById(id: string): Promise<IssuedCredential | null> {
    const db = await open({ 
      filename: this.dbConfig.getDbPath(), 
      driver: sqlite3.Database 
    });
    
    try {
      const row = await db.get(
        `SELECT * FROM credentials WHERE id = ?`, 
        id
      );
      
      return row || null;
    } finally {
      await db.close();
    }
  }

  async credentialExists(id: string): Promise<boolean> {
    const credential = await this.findCredentialById(id);
    return credential !== null;
  }
}
