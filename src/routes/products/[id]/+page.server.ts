import type { PageServerLoad } from './$types';
import { utilsServer } from '$lib/utils.server';

export const load: PageServerLoad = async ({ params, setHeaders }) => {

	// setHeaders({
	// 	'cache-control': 'max-age=600'
	// });

	return {
		productId: params.id
	};
};