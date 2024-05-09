import type { DataProduct, IdentityConfig, MonetizationRatePlan, MonetizationRatePlans } from "$lib/interfaces";
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

  let plansRef = firestore.collection("data-marketplace-monetizationplans");
  let plans = await plansRef.listDocuments();

  let results: MonetizationRatePlan[] = [];
  for (let doc of plans.entries()) {
    let docData = await doc[1].get()
    results.push(docData.data() as MonetizationRatePlan);
  }

  return json(results);
};

export const POST: RequestHandler = async({ params, url, request}) => {

  let newPlan: MonetizationRatePlan = await request.json();

  // Persist defnition to Firestore...
  let newDoc = firestore.doc("data-marketplace-monetizationplans/" + newPlan.displayName);
  newDoc.set(newPlan);

	return json(newPlan);
}