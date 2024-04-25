import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { utilsServer } from '$lib/utils.server';

export const GET: RequestHandler = async ({ url }) => {

	const usageData = await utilsServer.dataService.getUsageData();

	return json({
		usage: usageData
	});
};