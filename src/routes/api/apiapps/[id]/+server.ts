import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service.server';

export const GET: RequestHandler = async ({ params, url }) => {

	const email = url.searchParams.get('email') ?? '';

	if (!email || !params.id) {
		error(400, 'email and appid are required');
	}
	
	let appData = await appService.GetApiApp(email, params.id)

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