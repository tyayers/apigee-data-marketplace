import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import {
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  SAMLAuthProvider, deleteUser
} from "firebase/auth";
import type { User as FirebaseUser} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { User, Developer, ApiApps, DataProduct } from "./interfaces";
import type { DialogType } from "./components.modal.dialog.svelte";
import {PUBLIC_FIREBASE_APIKEY, PUBLIC_FIREBASE_AUTHDOMAIN, PUBLIC_SITE_NAME} from '$env/static/public';

export class AppService {
  googleProvider = new GoogleAuthProvider();
  SAMLprovider = new SAMLAuthProvider('saml.enterprise-sso');
  tempFirstName: string = "";
  tempLastName: string = "";
  siteName: string = PUBLIC_SITE_NAME;

  // Initialize Firebase & Firebase Auth
  app;
  auth;
  // app = initializeApp(this.firebaseConfig);
  // auth = getAuth(this.app);
  currentUser: User | undefined = undefined;
  currentUserLoaded: boolean = false;
  firebaseUser: FirebaseUser | undefined = undefined;
  apiApps: ApiApps | undefined = undefined;
  reloadFlag: boolean = false;
  // products: Products = new Products();
  products: DataProduct[] | undefined = undefined;
  googleAccessToken: string = "";
  testMode: boolean = false;

  constructor() {
    if (!this.siteName) this.siteName = "Data Marketplace";

    if (browser) {
      let firebaseConfig = {
        apiKey: PUBLIC_FIREBASE_APIKEY,
        authDomain: PUBLIC_FIREBASE_AUTHDOMAIN,
      };
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);

      document.title = this.siteName;

      if (!this.testMode) {
        this.auth.onAuthStateChanged((u: FirebaseUser | null) => {
          // if u is undefined, means we don't know user state
          // if u is null, means user is signed out
          // if u is an object, means user is signed in
          this.currentUserLoaded = true;
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
            let email: string =  u.email ? u.email?.replaceAll("#", "") : "";
            let photoURL: string = u.photoURL ? u.photoURL : "/avatar.png";
            let userName: string = u.displayName ? u.displayName : "";
            if (!userName) userName = this.tempFirstName ? this.tempFirstName + " " + this.tempLastName : "New user";
            let provider: string = u.providerData ? u.providerData[0].providerId : "";
            this.currentUser = new User(email, userName, this.tempFirstName, this.tempLastName);
            this.currentUser.photoUrl = photoURL;
            this.currentUser.providerId = provider;

            // Get product data
            fetch(`/api/products?email=${email}`).then((response) => {
              return response.json();
            }).then((result: DataProduct[]) => {
              this.products = result;
              document.dispatchEvent(new Event("productsUpdated"));
            });

            // Get user data
            this.GetUser(this.currentUser).then((data: User) => {
              if (data) this.currentUser = data;

              if (this.currentUser) {
                this.currentUser.photoUrl = photoURL;
                this.currentUser.providerId = provider;
              }

              if (this.currentUser && this.currentUser.status == "approved") {
                const event = new Event('userUpdated');
                document.dispatchEvent(event);

                this.GetUserApps();
              }
              else {
                // Developer is not yet registered, send to wait page...
                goto("/user/approval");
                // if (this.currentUser) this.currentUser.status = "approval";
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
      else {
        this.currentUser = new User("test@example.com", "testUser", "Test", "User");
        this.currentUser.photoUrl = "/avatar.png";
        this.currentUser.providerId = "test";
        this.currentUser.status = "approved";

        this.currentUser.developerData = new Developer();
        this.currentUser.developerData.email = this.currentUser.email;

        const event = new Event('userUpdated');
        document.dispatchEvent(event);

        goto("/home");
      }
    }
  }

  GetUser(userData: User): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      fetch("/api/users/" + userData.email).then((response) => {
        if (response.status == 404) {
          return this.CreateUser(userData).then((user: User) => {
            return user;
          });
        }
        else
          return response.json();
      }).then((data: User) => {
        resolve(data);
      });
    });
  }

  CreateUser(userData: User): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      }).then((response) => {
        return response.json();
      }).then((data: User) => {
        resolve(data);
      });
    });
  }

  GetUserApps(): void {
    // Get developer app data
    fetch("/api/apps/api?email=" + this.currentUser?.email, {
      method: 'GET',
      headers: {
          'content-type': 'application/json',
      },
    }).then((response) => {
        return response.json();
    }).then((data: any) => {
      this.apiApps = data;
      if (this.apiApps && this.apiApps.apps) {
        for (let app of this.apiApps.apps) {
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

  SignInWithGoogle(): void {
    const auth = getAuth();
    signInWithRedirect(auth, this.googleProvider);
  }

  RegisterWithEmail(email: string, password: string, firstName: string, lastName: string) {
    this.tempFirstName = firstName;
    this.tempLastName = lastName;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
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

  DeleteAccount(email: string): void {
    if (this.auth && this.auth.currentUser && this.currentUser) {
      deleteUser(this.auth.currentUser).then(() => {
        fetch(`/api/users/${email}`, {
          method: "DELETE"
        });
        goto("/home");
      }).catch((error) => {
        this.SignOut();
        goto("/home");
      });
    }
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

  RegisterModalDialogHandler: ((message: string, SubmitButtonText: string, type: DialogType) => Promise<DialogType>) | undefined = undefined;

  ShowDialog(message: string, SubmitButtonText: string, type: DialogType): Promise<DialogType> {
    return new Promise((resolve, reject) => {
      if (this.RegisterModalDialogHandler) {
        this.RegisterModalDialogHandler(message, SubmitButtonText, type).then((result: DialogType) => {
          resolve(result);
        });
      }
      else {
        console.error("No dialog registered handler!");
      }
    });
  }
}

export let appService: AppService = new AppService();