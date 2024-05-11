import type { SLA, User } from "$lib/interfaces";
import { Firestore } from "@google-cloud/firestore";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";

const projectId: string = import.meta.env.VITE_PROJECT_ID;

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

// Create a new client
const firestore = new Firestore();

export const GET: RequestHandler = async ({ url, params }) => {

  let prodColRef = firestore.collection("data-marketplace-users");
  let products = await prodColRef.listDocuments();

  let results: User[] = [];
  for (let doc of products.entries()) {
    let docData = await doc[1].get()
    results.push(docData.data() as User);
  }

  return json(results);
};