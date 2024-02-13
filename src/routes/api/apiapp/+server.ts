import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service';

export const GET: RequestHandler = async ({ url }) => {

	const email = url.searchParams.get('email') ?? '';
	const appId = url.searchParams.get('appid') ?? '';

	if (!email || !appId) {
		error(400, 'email and appid are required');
	}
	
	let appData = await appService.GetApiApp(email, appId)

	return json(appData);
};