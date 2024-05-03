import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Firestore } from '@google-cloud/firestore';
import { DataProduct } from '$lib/interfaces';
import type {APIProduct, ProxyDeployment, ProxyRevision} from 'apigee-x-module';
import { ApigeeService } from 'apigee-x-module';
import type {ApigeeTemplateService} from 'apigee-templater-module';
import { ApigeeTemplater, ApigeeTemplateInput, RunPoint } from 'apigee-templater-module';
import FormData from 'form-data';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

// Create a new client
const firestore = new Firestore();
// Create Apigee services
const apigeeTemplater: ApigeeTemplateService = new ApigeeTemplater();
const apigeeService: ApigeeService = new ApigeeService();
const projectId: string = import.meta.env.VITE_PROJECT_ID;
const apigeeHost: string = import.meta.env.VITE_API_HOST;
const apigeeEnvironment: string = import.meta.env.VITE_APIGEE_ENV;

export const GET: RequestHandler = async ({ url }) => {

  let prodColRef = firestore.collection("data-marketplace-products");
  let products = await prodColRef.listDocuments();

  let results: DataProduct[] = [];
  for (let doc of products.entries()) {
    let docData = await doc[1].get()
    results.push(docData.data() as DataProduct);
  }

  return json(results);
};

export const POST: RequestHandler = async({ params, url, request}) => {

  let newProduct: DataProduct = await request.json();

  if (newProduct.protocols.includes("API") && newProduct.source === "BigQuery") {
    // Set KVM entry for the data proxy to BigQuery
    setKVMEntry("marketplace-kvm", newProduct.entity, newProduct.query);
    // Create the API product
    createProduct(newProduct.id, newProduct.name, "/" + newProduct.entity);
    // Create an OpenAPI spec with Gemini
    let response =  await fetch(`https://${apigeeHost}/v1/test/data/` + newProduct.entity);
    let testPayload: string = await response.text();
    newProduct.specUrl = `/api/products/${newProduct.id}/spec`;
    newProduct.specContents = await generateSpec(newProduct.name, "/v1/data/" + newProduct.entity, testPayload);
    newProduct.specContents = newProduct.specContents.replaceAll("```json", "").replaceAll("```", "");
  }

  // Persist defnition to Firestore...
  let newDoc = firestore.doc("data-marketplace-products/" + newProduct.id);
  newDoc.set(newProduct);

	return json(newProduct);
}

function generateSpec(name: string, path: string, payload: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    payload = payload.replaceAll("\"", "'");
    fetch(`https://${apigeeHost}/v1/genai/prompt`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        prompt: `Can you generate an OpenAPI spec in json format with the name ${name} for an API that has one GET operation 
        on the ${path} path, uses the server https://${apigeeHost}, is authorized with an API key in the x-api-key header, and returns 
        the following data structure:
        
        ${payload}`
      })
    }).then((response) => {
      return response.json();
    }).then((result: {answer: string}) => {
      console.log(result.answer);
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
      // console.log(response.status + " " + response.statusText);
    }).catch((error) => {
      console.log("Error in KVM key create:");
      console.error(error);
    });
  });
}

function createProduct(name: string, displayName: string, path: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    auth.getAccessToken().then((token) => {
      fetch(`https://apigee.googleapis.com/v1/organizations/${projectId}/apiproducts`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          displayName: displayName,
          approvalType: "auto",
          environments: [apigeeEnvironment],
          operationGroup: {
            operationConfigs: [
              {
                apiSource: "MP-DataAPI-v1",
                operations: [
                  {
                    resource: path,
                    methods: ["GET"]
                  }
                ]
              }
            ]
          }
        })
      }).then((response) => {
        return response.json();
      }).then((result: any) => {
        // console.log(result);
        resolve();
      }).catch((error) => {
        console.log("Error in product create:");
        console.error(error);
        reject();
      });
    });
  });
}

// function importProxy(name: string, path: string): Promise<ProxyRevision> {
//   return new Promise<ProxyRevision>((resolve, reject) => {
//     auth.getAccessToken().then((token) => {
//       const formData = new FormData();
//       let buffer = fs.readFileSync(path);
//       formData.append('file', buffer, name + ".zip");
      
//       fetch(`https://apigee.googleapis.com/v1/organizations/${projectId}/apis?name=${name}&action=import`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           ...formData.getHeaders()
//         },
//         body: formData.getBuffer()
//       }).then((response) => {
//         return response.json();
//       }).then((result: ProxyRevision) => {
//         resolve(result);
//       }).catch((error) => {
//         console.log("Error in proxy import:");
//         console.error(error);
//       });
//     });
//   });
// }

