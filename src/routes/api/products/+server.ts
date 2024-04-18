import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Firestore } from '@google-cloud/firestore';
import { DataProduct } from '$lib/interfaces';
import type {ApiManagementInterface, ProxyRevision} from 'apigee-x-module';
import { ApigeeService } from 'apigee-x-module';
import type {ApigeeTemplateService} from 'apigee-templater-module';
import { ApigeeTemplater, ApigeeTemplateInput, RunPoint } from 'apigee-templater-module';

// Create a new client
const firestore = new Firestore();
// Create Apigee services
const apigeeTemplater: ApigeeTemplateService = new ApigeeTemplater();
const apigeeService: ApiManagementInterface = new ApigeeService();

export const GET: RequestHandler = async ({ url }) => {

  let prodColRef = firestore.collection("data-marketplace/products/definitions");
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
  let newDoc = firestore.doc("data-marketplace/products/definitions/" + newProduct.id);
  newDoc.set(newProduct);

  // Create and deploy to Apigee...
  let apigeeTemplate: ApigeeTemplateInput = createBigQueryTemplate(newProduct);
  console.log(JSON.stringify(apigeeTemplate));
  let tempPath = ".";
  apigeeTemplater.generateProxy(apigeeTemplate, tempPath);

	return json(newProduct);
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