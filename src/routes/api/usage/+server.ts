import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appServerService } from '$lib/app-service.server';

export const GET: RequestHandler = async ({ url }) => {

	const usageData = await appServerService.dataService.getUsageData();

	return json({
		usage: usageData
	});
};