import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

import { appService } from '$lib/app-service';

export const actions = {
	default: async (event) => {
    const data = await event.request.formData();
    const email = data.get("email");
    const name = data.get("name");
    
    console.log(email?.toString(), name?.toString());

    if (email && name) {
		  appService.CreateApiApp(email.toString(), name.toString(), []);
      redirect(303, "/apps/api");
    }
	},
} satisfies Actions;