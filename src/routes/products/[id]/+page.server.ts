import type { PageServerLoad } from './$types';
import { appService } from '$lib/app-service';

export const load: PageServerLoad = async ({ params }) => {
	return {
		product: await appService.GetApiProduct(params.id)
	};
};