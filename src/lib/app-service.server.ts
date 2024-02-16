import type { ApiApp, ApiApps, DataInterface, Product, Products, Developer } from "./interfaces";
import { GoogleCloudDataService } from "./data-service.gcp";
import { TestDataService } from "./data-service.test";

export class AppServiceServer {
  dataService: DataInterface = new GoogleCloudDataService();

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

}

export let appService: AppServiceServer = new AppServiceServer();