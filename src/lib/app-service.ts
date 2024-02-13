import { goto, invalidate, invalidateAll } from "$app/navigation";
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
} from "firebase/auth";
import type { User } from "firebase/auth";
import { initializeApp } from "firebase/app";

import type { ApiManagementInterface, ApiProducts, ApiProduct, Apps, App } from "apigee-x-module";
// import { ApigeeService } from "apigee-x-module";

import { ApiApp, ApiApps, AppUser, type DataInterface } from "./interfaces";
import { DataService } from "./data-service.test";

export class AppService {
  googleProvider = new GoogleAuthProvider();
 
  firebaseConfig = {
    apiKey: "AIzaSyC9rR3wblvxeWdARAV6juR2uw8dBCYfiZM",
    authDomain: "apigee-test38.firebaseapp.com",
  };
  
  // Initialize Firebase & Firebase Auth
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  currentUser: AppUser | undefined = undefined;
  dataService: DataInterface = new DataService();

  // Initialize Apigee X Service
  // apigeeService: ApiManagementInterface = new ApigeeService();

  constructor() {
    if (browser) {
      this.auth.onAuthStateChanged((u: User | null) => {
        // if u is undefined, means we don't know user state
        // if u is null, means user is signed out
        // if u is an object, means user is signed in

        if (!u) {
          localStorage.setItem("UserSignedIn", "false");

          this.currentUser = undefined;
        } else {
          console.log("User changed event, user is there. " + window.location.pathname);

          this.currentUser = new AppUser();
          if (u?.email) this.currentUser.email = u.email;
          if (u?.photoURL) 
            this.currentUser.photoUrl = u.photoURL;
          else
            this.currentUser.photoUrl = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

          localStorage.setItem("UserSignedIn", "true");

          if (window.location.pathname.endsWith("/")) {
            goto("/home");
          }
          else {
            //First, we initialize our event
            const event = new Event('userUpdated');
            // Next, we dispatch the event.
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

  SignOut(): void {
    const auth = getAuth();
    signOut(auth);
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

  GetApiProducts(): Promise<ApiProducts> {
    return new Promise<ApiProducts>((resolve, reject) => {
      resolve({
        apiProducts: [
          {
            name: "Test Product 1",
            displayName: "Test Product",
            description: "Test Product",
            status: "published",
            approvalType: "auto"
          },{
            name: "Test Product 2",
            displayName: "Test Product",
            description: "Test Product",
            status: "published",
            approvalType: "auto"
          },{
            name: "Test Product 2",
            displayName: "Test Product",
            description: "Test Product",
            status: "published",
            approvalType: "auto"
          },{
            name: "Test Product 2",
            displayName: "Test Product",
            description: "Test Product",
            status: "published",
            approvalType: "auto"
          },{
            name: "Test Product 2",
            displayName: "Test Product",
            description: "Test Product",
            status: "published",
            approvalType: "auto"
          }
        ]
      })
    });
  }

  GetApiProduct(id: string): Promise<ApiProduct> {
    return new Promise<ApiProduct>((resolve, reject) => {
      resolve({
          name: id,
          displayName: "Test Product",
          description: "Test Product",
          status: "published",
          approvalType: "auto"
        });
    });
  }

  GetApiApps(): Promise<ApiApps> {
    return this.dataService.getApiApps();
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
}

export let appService: AppService = new AppService();