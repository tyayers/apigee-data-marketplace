import type { ApiProducts, Apps, App } from "apigee-x-module";

export class AppUser {
  email = "";
  photoUrl = "";
}

export class ApiApp {
  appId: string = "";
  name: string = "";
  description: string = "";
  products: string[] = [];
  createdAt: string = "";
  credentials?: ApiAppCredential[];
  status?: string = "";
}

export class ApiAppCredential {
  consumerKey: string = "";
  consumerSecret: string = "";
  issuedAt?: string = "";
  expiresAt?: string = "";
  scopes?: string[];
  apiProducts?: ApiAppCredentialProduct[];
  status?: string;
  error?: Error;
}

export class ApiAppCredentialProduct {
  apiproduct: string = "";
  status?: string = "";
}

export class ApiApps {
  apps: ApiApp[] = [];
}

export interface DataInterface {
  getProducts(): Promise<ApiProducts>;
  getApiApps(): Promise<ApiApps>;
  createApiApp(devEmail: string, appName: string, products: string[]): Promise<ApiApp>;
  getApiApp(devEmail: string,appId: string): Promise<ApiApp>;
}

