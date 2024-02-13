import type { ApiProducts, ApiProduct, Apps, App } from "apigee-x-module";
import type { ApiApp, ApiApps, DataInterface } from "./interfaces";


export class DataService implements DataInterface {

  private products: ApiProducts = {
    apiProducts: []
  }

  private apps: ApiApps = {
    apps: [{
      appId: "test",
      name: "test",
      products: ["test"],
      createdAt: new Date().toString(),
      credentials: [
        {    
          consumerKey: "32kjl3j2jl32jk3jl2klj3kl2j3kl2jk32jkl32",
          consumerSecret: "j23j4234h2jgh4g2hg423jkh423jkh23hj432h",
          status: "Active"
        }
      ]
    }]
  }

  public getProducts(): Promise<ApiProducts> {
    return new Promise((resolve, reject) => {
      resolve(this.products);
    });
  }

  public getApiApps(): Promise<ApiApps> {
    return new Promise((resolve, reject) => {
      resolve(this.apps);
    });
  }

  public createApiApp(devEmail: string, appName: string, products: string[]): Promise<ApiApp> {
    return new Promise((resolve, reject) => {
      let newApp: ApiApp = {
        appId: appName,
        name: appName,
        products: products,
        createdAt: new Date().toString()
      };
  
      this.apps.apps.push(newApp);

      resolve(newApp);
    });
  }

  public getApiApp(devEmail: string, appId: string): Promise<ApiApp> {
    return new Promise((resolve, reject) => {
      for (let app of this.apps.apps) {
        if (app.appId === appId) {
          resolve(app);
        }
      }
      reject()
    });
  }
}