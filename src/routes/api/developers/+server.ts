import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service.server';

export const POST: RequestHandler = async ({ url }) => {

	const email = url.searchParams.get('email') ?? '';
	const userName = url.searchParams.get('username') ?? '';
	let firstName = url.searchParams.get('firstname') ?? '';
  let lastName = url.searchParams.get('lastname') ?? '';
  
	if (!email || !userName) {
		error(400, 'Developer email and username are required');
	}

	if (lastName === '' && firstName === '' && userName.includes(' ')) {
		let names: string[] = userName.split(' ');
		firstName = names[0];
		lastName = names[1];
	}

	let appData = await appService.CreateDeveloper(email, firstName, lastName, userName);

	return json({});
};

export const GET: RequestHandler = async ({ url }) => {

	const email = url.searchParams.get('email') ?? '';
  
	if (!email) {
		error(400, 'Developer email is required');
	}

	let devData = await appService.GetDeveloper(email);

	return json(devData);
};