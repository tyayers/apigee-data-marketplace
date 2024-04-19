import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// import { appService } from '$lib/app-service.server';
import type { ApiApp } from '$lib/interfaces';
import { appServerService } from '$lib/app-service.server';

export const GET: RequestHandler = async ({ params, url }) => {

	const email = url.searchParams.get('email') ?? '';

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}
	
	let appData = await appServerService.dataService.getApiApp(email, params.id)

	return json(appData);
};

// POST on an app creates a new key
export const POST: RequestHandler = async({ params, url, request}) => {
	const email = url.searchParams.get('email') ?? '';

	const app: ApiApp = await request.json();

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}

	let appData = await appServerService.dataService.addApiAppKey(email, app);

	return json(appData);
}

export const PUT: RequestHandler = async ({ params, url, request }) => {

	const email = url.searchParams.get('email') ?? '';

	const app: ApiApp = await request.json();

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}
	
	let appData = await appServerService.dataService.updateApiApp(email, app);

	return json(appData);
};

export const DELETE: RequestHandler = async({ params, url}) => {
	const email = url.searchParams.get('email') ?? '';

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}

	let appData = await appServerService.dataService.deleteApiApp(email, params.id);

	return json(appData);
}