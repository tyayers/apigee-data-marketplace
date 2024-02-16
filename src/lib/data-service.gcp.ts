import type { ApiManagementInterface, ApiProducts, ApiProduct, Apps, App, Developer as ApigeeDeveloper} from "apigee-x-module";
import { ApigeeService } from "apigee-x-module";
import type { ApiApp, ApiApps, Product, Products, Developer } from "./interfaces";
import { product_index } from "./products";

export class GoogleCloudDataService {

  apigeeService: ApiManagementInterface = new ApigeeService();

  constructor() {

  }

  public getProducts(): Promise<Products> {
    return new Promise((resolve, reject) => {
      resolve(product_index);
      // this.apigeeService.getApiProducts().then((products) => {
      //   resolve({
      //     products: products.apiProducts as Product[]
      //   });
      // }).catch((err) => {
      //   console.error(err);
      //   reject(err);
      // });
    });
  }

  public getProduct(name: string): Promise<Product> {
    return new Promise((resolve, reject) => {
      let result: Product | undefined;
      result = product_index.products.find((item) => item.name === name);

      if (result)
        resolve(result);
      else
        reject("Product not found!");
      // this.apigeeService.getApiProduct(name).then((product) => {
      //   resolve(product as Product);
      // }).catch((err) => {
      //   console.error(err);
      //   reject(err);
      // });
    });
  }

  public getDeveloper(email: string): Promise<Developer> {
    return new Promise((resolve, reject) => {
      this.apigeeService.getDeveloper(email).then((developer) => {
        resolve(developer as Developer);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public createDeveloper(email: string, firstName: string, lastName: string, userName: string): void {
    let devData: ApigeeDeveloper = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      attributes: []
    }

    this.apigeeService.createDeveloper(devData);
  }

  public getApiApps(email: string): Promise<ApiApps> {
    return new Promise((resolve, reject) => {
      this.apigeeService.getApps(email).then((apps) => {
        resolve(apps as ApiApps);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public createApiApp(devEmail: string, appName: string, products: string[]): Promise<ApiApp> {
    return new Promise((resolve, reject) => {
      this.apigeeService.createApp(devEmail, appName, products).then((app) => {
        resolve(app as ApiApp);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public updateApiApp(devEmail: string, app: ApiApp): Promise<ApiApp> {
    return new Promise((resolve, reject) => {

      let updatedApp: App = {
        appId: app.appId,
        name: app.name,
        createdAt: app.createdAt,
        status: app.status,
        credentials: app.credentials
      };

      this.apigeeService.updateApp(devEmail, updatedApp.name, updatedApp).then((app) => {
        resolve(app as ApiApp);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public getApiApp(devEmail: string, appId: string): Promise<ApiApp> {
    return new Promise((resolve, reject) => {
      this.apigeeService.getApp(devEmail, appId).then((app) => {
        resolve(app as ApiApp);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  deleteApiApp(devEmail: string, appId: string): Promise<ApiApp> {
    return new Promise((resolve, reject) => {
      this.apigeeService.deleteApp(devEmail, appId).then((app) => {
        resolve(app as ApiApp);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}