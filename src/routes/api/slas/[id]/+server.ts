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

  let id: string | undefined = params.id;

  let sla: SLA | undefined = undefined;

  const document = firestore.doc('data-marketplace-slas/' + id);
  const doc = await document.get();

  if (doc.exists) {
    let docData = doc.data();
    if (docData)
      sla = docData as SLA;
  }

  if (sla) {
	  return json(sla);
  }
  else
    error(404, "Product not found.");
};

export const PUT: RequestHandler = async({ params, url, request}) => {

  let newSLA: SLA = await request.json();

  // Persist defnition to Firestore...
  let newDoc = firestore.doc("data-marketplace-slas/" + newSLA.id);
  newDoc.set(newSLA);

	return json(newSLA);
}

export const DELETE: RequestHandler = async({ params, url, request}) => {
  let id: string = "";
  if (params.id) id = params.id;

  console.log(id);
  let sla: SLA | undefined = undefined;

  const document = firestore.doc('data-marketplace-slas/' + id);
  const doc = await document.get();

  if (doc.exists) {
    let docData = doc.data();
    if (docData)
      sla = docData as SLA;

    await document.delete();
  }

  if (sla) {
	  return json(sla);
  }
  else {
    error(404, "SLA definition not found.");
  }
}