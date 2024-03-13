import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service.server';
import { Storage, type GetSignedUrlConfig } from '@google-cloud/storage'
import { Firestore } from '@google-cloud/firestore';
import { DataProduct } from '$lib/interfaces';

// Create a new client
const firestore = new Firestore();

export const GET: RequestHandler = async ({ url }) => {

  const email = url.searchParams.get('email') ?? '';

  const document = firestore.doc('data-marketplace-products/' + email);
  const doc = await document.get();

  if (doc.exists)
	  return json(doc.data()?.subscriptions);
  else
    return json([]);
};

export const POST: RequestHandler = async({ params, url, request}) => {
	const email = url.searchParams.get('email') ?? '';
  const name = url.searchParams.get('name') ?? '';
	const description = url.searchParams.get('description') ?? '';
  const dataSource = url.searchParams.get('dataSource') ?? '';
  const query = url.searchParams.get('query') ?? '';

  const protocols = url.searchParams.get('protocols') ?? '';
  const groups = url.searchParams.get('groups') ?? '';
  const status: string = "Active";

  const document = firestore.doc('data-marketplace-products/' + email);
  const doc = await document.get();
  let myData: { subscriptions: DataProduct[] } = {
    subscriptions: []
  };

  if (doc.exists) {
    myData = {
      subscriptions: doc.data()?.subscriptions
    }
  }

  var newProduct: DataProduct = {
    name: name,
    description: description,
    dataSource: dataSource,
    query: query,
    protocols: protocols,
    groups: groups,
    status: status
  };

  if (myData) {
    myData.subscriptions.push(newProduct);

    await document.set(myData);
  }

	return json(newProduct);
}

export const DELETE: RequestHandler = async({ params, url, request}) => {
	const email = url.searchParams.get('email') ?? '';
  const name = url.searchParams.get('name') ?? '';

  const document = firestore.doc('data-marketplace-products/' + email);
  const doc = await document.get();
  let myData: { subscriptions: DataProduct[] } = {
    subscriptions: []
  };

  if (doc.exists) {
    myData = {
      subscriptions: doc.data()?.subscriptions
    }
  }

  let mySub: DataProduct | undefined = myData.subscriptions.find(sub => sub.name === name);
  if (mySub) {
    let index = myData.subscriptions.indexOf(mySub);
    myData.subscriptions.splice(index, 1);
  }

  if (myData) {
    await document.set(myData);
  }

	return json(mySub);
}