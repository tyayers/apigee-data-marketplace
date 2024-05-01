import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { utilsServer } from '$lib/utils.server';

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

	let devData = await utilsServer.dataService.getOrCreateUser(email, firstName, lastName, userName);
	return json(devData);
};