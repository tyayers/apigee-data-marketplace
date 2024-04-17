import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service.server';
import { Storage, type GetSignedUrlConfig } from '@google-cloud/storage'
import { Firestore } from '@google-cloud/firestore';
import { DataProduct } from '$lib/interfaces';

// Create a new client
const firestore = new Firestore();

export const GET: RequestHandler = async ({ url }) => {

  const document = firestore.doc('data-marketplace/products');
  const doc = await document.get();

  if (doc.exists)
	  return json(doc.data());
  else
    return json({
      definitions: {}
    });
};

export const POST: RequestHandler = async({ params, url, request}) => {

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