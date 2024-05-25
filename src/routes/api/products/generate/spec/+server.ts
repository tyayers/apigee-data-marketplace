import type { DataProduct } from "$lib/interfaces";
import { json, text, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";

const projectId: string = import.meta.env.VITE_PROJECT_ID;
const apigeeHost: string = import.meta.env.VITE_API_HOST;
const apigeeEnvironment: string = import.meta.env.VITE_APIGEE_ENV;

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

export const POST: RequestHandler = async({ params, url, request}) => {

  let newProduct: DataProduct = await request.json();


  let payload = newProduct.samplePayload.replaceAll("\"", "'");
  let callPath: string = newProduct.source === "BigQuery" ? "data" : "services"
  newProduct.specPrompt = newProduct.specPrompt.replaceAll("${name}", newProduct.name).replaceAll("${apigeeHost}", apigeeHost).replaceAll("${path}", `/v1/${callPath}/` + newProduct.entity);

  let prompt: string = newProduct.specPrompt;

  prompt += "   " + payload;

  let newSpec = (await generateSpec(prompt)).replace("```json", "").replace("```", "");
  newProduct.specContents = newSpec;

	return json(newProduct);
}

function generateSpec(prompt: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fetch(`https://${apigeeHost}/v1/genai/prompt`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        prompt: prompt
      })
    }).then((response) => {
      return response.json();
    }).then((result: {answer: string}) => {
      resolve(result.answer);
    }).catch((error) => {
      console.error("Error in genai request: ");
      console.error(error);
      reject("Error in calling Gen AI API.");
    })
    
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
    }).catch((error) => {
      console.error(error);
    });
  });
}
