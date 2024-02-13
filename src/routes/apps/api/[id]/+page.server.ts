import type { PageServerLoad } from './$types';
import { appService } from '$lib/app-service';
import type { ApiApp } from '$lib/interfaces';

export const load: PageServerLoad = async ({ params }) => {
  // let app: ApiApp | undefined= undefined;

  // if (appService.currentUser?.email)
  //   app = await appService.GetApiApp(appService.currentUser.email, params.id);
  
	return {
		appid: params.id
	};
};