import type { PageServerLoad } from './$types';
import { appService } from '$lib/app-service.server';

export const load: PageServerLoad = async ({ params, setHeaders }) => {

	// setHeaders({
	// 	'cache-control': 'private, max-age=1800'
	// });

	return {
		products: await appService.GetApiProducts()
	};
};