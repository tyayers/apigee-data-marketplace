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

export const POST: RequestHandler = async({ params, url, request}) => {

  let newPlan: MonetizationRatePlan = await request.json();
  delete newPlan.name;

  let token = await auth.getAccessToken();
  let response = await fetch(`https://apigee.googleapis.com/v1/organizations/${projectId}/apiproducts/${newPlan.apiproduct}/rateplans`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newPlan)
  });

  if (response.status == 201) {
    return json(await response.json());
  }
  else {
    return json({
      status: response.status,
      statusText: response.statusText
    });
  }
}