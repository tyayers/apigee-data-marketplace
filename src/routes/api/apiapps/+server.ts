import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service.server';

export const GET: RequestHandler = async ({ url }) => {
	const email = url.searchParams.get('email') ?? '';

	if (!email) {
		error(400, 'email is required.');
	}
	
	let apps = await appService.GetApiApps(email)

	return json(apps);
};