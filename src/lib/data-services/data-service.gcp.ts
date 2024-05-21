import type { APIProducts, APIProduct, Apps, App, Developer as ApigeeDeveloper} from "apigee-x-module";
import { ApigeeService } from "apigee-x-module";
import { type ApiApp, type ApiApps, type Product, type Products, type Developer, type ApiAppCredential, type AnalyticsHubSubscription, UsageData, User } from "../interfaces";
import { product_index } from "../products_new";
import { GoogleAuth } from "google-auth-library";

const apiHost = import.meta.env.VITE_API_HOST;
const projectId = import.meta.env.VITE_PROJECT_ID;
const apigeeEnvironment = import.meta.env.VITE_APIGEE_ENV;

export class GoogleCloudDataService {

  apigeeService: ApigeeService = new ApigeeService();
  auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  
  constructor() {

  }

  public getProducts(): Promise<Products> {
    return new Promise((resolve, reject) => {
      // resolve(product_index);
      this.apigeeService.getAPIProducts().then((products) => {
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
      // let result: Product | undefined;
      // result = product_index.products.find((item) => item.name === name);

      // if (result)
      //   resolve(result);
      // else
      //   reject("Product not found!");
      this.apigeeService.getAPIProduct(name).then((product: Product) => {
        resolve(product as Product);
      }).catch((err: any) => {
        console.error(err);
        reject(err);
      });
    });
  }

  public getOrCreateUser(email: string, firstName: string, lastName: string, userName: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      fetch("https://" + apiHost + "/v1/users", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          userName: userName,
          firstName: firstName,
          lastName: lastName
        }),
      }).then((response) => {
        return response.json();
      }).then((data: any) => {
        let appUser: User = new User(data.userData.email, data.userData.firstName, data.userData.lastName, data.userData.userName);
        appUser.developerData = data.developerData;
        if (data.userData) {
          appUser.roles = data.userData.roles;
          appUser.status = data.userData.status;
        }
        resolve(appUser);
      });
    });
  }

  public getApiApps(email: string): Promise<ApiApps> {
    return new Promise((resolve, reject) => {

      this.apigeeService.getApps(email).then((apps: Apps) => {
        resolve(apps as ApiApps);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public createApiApp(devEmail: string, appName: string, description: string, products: string[]): Promise<ApiApp> {
    return new Promise((resolve, reject) => {
      console.log("writing app: " + devEmail + " " + products.join(", "));
      this.apigeeService.createApp(devEmail, appName, products, description).then((app) => {
        console.log(app);
        resolve(app as ApiApp);
      }).catch((err: any) => {
        console.error(err);
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
        credentials: app.credentials,
        attributes: app.attributes
      };

      // First update the app
      this.apigeeService.updateApp(devEmail, updatedApp.name, updatedApp).then((app) => {
        // Now update all credentials
        if (updatedApp.credentials) {
          var credPromises: Promise<ApiAppCredential>[] = [];
          for (let cred of updatedApp.credentials) {
            let credUpdatePromise: Promise<ApiAppCredential> = this.apigeeService.updateAppCredential(devEmail, updatedApp.name, cred);
          }

          Promise.all(credPromises).then((results) => {
            resolve(app as ApiApp);
          });
        }
      }).catch((err: any) => {
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
      }).catch((err: any) => {
        reject(err);
      });
    });
  }
  
  public addApiAppKey(devEmail: string, app: ApiApp): Promise<ApiApp> {
    return new Promise((resolve, reject) => {

      let updatedApp: App = {
        appId: app.appId,
        name: app.name,
        apiProducts: app.apiProducts,
        createdAt: app.createdAt,
        status: app.status,
        credentials: app.credentials,
        attributes: app.attributes
      };

      this.apigeeService.addAppCredential(devEmail, updatedApp.name, updatedApp).then((app) => {
        resolve(app as ApiApp);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  deleteApiAppKey(devEmail: string, appId: string, keyId: string): Promise<ApiAppCredential> {
    return new Promise((resolve, reject) => {
      this.apigeeService.deleteAppCredential(devEmail, appId, keyId).then((key) => {
        resolve(key as ApiAppCredential);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public createHubSubscription(project: string, datasetId: string, marketplaceId: string, listingId: string): Promise<AnalyticsHubSubscription> {
    return new Promise((resolve, reject) => {

      this.auth.getAccessToken().then((token) => {
        // Calling Applint GetOrCreateUserFlow
        fetch(`https://integrations.googleapis.com/v1/projects/${projectId}/locations/europe-west1/integrations/-:execute`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            "trigger_id": "api_trigger/MarketplaceAnalyticsHubSubscription_API_1",
            "inputParameters": {
                "project": {
                  "stringValue": "apigee-test38"
                },
                "destinationProject": {
                  "stringValue": project
                },
                "dataExchangeId": {
                  "stringValue": marketplaceId
                },
                "listingId": {
                  "stringValue": listingId
                },
                "datasetId": {
                  "stringValue": datasetId
                }
            }
          }),
        }).then((response) => {
          return response.json();
        }).then((data: any) => {
          resolve(data);
        });        
      });
    });
  }

  public getUsageData(email: string): Promise<UsageData> {
    return new Promise<UsageData>((resolve, reject) => {
      this.auth.getAccessToken().then((token) => {

        let endDate = new Date();
        let startDate = new Date(new Date(endDate).setDate(endDate.getDate() - 90));
        let startDateString: string = (startDate.getMonth() + 1).toString() + "/" + startDate.getDate().toString() + "/" + startDate.getFullYear().toString();
        let endDateString: string = (endDate.getMonth() + 1).toString() + "/" + endDate.getDate().toString() + "/" + endDate.getFullYear().toString();

        //let timeRange = "02/01/2024+00:00~02/28/2024+23:59"
        let timeRange = startDateString + "+00:00~" + endDateString + "+23:59";

        fetch(`https://apigee.googleapis.com/v1/organizations/${projectId}/environments/${apigeeEnvironment}/stats/developer_app?select=sum(message_count)&timeRange=${timeRange}&timeUnit=month&filter=(developer_email%20eq%20'${email}')`, {
          headers: {
            "Authorization": "Bearer " + token
          }
        }).then((response) => {
          return response.json();
        }).then((data: UsageData) => {
          // console.log(JSON.stringify(data));
          resolve(data);
        }).catch((error) => {
          console.error(error);
          reject(error);
        });
      });
    })
  }

  public createApigeeSubscription(email: string, product: string): Promise<any> {
    return new Promise<UsageData>((resolve, reject) => {
      this.auth.getAccessToken().then((token) => {
        fetch(`https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/subscriptions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            "apiproduct": product
          })
        }).then((response) => {
          return response.json();
        }).then((data: any) => {
          resolve(data);
        }).catch((error) => {
          console.error(error);
          reject(error);
        });
      });
    })
  }
}