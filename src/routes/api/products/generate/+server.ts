import type { DataProduct } from "$lib/interfaces";
import { json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";

const projectId: string = import.meta.env.VITE_PROJECT_ID;
const apigeeHost: string = import.meta.env.VITE_API_HOST;
const apigeeEnvironment: string = import.meta.env.VITE_APIGEE_ENV;

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

export const GET: RequestHandler = async ({ url }) => {

  const entity = url.searchParams.get('entity') ?? '';

  let response =  await fetch(`https://${apigeeHost}/v1/test/data/` + entity);
  let testPayload: any = await response.json();

  return json(testPayload);
};

export const POST: RequestHandler = async({ params, url, request}) => {

  let newProduct: DataProduct = await request.json();

  if (newProduct.protocols.includes("API") && newProduct.source === "BigQuery") {
    // Set KVM entry for the data proxy to BigQuery
    setKVMEntry("marketplace-kvm", newProduct.entity, newProduct.query);
  }

	return json({
    result: "OK"
  });
}

function setKVMEntry(KVMName: string, keyName: string, keyValue: string) {
  auth.getAccessToken().then((token) => {
    fetch(`https://apigee.googleapis.com/v1/organizations/${projectId}/environments/${apigeeEnvironment}/keyvaluemaps/${KVMName}/entries`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: keyName,
        value: keyValue
      })
    }).then((response) => {
      // console.log(response.status + " " + response.statusText);
    }).catch((error) => {
      console.log("Error in KVM key create:");
      console.error(error);
    });
  });
}
