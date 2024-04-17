import type { DataProduct } from "$lib/interfaces";
import { Firestore } from "@google-cloud/firestore";
import { error, json, type RequestHandler } from "@sveltejs/kit";

// Create a new client
const firestore = new Firestore();

export const GET: RequestHandler = async ({ url, params }) => {

  let id: string = "";
  if (params.id) id = params.id;

  const document = firestore.doc('data-marketplace/products');
  const doc = await document.get();
  let productData: { definitions: {[key: string]: DataProduct} } = {
    definitions: {}
  };

  if (doc.exists) {
    let docData = doc.data();
    if (docData && docData.definitions)
      productData.definitions = docData.definitions;
  }
  
  let myProduct: DataProduct | undefined = undefined;
  if (productData.definitions[id])
    myProduct = productData.definitions[id];

  if (myProduct) {
	  return json(myProduct);
  }
  else
    error(404, "Product not found.");
};

export const PUT: RequestHandler = async({ params, url, request}) => {

  let newProduct: DataProduct = await request.json();

  const document = firestore.doc('data-marketplace/products');
  const doc = await document.get();
  let productData: { definitions: { [key: string]: DataProduct} } = {
    definitions: {}
  };

  if (doc.exists) {
    let docData = doc.data();
    if (docData)
      productData.definitions = docData.definitions as { [key: string]: DataProduct };
  }

  if (productData) {
    productData.definitions[newProduct.id] = newProduct;
    console.log(productData);
    await document.set(productData);
  }

	return json(newProduct);
}

export const DELETE: RequestHandler = async({ params, url, request}) => {
  let id: string = "";
  if (params.id) id = params.id;

  const document = firestore.doc('data-marketplace/products');
  const doc = await document.get();
  let myData: { definitions: { [key: string]: DataProduct }} = {
    definitions: {}
  };

  if (doc.exists) {
    let docData = doc.data();
    if (docData && docData.definitions) {
      myData.definitions = docData.definitions;
    }
  }
  delete myData.definitions[id];

  if (myData) {
    await document.set(myData);
  }

	return json({
    result: "Ok"
  });
}