function createAPITemplate(product: DataProduct): ApigeeTemplateInput {
  let result: ApigeeTemplateInput = {
    name: product.name.replace(" ", "-"),
    profile: "default",
    endpoints: [
      {
        name: "default",
        basePath: "/data/" + product.entity,
        target: {
          name: "default",
          url: "https://bigquery.googleapis.com/bigquery/v2/projects/{organization.name}/queries",
          googleAccessToken: {
            scopes: [
              "https://www.googleapis.com/auth/bigquery"
            ],
            headerName: ""
          }
        },
        parameters: {},
        extensionSteps: [
          {
            name: "EV-ExtractName",
            flowRunPoints: [{
              name: "preRequest",
              runPoints: [RunPoint.preRequest]
            }],
            properties: {
              "ExtractVariables": {
                "_attributes": {
                  name: "EV-ExtractName",
                  "enabled": true
                },
                "DisplayName": "EV-ExtractName",
                "URIPath": {
                  "Pattern": "/{entityName}"
                }
              }
            }
          },    
          {
            name: "AM-SetDataVariables",
            type: "AssignMessage",
            flowRunPoints: [{
              name: "preRequest",
              runPoints: [RunPoint.preRequest]
            }],
            properties: {
              assignVariables: [
                {
                  name: product.entity,
                  value: "table::" + product.query
                }
              ]
            }
          },
          {
            name: "RS-JavascriptFiles",
            type: "resourceFiles",
            flowRunPoints: [],
            properties: {
              files: {
                "jsc/bigquery_pretarget.js": "https://raw.githubusercontent.com/tyayers/apigee-js-modules/main/src/bigquery_apigee_pretarget.js",
                "jsc/bigquery_posttarget.js": "https://raw.githubusercontent.com/tyayers/apigee-js-modules/main/src/bigquery_apigee_posttarget.js",
                "jsc/bigquery_functions.js": "https://raw.githubusercontent.com/tyayers/apigee-js-modules/main/src/bigquery_functions.js"
              },
            }
          },
          {
            name: "JS-RunPreTarget-Script",
            flowRunPoints: [{
              name: "preTarget",
              runPoints: [RunPoint.preTarget]
            }],
            properties: {
              "Javascript": {
                "_attributes": {
                  "name": "JS-RunPreTarget-Script"
                },
                "DisplayName": "JS-RunPreTarget-Script",
                "Properties": {},
                "ResourceURL": "jsc://bigquery_pretarget.js",
                "IncludeURL": "jsc://bigquery_functions.js"
              }
            }
          },
          {
            name: "JS-RunPostTarget-Script",
            flowRunPoints: [{
              name: "postTarget",
              runPoints: [RunPoint.postTarget]
            }],
            properties: {
              "Javascript": {
                "_attributes": {
                  name: "JS-RunPostTarget-Script"
                },
                "DisplayName": "JS-RunPostTarget-Script",
                "Properties": {},
                "ResourceURL": "jsc://bigquery_posttarget.js",
                "IncludeURL": "jsc://bigquery_functions.js"
              }
            }
          }
        ]
      }
    ]
  }

  return result;
}

function createBigQueryTemplate(product: DataProduct): ApigeeTemplateInput {
  let result: ApigeeTemplateInput = {
    name: product.name.replace(" ", "-"),
    profile: "default",
    endpoints: [
      {
        name: "default",
        basePath: "/data/" + product.entity,
        target: {
          name: "default",
          url: "https://bigquery.googleapis.com/bigquery/v2/projects/{organization.name}/queries",
          googleAccessToken: {
            scopes: [
              "https://www.googleapis.com/auth/bigquery"
            ],
            headerName: ""
          }
        },
        parameters: {},
        extensionSteps: [
          {
            name: "EV-ExtractName",
            flowRunPoints: [{
              name: "preRequest",
              runPoints: [RunPoint.preRequest]
            }],
            properties: {
              "ExtractVariables": {
                "_attributes": {
                  name: "EV-ExtractName",
                  "enabled": true
                },
                "DisplayName": "EV-ExtractName",
                "URIPath": {
                  "Pattern": "/{entityName}"
                }
              }
            }
          },    
          {
            name: "AM-SetDataVariables",
            type: "AssignMessage",
            flowRunPoints: [{
              name: "preRequest",
              runPoints: [RunPoint.preRequest]
            }],
            properties: {
              assignVariables: [
                {
                  name: product.entity,
                  value: "table::" + product.query
                }
              ]
            }
          },
          {
            name: "RS-JavascriptFiles",
            type: "resourceFiles",
            flowRunPoints: [],
            properties: {
              files: {
                "jsc/bigquery_pretarget.js": "https://raw.githubusercontent.com/tyayers/apigee-js-modules/main/src/bigquery_apigee_pretarget.js",
                "jsc/bigquery_posttarget.js": "https://raw.githubusercontent.com/tyayers/apigee-js-modules/main/src/bigquery_apigee_posttarget.js",
                "jsc/bigquery_functions.js": "https://raw.githubusercontent.com/tyayers/apigee-js-modules/main/src/bigquery_functions.js"
              },
            }
          },
          {
            name: "JS-RunPreTarget-Script",
            flowRunPoints: [{
              name: "preTarget",
              runPoints: [RunPoint.preTarget]
            }],
            properties: {
              "Javascript": {
                "_attributes": {
                  "name": "JS-RunPreTarget-Script"
                },
                "DisplayName": "JS-RunPreTarget-Script",
                "Properties": {},
                "ResourceURL": "jsc://bigquery_pretarget.js",
                "IncludeURL": "jsc://bigquery_functions.js"
              }
            }
          },
          {
            name: "JS-RunPostTarget-Script",
            flowRunPoints: [{
              name: "postTarget",
              runPoints: [RunPoint.postTarget]
            }],
            properties: {
              "Javascript": {
                "_attributes": {
                  name: "JS-RunPostTarget-Script"
                },
                "DisplayName": "JS-RunPostTarget-Script",
                "Properties": {},
                "ResourceURL": "jsc://bigquery_posttarget.js",
                "IncludeURL": "jsc://bigquery_functions.js"
              }
            }
          }
        ]
      }
    ]
  }

  return result;
}