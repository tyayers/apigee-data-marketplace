export class User {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  roles: string[] = [];
  photoUrl = "";
  providerId = "";
  developerData?: Developer;
  status = "";

  constructor(email: string, userName: string, firstName: string, lastName: string) {
    this.email = email;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
  }
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
  hubUrl?: string;
  hubMarketplaceId? = "";
  hubListingId? = "";
  status?: string;
  access?: string;
  pricing?: {tier: string, price: string, range: string}[] = [];
  attributes?: KeyValue[] = [];
  // New properties
  attrArray?: string[] = [];
  groupArray?: string[] = [];
  typeArray?: string[] = [];
}

export class DataProduct {
  id: string;
  ownerEmail: string;
  name: string;
  description: string;
  imageUrl: string = "/data_icon.png";
  specUrl: string = "https://raw.githubusercontent.com/tyayers/apigee-data-marketplace/main/specs/esg-analytics.yaml";
  specContents: string = "";
  specPrompt: string = "Generate an OpenAPI spec in json format with the name ${name} at the server https://${apigeeHost}. It should have one GET operation at the ${path} path, be authorized with an API key in the x-api-key header, and return the following data structure:";
  samplePayload: string = "";
  pricing: {tier: string, price: string, range: string}[] = [
    {
      "tier": "Starter",
      "price": "Free",
      "range": "20 API calls or file downloads per month"
    }
  ];
  status: string;
  source: string;
  entity: string;
  query: string;
  createdAt: string;
  protocols: string[];
  audiences: string[];
  categories: string[];

  constructor(id: string, email: string, name: string, description: string, status: string, source: string, entity: string, query: string, createdAt: string, protocols: string[], audiences: string[], categories: string[]) {
    this.id = id;
    this.ownerEmail = email;
    this.name = name;
    this.description = description;
    this.status = status;
    this.source = source;
    this.entity = entity;
    this.query = query;
    this.createdAt = createdAt;
    this.protocols = protocols;
    this.audiences = audiences;
    this.categories = categories;
  }
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

export class APIApp {
  appId: string = "";
  name: string = "";
  description?: string = "";
  createdAt: string = "";
  createdAtDate?: string = "";
  callbackUrl?: string;
  apiProducts?: string[];
  status?: string;
  credentials?: APIAppCredential[];
  attributes?: KeyValue[];
  error?: Error;
}

export class APIAppCredential {
  consumerKey: string = "";
  consumerSecret: string = "";
  issuedAt: string = "";
  expiresAt: string = "";
  scopes?: string[];
  apiProducts?: APIAppCredentialProduct[];
  status?: string;
  error?: Error;
}

export class APIAppCredentialProduct {
  apiproduct: string = "";
  status?: string = "";
}

export class APIApps {
  apps: APIApp[] = [];
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

export class AHSubscription {
  product: string = "";
  listingId: string = "";
  marketplaceId: string = "";
  project: string = "";
  dataset: string = "";
  createdAt: string = "";
  status?: string = "Inactive";
}

export class BucketSubscription {
  product: string = "";
  url: string = "";
  createdAt: string = "";
  status: string = "";
}

export class DisplayOptions {name: string = ""; displayName: string = ""; active: boolean = false};

export class UsageData {
  environments: UsageDataEnvironment[] = [];
}

export class UsageDataEnvironment {
  name: string = "";
  dimensions: UsageDataDimension[] = [];
}

export class UsageDataDimension {
  name: string = "";
  metrics: {name: string, values: {value: string, timesteamp: number}[]}[] = [];
}
