import type { PageServerLoad } from './$types';
import { appService } from '$lib/app-service.server';
import type { ApiApp } from '$lib/interfaces';

export const load: PageServerLoad = async ({ params }) => {

	return {
		products: await appService.GetApiProducts(),
		appid: params.id
	};
};