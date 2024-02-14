import type { PageServerLoad } from './$types';
import { appService } from '$lib/app-service.server';

export const load: PageServerLoad = async ({ params, setHeaders }) => {

	setHeaders({
		'cache-control': 'max-age=600'
	});

	return {
		product: await appService.GetApiProduct(params.id)
	};
};