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
  ownerName: string = "";
  name: string;
  description: string;
  imageUrl: string = "/data_icon.png";
  specUrl: string = "https://raw.githubusercontent.com/tyayers/apigee-data-marketplace/main/specs/esg-analytics.yaml";
  specContents: string = "";
  specPrompt: string = "Generate an OpenAPI spec in json format with the name ${name} at the server https://${apigeeHost}. It should have one GET operation at the ${path} path, be authorized with an API key in the x-api-key header, and return the following data structure:";
  samplePayload: string = "";
  analyticsHubMarketplaceId: string = "";
  analyticsHubListingId: string = "";
  monetizationId: string = "";
  monetizationData?: MonetizationRatePlan;
  status: string;
  source: string;
  entity: string;
  query: string;
  sla: SLA = new SLA("no_sla_5k3j", "no_sla_5k3j")
  createdAt: string;
  protocols: string[];
  audiences: string[];
  categories: string[];

  constructor(id: string, email: string, ownerName: string, name: string, description: string, status: string, source: string, entity: string, query: string, createdAt: string, protocols: string[], audiences: string[], categories: string[]) {
    this.id = id;
    this.ownerEmail = email;
    this.ownerName = ownerName;
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

export class ApiApp {
  appId: string = "";
  name: string = "";
  description: string = "";
  apiProducts: string[] = [];
  createdAt: string = "";
  createdAtDate?: string = "";
  callbackUrl?: string;
  status?: string;
  credentials?: ApiAppCredential[];
  attributes?: KeyValue[];
  error?: Error;

  constructor(name: string, description: string, apiProducts: string[]) {
    this.name = name;
    this.description = description;
    this.apiProducts = apiProducts;
  }
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

export class AnalyticsHubSubscription {
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
  metrics: {name: string, values: {value: string, timestamp: number}[]}[] = [];
}

export class IdentityConfig {
  id: string;
  roles: string[];

  constructor(id: string, roles: string[]) {
    this.id = id;
    this.roles = roles;
  }
}

export class SLA {
  id: string;
  name: string;
  description: string = "";
  upTimeInPercent: string = "";
  maxLatencyMS: string = ""

  constructor(id: string, name: string, description: string = "", upTimeInPercent: string = "99.5", maxLatencyMS: string = "") {
    this.id = id;
    this.name = name;
    this.description = description;
    this.upTimeInPercent = upTimeInPercent;
    this.maxLatencyMS = maxLatencyMS;
  }
}

export class MonetizationRatePlans {
  ratePlans: MonetizationRatePlan[] = [];
}

export class MonetizationRatePlan {
  name?: string = "";
  apiproduct: string;
  displayName: string;
  description: string = "";
  billingPeriod: string = "MONTHLY"; // can also be WEEKLY
  paymentFundingModel: string = "POSTPAID"; // can also be PREPAID
  currencyCode: string = "USD";
  setupFee: MonetizationRatePlanMoney = {currencyCode: "USD", units: "0", nanos: "0"};
  fixedRecurringFee: MonetizationRatePlanMoney = {currencyCode: "USD", units: "0", nanos: "0"};
  fixedFeeFrequency: number = 0;
  consumptionPricingType: string = "FIXED_PER_UNIT"; // can also be BANDED
  consumptionPricingRates: MonetizationRatePlanRate[] = [];
  state: string = "PUBLISHED" // can also be DRAFT
  startTime: number = 0;
  endTime: number = 0;
  constructor(apiProduct: string, displayName: string) {
    this.apiproduct = apiProduct;
    this.displayName = displayName;
    this.consumptionPricingRates.push(new MonetizationRatePlanRate());
  }
}

export class MonetizationRatePlanMoney {
  currencyCode: string = "USD";
  units: string = "0";
  nanos: string = "0";
}

export class MonetizationRatePlanRate {
  start: string = "0";
  end: string = "0";
  fee: MonetizationRatePlanMoney = { currencyCode: "USD", units: "", nanos: "0" };
}

export interface ApigeeApps {
  app: ApigeeApp[];
  error?: Error;
}

export interface ApigeeApp {
  appId: string;
  name: string;
  status?: string;
  callbackUrl?: string;
  createdAt?: string;
  credentials?: ApigeeAppCredential[];
  apiProducts?: string[];
  error?: Error;
  attributes: KeyValue[];
}

export interface ApigeeAppCredential {
  consumerKey: string;
  consumerSecret: string;
  issuedAt: string;
  expiresAt: string;
  scopes?: string[];
  status?: string;
  apiProducts?: ApigeeAPIProductName[];
}

export interface ApigeeAPIProductName {
  apiproduct: string;
  status: string;
}

export class FlatTableData {
  headers: FlatTableHeader[] = [];
  styles: FlatTableStyle[] = [];
  data: any[] = [];
}

export interface FlatTableHeader {name: string, displayName: string, sortable: boolean, searchable: boolean}
export interface FlatTableStyle {name: string, value: string, color: string, isBold: boolean}
