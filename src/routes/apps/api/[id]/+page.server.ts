import type { PageServerLoad } from './$types';
import { appServerService } from '$lib/app-service.server';
import type { ApiApp } from '$lib/interfaces';
import { redirect, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {

	return {
		products: await appServerService.dataService.getProducts(),
		appName: params.id
	};
};