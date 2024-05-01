import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Firestore } from '@google-cloud/firestore';
import { DataProduct } from '$lib/interfaces';
import type {ProxyDeployment, ProxyRevision} from 'apigee-x-module';
import { ApigeeService } from 'apigee-x-module';
import type {ApigeeTemplateService} from 'apigee-templater-module';
import { ApigeeTemplater, ApigeeTemplateInput, RunPoint } from 'apigee-templater-module';
import fs from 'fs';
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

  // Persist defnition to Firestore...
  let newDoc = firestore.doc("data-marketplace-products/" + newProduct.id);
  newDoc.set(newProduct);

  // Create and deploy to Apigee...
  let apigeeTemplate: ApigeeTemplateInput | undefined = undefined;
  
  if (newProduct.source === "bigquery")
    apigeeTemplate = createBigQueryTemplate(newProduct);
  else if (newProduct.source === "api")
    apigeeTemplate = createAPITemplate(newProduct);

  if (apigeeTemplate) {
    let tempPath = ".";
    let proxyResult = await apigeeTemplater.generateProxy(apigeeTemplate, tempPath);

    importProxy(apigeeTemplate.name, proxyResult.localPath).then((result: ProxyRevision) => {
      apigeeService.deployProxyRevision(apigeeEnvironment, apigeeTemplate.name, result.revision, `mpservice@${projectId}.iam.gserviceaccount.com`).then((deployResult) => {
        console.log(JSON.stringify(deployResult));
      });
    }).catch((error: any) => {
      console.error("Error in importProxy:");
      console.error(JSON.stringify(error));
    });
  }

	return json(newProduct);
}

function importProxy(name: string, path: string): Promise<ProxyRevision> {
  return new Promise<ProxyRevision>((resolve, reject) => {
    console.log("start getAccessToken");

    auth.getAccessToken().then((token) => {
      const formData = new FormData();
      let buffer = fs.readFileSync(path);
      formData.append('file', buffer, name + ".zip");
      
      fetch(`https://apigee.googleapis.com/v1/organizations/${projectId}/apis?name=${name}&action=import`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          ...formData.getHeaders()
        },
        body: formData.getBuffer()
      }).then((response) => {
        return response.json();
      }).then((result: ProxyRevision) => {
        resolve(result);
      }).catch((error) => {
        console.log("Error in proxy import:");
        console.error(error);
      });
    });
  });
}

function createAPITemplate(product: DataProduct): ApigeeTemplateInput {
  let result: ApigeeTemplateInput = {
    name: product.productName.replace(" ", "-"),
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
    name: product.productName.replace(" ", "-"),
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