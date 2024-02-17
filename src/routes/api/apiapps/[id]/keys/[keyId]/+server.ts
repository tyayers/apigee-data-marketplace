import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service.server';

export const DELETE: RequestHandler = async({ params, url}) => {
	const email = url.searchParams.get('email') ?? '';

	if (!email || !params.id || !params.keyId) {
		error(400, 'email and appid are required');
	}

	console.log("deleting key " + params.keyId + " from app " + params.id + " from email " + email);

	let appData = await appService.DeleteApiAppKey(email, params.id, params.keyId);

	return json(appData);
}