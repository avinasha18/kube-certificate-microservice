export interface CredentialData {
  id: string;
  [key: string]: any;
}

export interface IssuedCredential {
  id: string;
  data: string;
  issuedAt: string;
  worker: string;
}

export interface IssueRequest {
  id: string;
  [key: string]: any;
}

export interface IssueResponse {
  success: boolean;
  message: string;
  worker?: string;
  issuedAt?: string;
}

export interface HealthResponse {
  status: string;
  worker: string;
}
