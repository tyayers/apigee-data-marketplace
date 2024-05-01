import type { PageServerLoad } from './$types';
import { utilsServer } from '$lib/utils.server';
import type { APIApp } from '$lib/interfaces';
import { redirect, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {

	return {
		products: await utilsServer.dataService.getProducts(),
		appName: params.id
	};
};