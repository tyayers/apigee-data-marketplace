import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service.server';

export const GET: RequestHandler = async ({ url }) => {

	const usageData = await appService.dataService.getUsageData();

	return json({
		usage: usageData
	});
};