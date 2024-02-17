import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service.server';
import type { ApiApp } from '$lib/interfaces';

export const GET: RequestHandler = async ({ params, url }) => {

	const email = url.searchParams.get('email') ?? '';

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}
	
	let appData = await appService.GetApiApp(email, params.id)

	return json(appData);
};

// POST on an app creates a new key
export const POST: RequestHandler = async({ params, url, request}) => {
	const email = url.searchParams.get('email') ?? '';

	const app: ApiApp = await request.json();

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}

	console.log("Start add key for app:");
	console.log(app);

	let appData = await appService.AddApiAppKey(email, app);

	return json(appData);
}

export const PUT: RequestHandler = async ({ params, url, request }) => {

	const email = url.searchParams.get('email') ?? '';

	const app: ApiApp = await request.json();

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}
	
	let appData = await appService.UpdateApiApp(email, app);

	return json(appData);
};

export const DELETE: RequestHandler = async({ params, url}) => {
	const email = url.searchParams.get('email') ?? '';

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}

	console.log("deleting app " + params.id + " from email " + email);

	let appData = await appService.DeleteApiApp(email, params.id);

	return json(appData);
}