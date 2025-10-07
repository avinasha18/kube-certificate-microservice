import { Request, Response } from "express";
import { CredentialService } from "../services/CredentialService";
import { IssueRequest } from "../models/Credential";

export class CredentialController {
  private credentialService: CredentialService;

  constructor() {
    this.credentialService = new CredentialService();
  }

  async issueCredential(req: Request, res: Response): Promise<void> {
    try {
      const credentialData: IssueRequest = req.body;
      
      // Validate required fields
      if (!this.isValidCredential(credentialData)) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid credential data. 'id' field is required." 
        });
        return;
      }

      const result = await this.credentialService.issueCredential(credentialData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      console.error("Error in issueCredential controller:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  }

  async getCredentialById(req: Request, res: Response): Promise<void> {
    try {
      const credentialId = decodeURIComponent(req.params.id);
      const credential = await this.credentialService.getCredentialById(credentialId);
      
      if (credential) {
        res.json({
          issued: true,
          issuedAt: credential.issuedAt,
          data: credential.data,
          worker: credential.worker
        });
      } else {
        res.status(404).json({
          issued: false,
          message: "Credential not found"
        });
      }
    } catch (error) {
      console.error("Error in getCredentialById controller:", error);
      res.status(500).json({ 
        issued: false, 
        message: "Internal server error" 
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

  private isValidCredential(credential: any): boolean {
    return credential && 
           typeof credential === 'object' && 
           credential.id && 
           typeof credential.id === 'string' && 
           credential.id.trim().length > 0;
  }
}
