import type { CategoryConfig } from "$lib/interfaces";
import { Firestore } from "@google-cloud/firestore";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

const firestore = new Firestore();

export const GET: RequestHandler = async ({ url, params }) => {

  let categories: CategoryConfig | undefined = undefined;

  const document = firestore.doc('data-marketplace-config/product');
  const doc = await document.get();

  if (doc.exists) {
    categories = doc.data() as CategoryConfig;
  }

  if (categories) {
   
    categories.categories.sort(function(a, b) {
      var textA = a.toUpperCase();
      var textB = b.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    return json(categories);
  }
  else
    error(404, "Categories not found.");
};

export const POST: RequestHandler = async({ params, url, request}) => {

  const newCategory = url.searchParams.get('name') ?? '';
  let categories: CategoryConfig | undefined = undefined;

  const document = firestore.doc('data-marketplace-config/product');
  const doc = await document.get();

  if (doc.exists) {
    categories = doc.data() as CategoryConfig;
  }

  if (categories && newCategory) {
    categories.categories.push(newCategory);
    // Persist defnition to Firestore...
    document.set(categories);
  }

	return json(categories);
}