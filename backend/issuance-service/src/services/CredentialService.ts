import { CredentialRepository } from "../repositories/CredentialRepository";
import { IssueRequest, IssueResponse, IssuedCredential } from "../models/Credential";
import axios from "axios";

export class CredentialService {
  private credentialRepository: CredentialRepository;
  private workerId: string;

  constructor() {
    this.credentialRepository = new CredentialRepository();
    this.workerId = `worker-${process.env.HOSTNAME ?? 'local'}`;
  }

  async issueCredential(credentialData: IssueRequest): Promise<IssueResponse> {
    // Check if credential already exists
    const exists = await this.credentialRepository.credentialExists(credentialData.id);
    if (exists) {
      return {
        success: false,
        message: "Credential already issued"
      };
    }

    // Create new credential
    const issuedAt = new Date().toISOString();
    const credential: IssuedCredential = {
      id: credentialData.id,
      data: JSON.stringify(credentialData),
      issuedAt,
      worker: this.workerId
    };

    // Store in database
    await this.credentialRepository.insertCredential(credential);

    // Sync with verification service
    await this.syncWithVerificationService(credential);

    return {
      success: true,
      message: `Credential issued by ${this.workerId}`,
      worker: this.workerId,
      issuedAt
    };
  }

  async getCredentialById(id: string): Promise<IssuedCredential | null> {
    return await this.credentialRepository.findCredentialById(id);
  }

  private async syncWithVerificationService(credential: IssuedCredential): Promise<void> {
    try {
      const verificationServiceUrl = process.env.VERIFICATION_SERVICE_URL || 'https://kube-certificate-microservice-1.onrender.com';
      await axios.post(`${verificationServiceUrl}/sync-credential`, {
        id: credential.id,
        data: credential.data,
        issuedAt: credential.issuedAt,
        worker: credential.worker
      }, {
        timeout: 5000, // 5 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.warn("Failed to sync with verification service:", error);
      // Continue with issuance even if sync fails
    }
  }

  getWorkerId(): string {
    return this.workerId;
  }
}
