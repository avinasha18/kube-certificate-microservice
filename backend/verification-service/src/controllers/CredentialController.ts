import { Request, Response } from "express";
import { CredentialService } from "../services/CredentialService";
import { VerifyRequest, SyncRequest } from "../models/Credential";

export class CredentialController {
  private credentialService: CredentialService;

  constructor() {
    this.credentialService = new CredentialService();
  }

  async verifyCredential(req: Request, res: Response): Promise<void> {
    try {
      const credentialData: VerifyRequest = req.body;
      
      if (!this.isValidVerifyRequest(credentialData)) {
        res.status(400).json({ 
          valid: false, 
          message: "Invalid credential format" 
        });
        return;
      }

      const result = await this.credentialService.verifyCredential(credentialData);
      res.json(result);
    } catch (error) {
      console.error("Error in verifyCredential controller:", error);
      res.status(500).json({ 
        valid: false, 
        message: "Internal server error" 
      });
    }
  }

  async syncCredential(req: Request, res: Response): Promise<void> {
    try {
      const syncData: SyncRequest = req.body;
      
      if (!this.isValidSyncRequest(syncData)) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid sync data" 
        });
        return;
      }

      await this.credentialService.syncCredential(syncData);
      res.json({ success: true, message: "Credential synced successfully" });
    } catch (error) {
      console.error("Error in syncCredential controller:", error);
      res.status(500).json({ 
        success: false, 
        message: "Sync failed" 
      });
    }
  }

  getHealthStatus(req: Request, res: Response): void {
    const response = {
      status: "ok",
      worker: this.credentialService.getWorkerId()
    };
    res.json(response);
  }

  private isValidVerifyRequest(credential: any): boolean {
    return credential && typeof credential === 'object';
  }

  private isValidSyncRequest(syncData: any): boolean {
    return syncData && 
           typeof syncData === 'object' &&
           syncData.id &&
           syncData.data &&
           syncData.issuedAt &&
           syncData.worker;
  }
}
