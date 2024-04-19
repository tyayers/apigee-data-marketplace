import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appServerService } from '$lib/app-service.server';

export const POST: RequestHandler = async ({ url }) => {

	const email = url.searchParams.get('email') ?? '';
	const userName = url.searchParams.get('username') ?? 'newUser';
	let firstName = url.searchParams.get('firstname') ?? 'New';
  let lastName = url.searchParams.get('lastname') ?? 'User';
  
	if (!email) {
		error(400, 'Developer email is required');
	}

	if (lastName === '' && firstName === '' && userName.includes(' ')) {
		let names: string[] = userName.split(' ');
		firstName = names[0];
		lastName = names[1];
	}

	let devData = await appServerService.dataService.createDeveloper(email, firstName, lastName, userName);
	return json(devData);
};

export const GET: RequestHandler = async ({ url }) => {

	const email = url.searchParams.get('email') ?? '';
  
	if (!email) {
		error(400, 'Developer email is required');
	}

	let devData = await appServerService.dataService.getDeveloper(email);

	return json(devData);
};