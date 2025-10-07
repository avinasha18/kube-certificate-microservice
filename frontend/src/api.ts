import axios from 'axios';

export interface Credential {
  id: string;
  [key: string]: any;
}

export interface IssueResponse {
  success: boolean;
  message: string;
  worker?: string;
  issuedAt?: string;
}

export interface VerifyResponse {
  valid: boolean;
  worker?: string;
  issuedAt?: string;
  data?: any;
}

const ISSUANCE_SERVICE_URL = (import.meta as any).env?.VITE_ISSUANCE_SERVICE_URL || 'https://kube-certificate-microservice.onrender.com';
const VERIFICATION_SERVICE_URL = (import.meta as any).env?.VITE_VERIFICATION_SERVICE_URL || 'https://kube-certificate-microservice-1.onrender.com';

export const api = {
  issueCredential: async (credential: Credential): Promise<IssueResponse> => {
    const response = await axios.post(`${ISSUANCE_SERVICE_URL}/issue`, credential);
    return response.data;
  },

  verifyCredential: async (credential: Credential | { id: string }): Promise<VerifyResponse> => {
    const response = await axios.post(`${VERIFICATION_SERVICE_URL}/verify`, credential);
    return response.data;
  },

  checkHealth: async (service: 'issue' | 'verify'): Promise<any> => {
    const url = service === 'issue' ? ISSUANCE_SERVICE_URL : VERIFICATION_SERVICE_URL;
    const response = await axios.get(`${url}/health`);
    return response.data;
  }
};
