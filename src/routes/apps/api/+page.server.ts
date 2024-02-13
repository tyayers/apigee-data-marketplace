import type { PageServerLoad } from './$types';
import { appService } from '$lib/app-service';

export const load: PageServerLoad = async ({ params }) => {
	return {
		apps: (await appService.GetApiApps()).apps
	};
};