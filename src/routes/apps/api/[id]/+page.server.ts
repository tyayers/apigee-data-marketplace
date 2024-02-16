import type { PageServerLoad } from './$types';
import { appService } from '$lib/app-service.server';
import type { ApiApp } from '$lib/interfaces';
import { redirect, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {

	return {
		products: await appService.GetApiProducts(),
		appName: params.id
	};
};