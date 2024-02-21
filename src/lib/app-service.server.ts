import type { ApiApp, ApiApps, Product, Products, Developer, ApiAppCredential, AHSubscription } from "./interfaces";
import { GoogleCloudDataService } from "./data-service.gcp";

export class AppServiceServer {
  dataService: GoogleCloudDataService = new GoogleCloudDataService();

  GetApiProducts(): Promise<Products> {
    return this.dataService.getProducts();
  }

  GetApiProduct(name: string): Promise<Product> {
    return this.dataService.getProduct(name);
  }

  GetDeveloper(email: string): Promise<Developer> {
    return this.dataService.getDeveloper(email);
  }

  CreateDeveloper(email: string, firstName: string, lastName: string, userName: string): Promise<Developer> {
    return new Promise<Developer>((resolve, reject) => {
      this.dataService.createDeveloper(email, firstName, lastName, userName).then((result) => {
        resolve(result);
      }).catch((error) => {
        console.log("Create developer error: ");
        console.log(error);
      })
    });
  }

  GetApiApps(email: string): Promise<ApiApps> {
    return this.dataService.getApiApps(email);
  }

  CreateApiApp(devEmail: string, appName: string, description: string, products: string[]): Promise<ApiApp> {
    return new Promise<ApiApp>((resolve, reject) => {
      this.dataService.createApiApp(devEmail, appName, description, products).then((app: ApiApp) => {
        resolve(app);
      });
    });
  }

  UpdateApiApp(devEmail: string, app: ApiApp): Promise<ApiApp> {
    return new Promise<ApiApp>((resolve, reject) => {
      this.dataService.updateApiApp(devEmail, app).then((app: ApiApp) => {
        resolve(app);
      });
    });
  }

  GetApiApp(devEmail: string, appid: string): Promise<ApiApp> {
    return new Promise<ApiApp>((resolve, reject) => {
      this.dataService.getApiApp(devEmail, appid).then((app: ApiApp) => {
        resolve(app);
      });
    });
  }

  DeleteApiApp(devEmail: string, appid: string): Promise<ApiApp> {
    return new Promise<ApiApp>((resolve, reject) => {
      this.dataService.deleteApiApp(devEmail, appid).then((app: ApiApp) => {
        resolve(app);
      });
    });
  }

  AddApiAppKey(devEmail: string, app: ApiApp): Promise<ApiApp> {
    return new Promise<ApiApp>((resolve, reject) => {
      this.dataService.addApiAppKey(devEmail, app).then((app: ApiApp) => {
        resolve(app);
      });
    });
  }

  DeleteApiAppKey(devEmail: string, appid: string, keyId: string): Promise<ApiAppCredential> {
    return new Promise<ApiAppCredential>((resolve, reject) => {
      this.dataService.deleteApiAppKey(devEmail, appid, keyId).then((key: ApiAppCredential) => {
        resolve(key);
      });
    });
  }

  createHubSubscription(project: string, datasetId: string, marketplaceId: string, listingId: string): Promise<AHSubscription> {
    return new Promise<AHSubscription>((resolve, reject) => {
      this.dataService.createHubSubscription(project, datasetId, marketplaceId, listingId).then((subscription: AHSubscription) => {
        resolve(subscription);
      });
    });
  }


}

export let appService: AppServiceServer = new AppServiceServer();