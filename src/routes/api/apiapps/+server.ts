import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appServerService } from '$lib/app-service.server';
// import { GoogleCloudDataService } from '$lib/data-service.gcp';

// const dataService: GoogleCloudDataService = new GoogleCloudDataService();

export const GET: RequestHandler = async ({ url }) => {
	const email = url.searchParams.get('email') ?? '';

	if (!email) {
		error(400, 'email is required.');
	}
	
	let apps = await appServerService.dataService.getApiApps(email)

	return json(apps);
};