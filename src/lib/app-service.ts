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

import { AppUser, Developer } from "./interfaces";

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
        } else {
          this.currentUser = new AppUser();
          if (u?.email) this.currentUser.email = u.email;
          if (u?.photoURL) 
            this.currentUser.photoUrl = u.photoURL;
          else
            this.currentUser.photoUrl = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

          if (u?.displayName) {
            this.currentUser.userName = u.displayName;
          }
          else {
            this.currentUser.userName = "User";
          }

          // Create developer if they don't exist
          fetch("/api/developers?email=" + appService.currentUser?.email + "&username=" + appService.currentUser?.userName, {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
              },
          });

          // Get developer data
          fetch("/api/developers?email=" + appService.currentUser?.email, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            },
          }).then((response) => {
            return response.json();
          }).then((data: Developer) => {
            console.log("Developer data received:");
            console.log(data);
            if (this.currentUser) this.currentUser.developerData = data;
            //First, we initialize our event
            const event = new Event('userUpdated');
            // Next, we dispatch the event.
            document.dispatchEvent(event);
          });

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
}

export let appService: AppService = new AppService();