import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { utilsServer } from '$lib/utils.server';
// import { GoogleCloudDataService } from '$lib/data-service.gcp';

// const dataService: GoogleCloudDataService = new GoogleCloudDataService();

export const GET: RequestHandler = async ({ url }) => {
	const email = url.searchParams.get('email') ?? '';

	if (!email) {
		error(400, 'email is required.');
	}
	
	let apps = await utilsServer.dataService.getApiApps(email)

	return json(apps);
};