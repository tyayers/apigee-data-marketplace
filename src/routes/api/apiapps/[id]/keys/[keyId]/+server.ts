import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GoogleAuth } from 'google-auth-library';
import type { APIAppCredential } from '$lib/interfaces';
import { utilsServer } from '$lib/utils.server';

export const DELETE: RequestHandler = async({ params, url}) => {
	const email = url.searchParams.get('email') ?? '';

	if (!email || !params.id || !params.keyId) {
		error(400, 'email and appid are required');
	}

	let appData = await utilsServer.dataService.deleteApiAppKey(email, params.id, params.keyId)

	return json(appData);
}