import { CredentialRepository } from "../repositories/CredentialRepository";
import { VerifyRequest, VerifyResponse, VerifiedCredential, SyncRequest } from "../models/Credential";

export class CredentialService {
  private credentialRepository: CredentialRepository;
  private workerId: string;

  constructor() {
    this.credentialRepository = new CredentialRepository();
    this.workerId = `worker-${process.env.HOSTNAME ?? 'local'}`;
  }

  async verifyCredential(credentialData: VerifyRequest): Promise<VerifyResponse> {
    const credentialId = this.extractCredentialId(credentialData);
    
    if (!credentialId) {
      return {
        valid: false,
        message: "Invalid credential format"
      };
    }

    const credential = await this.credentialRepository.findCredentialById(credentialId);
    
    if (!credential) {
      return {
        valid: false
      };
    }

    return {
      valid: true,
      worker: this.workerId,
      issuedAt: credential.issuedAt,
      data: credential.data ? JSON.parse(credential.data) : null
    };
  }

  async syncCredential(syncData: SyncRequest): Promise<void> {
    const credential: VerifiedCredential = {
      id: syncData.id,
      data: syncData.data,
      issuedAt: syncData.issuedAt,
      worker: syncData.worker
    };

    await this.credentialRepository.insertCredential(credential);
  }

  getWorkerId(): string {
    return this.workerId;
  }

  private extractCredentialId(credential: VerifyRequest): string | null {
    if (!credential || typeof credential !== 'object') {
      return null;
    }

    if (credential.id) {
      return credential.id;
    }

    if (Object.keys(credential).length === 0) {
      return null;
    }

    return JSON.stringify(credential);
  }
}
