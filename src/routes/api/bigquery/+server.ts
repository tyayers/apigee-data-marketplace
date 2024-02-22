import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service.server';
import { Storage, type GetSignedUrlConfig } from '@google-cloud/storage'
import { Firestore } from '@google-cloud/firestore';
import { AHSubscription } from '$lib/interfaces';

// Creates a client
const storage = new Storage();
// Create a new client
const firestore = new Firestore();

export const GET: RequestHandler = async ({ url }) => {

  const email = url.searchParams.get('email') ?? '';

  const document = firestore.doc('data-marketplace-hub/' + email);
  const doc = await document.get();

  if (doc.exists)
	  return json(doc.data()?.subscriptions);
  else
    return json([]);
};

export const POST: RequestHandler = async({ params, url, request}) => {
	const email = url.searchParams.get('email') ?? '';
  const project = url.searchParams.get('project') ?? '';
	const product = url.searchParams.get('product') ?? '';
  const dataset = url.searchParams.get('dataset') ?? '';
  const listingId = url.searchParams.get('listingId') ?? '';
  const marketplaceId = url.searchParams.get('marketplaceId') ?? '';
  const createdAt = url.searchParams.get('createdAt') ?? '';
  const status: string = "Inactive";

  var createResult = await appService.createHubSubscription(project, dataset, marketplaceId, listingId);

  const document = firestore.doc('data-marketplace-hub/' + email);
  const doc = await document.get();
  let myData: { subscriptions: AHSubscription[] } = {
    subscriptions: []
  };

  if (doc.exists) {
    myData = {
      subscriptions: doc.data()?.subscriptions
    }
  }

  var newSubscription: AHSubscription = {
    product: product,
    listingId: listingId,
    marketplaceId: marketplaceId,
    createdAt: createdAt,
    project: project,
    dataset: dataset,
    status: status
  };

  if (myData) {
    myData.subscriptions.push(newSubscription);

    await document.set(myData);
  }

	return json(newSubscription);
}