import type { DataProduct } from "$lib/interfaces";
import { Firestore } from "@google-cloud/firestore";
import { error, json, type RequestHandler } from "@sveltejs/kit";

// Create a new client
const firestore = new Firestore();

export const GET: RequestHandler = async ({ url, params }) => {

  let id: string = "";
  if (params.id) id = params.id;

  let resultProduct: DataProduct | undefined = undefined;

  const document = firestore.doc('data-marketplace-products/' + id);
  const doc = await document.get();

  if (doc.exists) {
    let docData = doc.data();
    if (docData)
      resultProduct = docData as DataProduct;
  }

  if (resultProduct) {
	  return json(resultProduct);
  }
  else
    error(404, "Product not found.");
};

export const PUT: RequestHandler = async({ params, url, request}) => {

  let newProduct: DataProduct = await request.json();

  let newDoc = firestore.doc("data-marketplace-products/" + newProduct.id);
  newDoc.set(newProduct);
	return json(newProduct);
}

export const DELETE: RequestHandler = async({ params, url, request}) => {
  let id: string = "";
  if (params.id) id = params.id;

  let resultProduct: DataProduct | undefined = undefined;

  const document = firestore.doc('data-marketplace-products/' + id);
  const doc = await document.get();

  if (doc.exists) {
    let docData = doc.data();
    if (docData)
      resultProduct = docData as DataProduct;
  }

  await document.delete();

  if (resultProduct) {
	  return json(resultProduct);
  }
  else
    error(404, "Product not found.");
}