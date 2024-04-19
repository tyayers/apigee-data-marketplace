import type { ApiApp, ApiApps, Product, Products, Developer, ApiAppCredential, AHSubscription } from "./interfaces";
import { GoogleCloudDataService } from "./data-service.gcp";

export class AppServiceServer {
  dataService: GoogleCloudDataService = new GoogleCloudDataService();
}

export let appServerService: AppServiceServer = new AppServiceServer();