import type { DataProduct } from "$lib/interfaces";
import { json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";
import { PUBLIC_PROJECT_ID, PUBLIC_API_HOST, PUBLIC_APIGEE_ENV } from '$env/static/public';

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

export const GET: RequestHandler = async ({ url }) => {

  const entity = url.searchParams.get('entity') ?? '';
  const type = url.searchParams.get('type') ?? '';
  const callType = type === "BigQuery" ? "data" : "services";
  let response =  await fetch(`https://${PUBLIC_API_HOST}/v1/test/${callType}/${entity}`);
  let testPayload: any = await response.json();

  return json(testPayload);
};

export const POST: RequestHandler = async({ params, url, request}) => {

  let newProduct: DataProduct = await request.json();

  if (newProduct.protocols.includes("API") && (newProduct.source === "BigQuery" || newProduct.source === "API")) {
    // Set KVM entry for the data proxy to BigQuery
    await setKVMEntry("marketplace-kvm", newProduct.entity, newProduct.query);
  }

	return json({
    result: "OK"
  });
}

async function setKVMEntry(KVMName: string, keyName: string, keyValue: string) {
  let token = await auth.getAccessToken();
  let response = await fetch(`https://apigee.googleapis.com/v1/organizations/${PUBLIC_PROJECT_ID}/environments/${PUBLIC_APIGEE_ENV}/keyvaluemaps/${KVMName}/entries`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: keyName,
      value: keyValue
    })
  });

  if (response.status === 409) {
    // Update KVM entry
    response = await fetch(`https://apigee.googleapis.com/v1/organizations/${PUBLIC_PROJECT_ID}/environments/${PUBLIC_APIGEE_ENV}/keyvaluemaps/${KVMName}/entries/${keyName}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: keyName,
        value: keyValue
      })
    });

    if (response.status != 200)
      console.error(response);
  }
  else {
    console.error(response);
  }

}
