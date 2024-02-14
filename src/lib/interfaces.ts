
export class AppUser {
  email = "";
  userName = "";
  photoUrl = "";
}

export class Products {
  products: Product[] = [];
}

export class Product {
  name: string = "";
  type?: string;
  displayName: string = "";
  description?: string;
  approvalType: string = "";
  imageUrl?: string;
  specUrl?: string;
  status?: string;
  access?: string;
}

export class ApiApp {
  appId: string = "";
  name: string = "";
  description?: string = "";
  createdAt: string = "";
  callbackUrl?: string;
  apiProducts?: string[];
  status?: string;
  credentials?: ApiAppCredential[];
  error?: Error;
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
  getProducts(): Promise<Products>;
  getProduct(name: string): Promise<Product>;
  createDeveloper(email: string, firstName: string, lastName: string, userName: string): void;
  getApiApps(email: string): Promise<ApiApps>;
  createApiApp(devEmail: string, appName: string, products: string[]): Promise<ApiApp>;
  getApiApp(devEmail: string,appId: string): Promise<ApiApp>;
}

