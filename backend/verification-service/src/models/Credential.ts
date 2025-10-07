export interface CredentialData {
  id: string;
  [key: string]: any;
}

export interface VerifiedCredential {
  id: string;
  data: string;
  issuedAt: string;
  worker: string;
}

export interface VerifyRequest {
  id?: string;
  [key: string]: any;
}

export interface VerifyResponse {
  valid: boolean;
  worker?: string;
  issuedAt?: string;
  data?: any;
  message?: string;
}

export interface HealthResponse {
  status: string;
  worker: string;
}

export interface SyncRequest {
  id: string;
  data: string;
  issuedAt: string;
  worker: string;
}
