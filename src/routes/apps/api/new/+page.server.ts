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
    
    if (email && name) {
		  await appService.CreateApiApp(email.toString(), name.toString(), description.toString(), products);
      // Now create Apigee subscription for monetization
      for (let product of products)
        await appService.dataService.createApigeeSubscription(email, product);

      redirect(303, "/apps/api");
    }
    else {
      console.error("Missing email or name!");
      return fail(400, {
        error: "Missing email or name",
      });
    }
	},
} satisfies Actions;