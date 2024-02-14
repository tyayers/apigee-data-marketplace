import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service.server';

export const GET: RequestHandler = async ({ url }) => {

	let products = await appService.GetApiProducts();

	return json(products);
};