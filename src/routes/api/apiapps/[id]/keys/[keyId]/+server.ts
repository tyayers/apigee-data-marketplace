import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ApiManagementInterface } from 'apigee-x-module';
// import { ApigeeService } from 'apigee-x-module';
import { GoogleAuth } from 'google-auth-library';
import type { ApiAppCredential } from '$lib/interfaces';
import { utilsServer } from '$lib/utils.server';

// const apigeeService: ApiManagementInterface = new ApigeeService();
// const auth = new GoogleAuth({
// 	scopes: 'https://www.googleapis.com/auth/cloud-platform'
// });

export const DELETE: RequestHandler = async({ params, url}) => {
	const email = url.searchParams.get('email') ?? '';

	if (!email || !params.id || !params.keyId) {
		error(400, 'email and appid are required');
	}

	let appData = await utilsServer.dataService.deleteApiAppKey(email, params.id, params.keyId)
	// let appData = await apigeeService.deleteAppCredential(email, params.id, params.keyId) as ApiAppCredential; 

	return json(appData);
}