import type { SLA } from "$lib/interfaces";
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

  let prodColRef = firestore.collection("data-marketplace-slas");
  let products = await prodColRef.listDocuments();

  let results: SLA[] = [];
  for (let doc of products.entries()) {
    let docData = await doc[1].get()
    results.push(docData.data() as SLA);
  }

  return json(results);
};

export const POST: RequestHandler = async({ params, url, request}) => {

  let newSLA: SLA = await request.json();

  // Persist defnition to Firestore...
  let newDoc = firestore.doc("data-marketplace-slas/" + newSLA.id);
  newDoc.set(newSLA);

	return json(newSLA);
}