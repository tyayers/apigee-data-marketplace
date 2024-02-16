export class AppUser {
  email = "";
  userName = "";
  photoUrl = "";
  developerData?: Developer;
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
  attributes?: KeyValue[] = [];
  // New properties
  attrArray?: string[] = [];
  groupArray?: string[] = [];
  typeArray?: string[] = [];
}

export class Developer {
  email: string = "";
  firstName: string = "";
  lastName: string = "";
  userName: string = "";
  developerId?: string;
  organizationName?: string;
  createdAt?: string;
  lastModifiedAt?: string;
  status?: string;
  apps?: string[];
  error?: Error;
  attributes?: KeyValue[];
}

export class ApiApp {
  appId: string = "";
  name: string = "";
  description?: string = "";
  createdAt: string = "";
  createdAtDate?: string = "";
  callbackUrl?: string;
  apiProducts?: string[];
  status?: string;
  credentials?: ApiAppCredential[];
  error?: Error;
}

export class ApiAppCredential {
  consumerKey: string = "";
  consumerSecret: string = "";
  issuedAt: string = "";
  expiresAt: string = "";
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

export interface KeyValue {
  name: string;
  value: string;
}

export interface Error {
  code: string;
  message: string;
  status: string;
}