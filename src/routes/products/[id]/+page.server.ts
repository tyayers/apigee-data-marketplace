import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {

	// setHeaders({
	// 	'cache-control': 'max-age=600'
	// });

	return {
		productId: params.id
	};
};