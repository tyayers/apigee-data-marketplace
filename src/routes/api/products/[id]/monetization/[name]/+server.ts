import type { DataProduct, IdentityConfig, MonetizationRatePlan, MonetizationRatePlans } from "$lib/interfaces";
import { Firestore } from "@google-cloud/firestore";
import { error, json, type NumericRange, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";
import { PUBLIC_PROJECT_ID } from '$env/static/public';

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

// Create a new client
const firestore = new Firestore();

export const GET: RequestHandler = async ({ url, params }) => {

  let name: string = "", productId: string = "";
  if (params.id) productId = params.id;
  if (params.name) name = params.name;

  let token = await auth.getAccessToken();
  let response = await fetch(`https://apigee.googleapis.com/v1/organizations/${PUBLIC_PROJECT_ID}/apiproducts/${productId}/rateplans/${name}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (response.status == 200) {
    return json(await response.json());
  }
  else {
    return error(response.status as NumericRange<400, 599>, response.statusText);
  }
};

export const PUT: RequestHandler = async({ params, url, request}) => {

  let newPlan: MonetizationRatePlan = await request.json();

  // Persist defnition to Firestore...
  let newDoc = firestore.doc("data-marketplace-monetizationplans/" + newPlan.displayName);
  newDoc.set(newPlan);

	return json(newPlan);
}

export const DELETE: RequestHandler = async({ params, url, request}) => {

  let name: string = "", productId: string = "";
  if (params.id) productId = params.id;
  if (params.name) name = params.name;

  let token = await auth.getAccessToken();
  let response = await fetch(`https://apigee.googleapis.com/v1/organizations/${PUBLIC_PROJECT_ID}/apiproducts/${productId}/rateplans/${name}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (response.status == 200) {
    return json(await response.json());
  }
  else {
    return error(response.status as NumericRange<400, 599>, response.statusText);
  }
}