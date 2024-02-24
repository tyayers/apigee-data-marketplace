import { goto } from "$app/navigation";
import { browser } from "$app/environment";

import {
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  getAuth,
  getRedirectResult,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  SAMLAuthProvider
} from "firebase/auth";
import type { User } from "firebase/auth";
import { initializeApp } from "firebase/app";

import { AppUser, Developer, ApiApps, ApiApp, Products, AHSubscription } from "./interfaces";
import { product_index } from "./products";

export class AppService {
  googleProvider = new GoogleAuthProvider();
  SAMLprovider = new SAMLAuthProvider('saml.enterprise-sso');
 
  firebaseConfig = {
    apiKey: "AIzaSyC9rR3wblvxeWdARAV6juR2uw8dBCYfiZM",
    authDomain: "apigee-test38.firebaseapp.com",
  };
  
  // Initialize Firebase & Firebase Auth
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  currentUser: AppUser | undefined = undefined;
  firebaseUser: User | undefined = undefined;
  apiApps: ApiApps | undefined = undefined;
  reloadFlag: boolean = false;
  products: Products = product_index;

  constructor() {
    if (browser) {
      this.auth.onAuthStateChanged((u: User | null) => {
        // if u is undefined, means we don't know user state
        // if u is null, means user is signed out
        // if u is an object, means user is signed in

        if (!u) {
          this.currentUser = undefined;
          //First, we initialize our event
          const event = new Event('userUpdated');
          // Next, we dispatch the event.
          document.dispatchEvent(event);
          // Goto signed-out landing page
          goto("/");
        } else {
          this.firebaseUser = u;
          this.currentUser = new AppUser();

          this.GetIdToken().then((idToken) => {
            console.log(idToken);
          });

          if (u?.email) this.currentUser.email = u.email.replaceAll("#", "");
          if (u?.photoURL) 
            this.currentUser.photoUrl = u.photoURL;
          else
            this.currentUser.photoUrl = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

          if (u?.displayName) {
            this.currentUser.userName = u.displayName;
          }
          else {
            this.currentUser.userName = "New User";
          }

          if (u.providerData && u.providerData.length > 0)
            this.currentUser.providerId = u.providerData[0].providerId;

          // Use AppIntegration to create developer
          fetch("/api/developers?email=" + this.currentUser?.email + "&username=" + this.currentUser?.userName, {
            method: 'POST',
            body: JSON.stringify({
              email: this.currentUser?.email,
              username: this.currentUser?.userName,
            }),
            headers: {
                'content-type': 'application/json',
            },
          }).then((response) => {
              return response.json();
          }).then((data: any) => {
            if (data.outputParameters.developerData) {
              if (this.currentUser) this.currentUser.developerData = data.outputParameters.developerData;
              if (this.currentUser)this.currentUser.status = data.outputParameters.developerData.status;
              const event = new Event('userUpdated');
              document.dispatchEvent(event);

              // Get developer app data
              fetch("/api/apiapps?email=" + this.currentUser?.email, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                },
              }).then((response) => {
                  return response.json();
              }).then((data: any) => {
                this.apiApps = data;
                if (this.apiApps && this.apiApps.app) {
                  for (let app of this.apiApps.app) {
                    if (!app.apiProducts) app.apiProducts = [];
                    if (app.credentials) {
                      for (let cred of app.credentials) {
                        if (cred.apiProducts) {
                          for (let prod of cred.apiProducts) {
                            if (!app.apiProducts.includes(prod.apiproduct)) app.apiProducts.push(prod.apiproduct)
                          }
                        }
                      }
                    }
                  }
                }
                const event = new Event('appsUpdated');
                document.dispatchEvent(event);              
              });

            }
            else {
              // Developer is not yet registered, send to wait page...
              goto("/user/approval");
              if (this.currentUser)this.currentUser.status = "approval";
              const event = new Event('userUpdated');
              document.dispatchEvent(event);
            }
          });          

          if (window.location.pathname.endsWith("/")) {
            goto("/home");
          }
          else {
            const event = new Event('userUpdated');
            document.dispatchEvent(event);
          }
        }
      });
    }
  }

  SignInWithGoogle(): void {
    const auth = getAuth();
    signInWithRedirect(auth, this.googleProvider);
  }

  RegisterWithEmail(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        sendEmailVerification(userCredential.user);
        goto("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode + " - " + errorMessage);

        this.ShowSnackbar(errorMessage);
      });
  }

  SignInWithEmail(email: string, password: string) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Signed in 
      goto("/home");
    })
    .catch((error2: { code: any; message: any; }) => {
      const errorCode = error2.code;
      const errorMessage = error2.message;
      console.error(errorCode + " - " + errorMessage);
      this.ShowSnackbar(errorMessage);
    });
  }

  SignInWithSAML() {
    const auth = getAuth();
    signInWithRedirect(auth, this.SAMLprovider);
  }

  SignOut(): void {
    const auth = getAuth();
    signOut(auth);
  }

  GetIdToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.firebaseUser) {
        this.firebaseUser
          .getIdToken(/* forceRefresh */ true)
          .then(function (idToken) {
            resolve(idToken);
          });
      } else {
        resolve("");
      }
    });
  }

  ShowSnackbar(message: string) {
    var x = document.getElementById("snackbar");
    if (x) {
      x.innerHTML = message;
      x.className = "show";
    }
    
    setTimeout(function(){ if (x) {
      x.className = x.className.replace("show", ""); 
    }}, 3000);
  }

  RegisterModalDialogHandler: ((message: string, SubmitButtonText: string, type: number) => Promise<string>) | undefined = undefined;

  ShowDialog(message: string, SubmitButtonText: string, type: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.RegisterModalDialogHandler) {
        this.RegisterModalDialogHandler(message, SubmitButtonText, type).then((result: string) => {
          resolve(result);
        });
      }
      else {
        console.error("No dialog registered handler!");
      }
    });
  }

  DeleteApp(email: string, appName: string) {
    fetch("/api/apiapps/" + appName + "?email=" + email, {
      method: 'DELETE',
      headers: {
          'content-type': 'application/json',
      },
    }).then((response) => {
        return response.json();
    }).then((data: ApiApp) => {
      let index = this.apiApps?.app.indexOf(data);
      if (index) {
          let newAppData = this.apiApps;
          newAppData?.app.splice(index, 1);
          this.apiApps = newAppData;
      }   
      const event = new Event('appsUpdated');
      document.dispatchEvent(event);
    });
  }

  UpdateApp(email: string, app: ApiApp) {
    fetch("/api/apiapps/" + app.name + "?email=" + email, {
      method: 'PUT',
      body: JSON.stringify(app),
      headers: {
          'content-type': 'application/json',
      },
    }).then((response) => {
        return response.json();
    }).then((data: ApiApps) => {
    });
  }

  AddAppKey(email: string, app: ApiApp): Promise<ApiApp> {
    return new Promise<ApiApp>((resolve, reject) => {
      fetch("/api/apiapps/" + app.name + "?email=" + email, {
        method: 'POST',
        body: JSON.stringify(app),
        headers: {
            'content-type': 'application/json',
        },
      }).then((response) => {
          return response.json();
      }).then((data: ApiApp) => {
        resolve(data);
      });
    });
  }

  DeleteAppKey(email: string, appName: string, keyId: string) {
    fetch("/api/apiapps/" + appName + "/keys/" + keyId + "?email=" + email, {
      method: 'DELETE',
      headers: {
          'content-type': 'application/json',
      },
    }).then((response) => {
        return response.json();
    }).then((data: ApiApps) => {
    });    
  }

  GetDeveloper(email: string): Promise<Developer> {
    return new Promise<Developer>((resolve, reject) => {
      fetch("/api/developers?email=" + email, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
      }).then((response) => {
          return response.json();
      }).then((data: Developer) => {
          resolve(data);
      }).catch((error) => {
        reject(error);
      });        
    });
  }

  CreateHubSubscription(project: string, dataset: string, product: string, createdAt: string, accessToken: string): Promise<AHSubscription> {
    return new Promise<AHSubscription>((resolve, reject) => {
      const productData = this.products.products.find(productItem => productItem.name === product);
      fetch("/api/bigquery?email=" + this.currentUser?.email + "&project=" + project + "&dataset=" + dataset + "&product=" + product + "&marketplaceId=" + productData?.hubMarketplaceId + "&listingId=" + productData?.hubListingId + "&createdAt=" + createdAt + "&accessToken=" + accessToken, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
      }).then((response) => {
          return response.json();
      }).then((data: AHSubscription) => {
          console.log("AH SUB RESULT: ");
          console.log(data);
          resolve(data);
      }).catch((error) => {
        reject(error);
      });        
    });    
  }
}

export let appService: AppService = new AppService();