import { goto, invalidate, invalidateAll } from "$app/navigation";
import { browser } from "$app/environment";

import {
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  getAuth,
  getRedirectResult,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { initializeApp } from "firebase/app";

import type { ApiManagementInterface, ApiProducts, ApiProduct } from "apigee-x-module";
// import { ApigeeService } from "apigee-x-module";

import { AppUser } from "./interfaces";

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
          if (u?.email) this.currentUser.Email = u.email;
          if (u?.photoURL) this.currentUser.PhotoURL = u.photoURL;

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

  SignOut(): void {
    const auth = getAuth();
    signOut(auth);
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
}

export let appService: AppService = new AppService();