import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Firestore } from '@google-cloud/firestore';
import { GoogleAuth } from 'google-auth-library';
import { User } from '$lib/interfaces';
import { PUBLIC_API_HOST } from '$env/static/public';

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

const firestore = new Firestore();

export const GET: RequestHandler = async ({ url, params }) => {

  let prodColRef = firestore.collection("data-marketplace-users");
  let products = await prodColRef.listDocuments();

  let results: User[] = [];
  for (let doc of products.entries()) {
    let docData = await doc[1].get()
    results.push(docData.data() as User);
  }

  return json(results);
};

export const POST: RequestHandler = async ({ request }) => {

  let userData: User = await request.json();
  
	if (!userData || !userData.email) {
		error(400, 'Developer data is required');
	}

	if (!userData.firstName && !userData.lastName && userData.userName.includes(' ')) {
		let names: string[] = userData.userName.split(' ');
		userData.firstName = names[0];
		userData.lastName = names[1];
	}

  let newUser = await getOrCreateUser(userData);
  
	return json(newUser);
};

async function getOrCreateUser(user: User): Promise<User | undefined> {
  let response = await fetch("https://" + PUBLIC_API_HOST + "/v1/users", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName
    }),
  });
    
  if (response.status == 200) {
    let data: any = await response.json();
    let appUser: User = new User(data.userData.email, data.userData.userName, data.userData.firstName, data.userData.lastName);
    appUser.developerData = data.developerData;
    if (data.userData) {
      appUser.roles = data.userData.roles;
      appUser.status = data.userData.status;
    }

    return appUser;
  }
  else {
    console.error(`Error getting user ${user.email}.`);
    console.error(`Response ${response.status} - ${response.statusText}`);
  }

  return;
}