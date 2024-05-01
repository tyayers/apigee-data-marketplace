import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { APIApp } from '$lib/interfaces';
import { utilsServer } from '$lib/utils.server';

export const GET: RequestHandler = async ({ params, url }) => {

	const email = url.searchParams.get('email') ?? '';

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}
	
	let appData = await utilsServer.dataService.getApiApp(email, params.id)

	return json(appData);
};

// POST on an app creates a new key
export const POST: RequestHandler = async({ params, url, request}) => {
	const email = url.searchParams.get('email') ?? '';

	const app: APIApp = await request.json();

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}

	let appData = await utilsServer.dataService.addApiAppKey(email, app);

	return json(appData);
}

export const PUT: RequestHandler = async ({ params, url, request }) => {

	const email = url.searchParams.get('email') ?? '';

	const app: APIApp = await request.json();

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}
	
	let appData = await utilsServer.dataService.updateApiApp(email, app);

	return json(appData);
};

export const DELETE: RequestHandler = async({ params, url}) => {
	const email = url.searchParams.get('email') ?? '';

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}

	let appData = await utilsServer.dataService.deleteApiApp(email, params.id);

	return json(appData);
}