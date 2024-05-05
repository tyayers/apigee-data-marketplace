import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { utilsServer } from '$lib/utils.server';

export const GET: RequestHandler = async ({ url }) => {
  const email = url.searchParams.get('email') ?? '';
	const usageData = await utilsServer.dataService.getUsageData(email);

	return json({
		usage: usageData
	});
};