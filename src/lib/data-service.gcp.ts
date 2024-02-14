import type { ApiManagementInterface, ApiProducts, ApiProduct, Apps, App, Developer, Developers } from "apigee-x-module";
import { ApigeeService } from "apigee-x-module";
import type { ApiApp, ApiApps, DataInterface, Product, Products } from "./interfaces";


export class GoogleCloudDataService implements DataInterface {

  apigeeService: ApiManagementInterface = new ApigeeService();

  constructor() {

  }

  public getProducts(): Promise<Products> {
    return new Promise((resolve, reject) => {
      console.log("calling apigee get products..");
      this.apigeeService.getApiProducts().then((products) => {
        resolve({
          products: products.apiProducts as Product[]
        });
      }).catch((err) => {
        console.error(err);
        reject(err);
      });
    });
  }

  public getProduct(name: string): Promise<Product> {
    return new Promise((resolve, reject) => {
      console.log("calling apigee get product..");
      this.apigeeService.getApiProduct(name).then((product) => {
        resolve(product as Product);
      }).catch((err) => {
        console.error(err);
        reject(err);
      });
    });
  }

  public createDeveloper(email: string, firstName: string, lastName: string, userName: string): void {
    let devData: Developer = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      userName: userName
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

  public getApiApp(devEmail: string, appId: string): Promise<ApiApp> {
    return new Promise((resolve, reject) => {
      this.apigeeService.getApp(devEmail, appId).then((app) => {
        resolve(app as ApiApp);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}