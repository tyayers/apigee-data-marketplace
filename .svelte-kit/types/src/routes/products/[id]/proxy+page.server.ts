// @ts-nocheck
import type { PageServerLoad } from './$types';
import { appService } from '$lib/app-service';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
	return {
		product: await appService.GetApiProduct(params.id)
	};
};