import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

import { appService } from '$lib/app-service.server';
import type { ApiApps, Products } from '$lib/interfaces';

export const load: PageServerLoad = async ({ params }) => {
  let products: Products | undefined= undefined;

  products = await appService.GetApiProducts();
  
	return {
    products: products.products
  };
};

export const actions = {
	default: async (event) => {
    const data = await event.request.formData();
    const formKeys = data.keys();

    let email: string = "";
    let name: string = "";
    let description: string = "";
    let products: string[] = [];

    for (const key of formKeys) {
      console.log(key);
      if (key === "email") {
        email = data.get(key)?.toString() || "";
      } else if (key === "name") {
        name = data.get(key)?.toString() || "";
      } else if (key === "description") {
        description = data.get(key)?.toString() || "";
      } else {
        let value = data.get(key)?.toString();
        if (value === "on") {
          products.push(key);
        }
      }
    }

    console.log(email + " " + name);
    
    if (email && name) {
		  appService.CreateApiApp(email.toString(), name.toString(), products);
      redirect(303, "/apps/api");
    }
    else {
      console.error("Missing email or name!");
      // return fail(400, {
      //   error: "Missing email or name",
      // });
    }
	},
} satisfies Actions;