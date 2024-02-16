// import type { ApiProducts, ApiProduct, Apps, App } from "apigee-x-module";
import type { ApiApp, ApiApps, AppUser, Developer, Product, Products } from "./interfaces";


export class TestDataService {

  private products: Products = {
    products: [
      {
        name: "Data Product 1",
        displayName: "Data Product 1",
        approvalType: "auto",
        access: "public",
        description: "Data Product 1"
      },
      {
        name: "Data Product 2",
        displayName: "Data Product 2",
        approvalType: "auto",
        access: "public",
        description: "Data Product 1"
      },
      {
        name: "Data Product 3",
        displayName: "Data Product 3",
        approvalType: "auto",
        access: "public",
        description: "Data Product 1"
      },
      {
        name: "Data Product 4",
        displayName: "Data Product 4",
        approvalType: "auto",
        access: "public",
        description: "Data Product 1"
      },
      {
        name: "Data Product 5",
        displayName: "Data Product 5",
        approvalType: "auto",
        access: "public",
        description: "Data Product 1"
      },
      {
        name: "Data Product 6",
        displayName: "Data Product 6",
        approvalType: "auto",
        access: "public",
        description: "Data Product 1"
      },
    ]
  }

  private developers: { [key: string]: AppUser } = {};

  private apps: ApiApps = {
    apps: [{
      appId: "test",
      name: "test",
      description: "test",
      apiProducts: ["test"],
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

  public getProducts(): Promise<Products> {
    return new Promise((resolve, reject) => {
      resolve(this.products);
    });
  }

  public getProduct(name: string): Promise<Product> {
    return new Promise<Product>((resolve, reject) => {
      console.log("searching for product name: " + name);
      let result = this.products.products.find(product => product.name === name);

      if (result)
        resolve(result);
      else
        reject("Product not found!");
    });
  }

  public createDeveloper(email: string, firstName: string, lastName: string, userName: string): void {
    this.developers[email] = {
      email: email,
      userName: userName,
      photoUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    };
  }

  public getApiApps(email: string): Promise<ApiApps> {
    return new Promise((resolve, reject) => {
      resolve(this.apps);
    });
  }

  public createApiApp(devEmail: string, appName: string, products: string[]): Promise<ApiApp> {
    return new Promise((resolve, reject) => {
      let newApp: ApiApp = {
        appId: appName,
        name: appName,
        description: appName,
        apiProducts: products,
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

  getDeveloper(email: string): Promise<Developer> {
    throw new Error("Method not implemented.");
  }
  deleteApiApp(devEmail: string, appId: string): Promise<ApiApp> {
    throw new Error("Method not implemented.");
  }
}