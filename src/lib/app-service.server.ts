import type { ApiApp, ApiApps, Product, Products, Developer, ApiAppCredential } from "./interfaces";
import { GoogleCloudDataService } from "./data-service.gcp";
import { TestDataService } from "./data-service.test";

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

  CreateDeveloper(email: string, firstName: string, lastName: string, userName: string) {
    this.dataService.createDeveloper(email, firstName, lastName, userName);
  }

  GetApiApps(email: string): Promise<ApiApps> {
    return this.dataService.getApiApps(email);
  }

  CreateApiApp(devEmail: string, appName: string, products: string[]): Promise<ApiApp> {
    return new Promise<ApiApp>((resolve, reject) => {
      this.dataService.createApiApp(devEmail, appName, products).then((app: ApiApp) => {
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

}

export let appService: AppServiceServer = new AppServiceServer();