import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { utilsServer } from '$lib/utils.server';
import type { APIApp } from '$lib/interfaces';

export const GET: RequestHandler = async ({ url }) => {
	const email = url.searchParams.get('email') ?? '';

	if (!email) {
		error(400, 'email is required.');
	}
	
	let apps = await utilsServer.dataService.getApiApps(email)

	return json(apps);
};

export const POST: RequestHandler = async ({ url, request }) => {
	const email = url.searchParams.get('email') ?? '';
  let newApp: APIApp = await request.json();

	if (!email) {
		error(400, 'email is required.');
	}
	
  await utilsServer.dataService.createApiApp(email.toString(), newApp.name, newApp.description, newApp.apiProducts);

  // Now create Apigee subscription for monetization
  for (let product of newApp.apiProducts) {
    await utilsServer.dataService.createApigeeSubscription(email, product);
  }

	return json(newApp);
};