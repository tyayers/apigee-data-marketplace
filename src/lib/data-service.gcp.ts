import type { ApiManagementInterface, ApiProducts, ApiProduct, Apps, App, Developer as ApigeeDeveloper} from "apigee-x-module";
import { ApigeeService } from "apigee-x-module";
import { type ApiApp, type ApiApps, type Product, type Products, type Developer, type ApiAppCredential, type AHSubscription, UsageData } from "./interfaces";
import { product_index } from "./products_new";
import { GoogleAuth } from "google-auth-library";

export class GoogleCloudDataService {

  apigeeService: ApiManagementInterface = new ApigeeService();
  auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  
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

      this.auth.getAccessToken().then((token) => {
        // Calling Applint GetOrCreateUserFlow
        fetch("https://integrations.googleapis.com/v1/projects/apigee-test38/locations/europe-west1/integrations/-:execute", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            "trigger_id": "api_trigger/MarketplaceGetDeveloper_API1",
            "inputParameters": {
              "email": {
                "stringValue": email
              },
              "project": {
                "stringValue": "apigee-test38"
              }
            }
          }),
        }).then((response) => {
          return response.json();
        }).then((data: any) => {
          if (data.outputParameters && data.outputParameters.developerData) {
            resolve(data.outputParameters.developerData);
          }
          else {
            reject("Developer not found!");
          }
        });        
      });

      // this.apigeeService.getDeveloper(email).then((developer) => {
      //   resolve(developer as Developer);
      // }).catch((err) => {
      //   reject(err);
      // });
    });
  }

  public createDeveloper(email: string, firstName: string, lastName: string, userName: string): Promise<Developer> {
    return new Promise<Developer>((resolve, reject) => {
      this.auth.getAccessToken().then((token) => {
        // Calling Applint GetOrCreateUserFlow
        fetch("https://integrations.googleapis.com/v1/projects/apigee-test38/locations/europe-west1/integrations/-:execute", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            "trigger_id": "api_trigger/MarketplaceGetOrCreateDeveloper_API1",
            "inputParameters": {
              "request": {
                "jsonValue": "{'project': 'apigee-test38',	'email':  '" + email + "', 'firstName': '" + firstName + "', 'lastName': '" + lastName + "', 'userName': '" + userName + "'}"
              }
            }
          }),
        }).then((response) => {
          return response.json();
        }).then((data: any) => {
          resolve(data);
        });        
      });


      // let devData: ApigeeDeveloper = {
      //   email: email,
      //   firstName: firstName,
      //   lastName: lastName,
      //   userName: userName,
      //   attributes: []
      // }
  
      // this.apigeeService.createDeveloper(devData).then((result) => {
      //   resolve(result as Developer);
      // }).catch((error) => {
      //   reject(error);
      // });
    });
  }

  public getApiApps(email: string): Promise<ApiApps> {
    return new Promise((resolve, reject) => {

      this.auth.getAccessToken().then((token) => {
        // Calling Applint GetOrCreateUserFlow
        fetch("https://integrations.googleapis.com/v1/projects/apigee-test38/locations/europe-west1/integrations/-:execute", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            "trigger_id": "api_trigger/MarketplaceGetApps_API_1",
            "inputParameters": {
                "project": {
                  "stringValue": "apigee-test38"
                },
                "email": {
                  "stringValue": email
                }
            }
          }),
        }).then((response) => {
          return response.json();
        }).then((data: any) => {
          if (data.outputParameters.appsData) {
            resolve(data.outputParameters.appsData);
          }
          else {
            reject("No apps were found.");
          }
        });        
      });

      // this.apigeeService.getApps(email).then((apps) => {
      //   resolve(apps as ApiApps);
      // }).catch((err) => {
      //   reject(err);
      // });
    });
  }

  public createApiApp(devEmail: string, appName: string, description: string, products: string[]): Promise<ApiApp> {
    return new Promise((resolve, reject) => {
      this.apigeeService.createApp(devEmail, appName, products, description).then((app) => {
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
      }).catch((err) => {
        reject(err);
      });
    });
  }

  deleteApiAppKey(devEmail: string, appId: string, keyId: string): Promise<ApiAppCredential> {
    return new Promise((resolve, reject) => {
      this.apigeeService.deleteAppCredential(devEmail, appId, keyId).then((key) => {
        resolve(key as ApiAppCredential);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public createHubSubscription(project: string, datasetId: string, marketplaceId: string, listingId: string): Promise<AHSubscription> {
    return new Promise((resolve, reject) => {

      this.auth.getAccessToken().then((token) => {
        // Calling Applint GetOrCreateUserFlow
        fetch("https://integrations.googleapis.com/v1/projects/apigee-test38/locations/europe-west1/integrations/-:execute", {
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

  public getUsageData(): Promise<UsageData> {
    return new Promise<UsageData>((resolve, reject) => {
      this.auth.getAccessToken().then((token) => {
        fetch("https://apigee.googleapis.com/v1/organizations/apigee-test38/environments/eval/stats/developer_app?select=sum(message_count)&timeRange=02/01/2024+00:00~02/29/2024+23:59&timeUnit=month", {
          headers: {
            "Authorization": "Bearer " + token
          }          
        }).then((response) => {
          return response.json();
        }).then((data: UsageData) => {
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
        fetch("https://apigee.googleapis.com/v1/organizations/apigee-test38/developers/" + email + "/subscriptions", {
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