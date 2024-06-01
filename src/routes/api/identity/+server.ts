import type { IdentityConfig } from "$lib/interfaces";
import { Firestore } from "@google-cloud/firestore";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

// Create a new client
const firestore = new Firestore();

export const GET: RequestHandler = async ({ url, params }) => {

  let idConfig: IdentityConfig | undefined = undefined;

  const document = firestore.doc('data-marketplace-config/identity');
  const doc = await document.get();

  if (doc.exists) {
    idConfig = doc.data() as IdentityConfig;
  }

  if (idConfig)
    return json(idConfig);
  else
    error(404, "Identity configuration not found.");
};