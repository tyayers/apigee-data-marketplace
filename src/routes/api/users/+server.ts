import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Firestore } from '@google-cloud/firestore';
import { utilsServer } from '$lib/utils.server';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});
// Create a new client
const firestore = new Firestore();

export const GET: RequestHandler = async ({ url }) => {

	const email = url.searchParams.get('email') ?? '';

	if (!email) {
		error(400, 'Developer email is required');
	}
  const document = firestore.doc('data-marketplace-users/' + email);
  const doc = await document.get();

  if (doc.exists)
	  return json(doc.data());
  else
    error(404, "User could not be found.");
};

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

	let userData = await utilsServer.dataService.getOrCreateUser(email, firstName, lastName, userName);
	return json(userData);
};