import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GoogleAuth } from 'google-auth-library';
const projectId = import.meta.env.VITE_PROJECT_ID;
const apigeeEnvironment = import.meta.env.VITE_APIGEE_ENV;

let auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

export const GET: RequestHandler = async ({ url }) => {
  const email = url.searchParams.get('email') ?? '';

  let token: string | null | undefined = await auth.getAccessToken();
  let endDate = new Date();
  let startDate = new Date(new Date(endDate).setDate(endDate.getDate() - 90));
  let startDateString: string = (startDate.getMonth() + 1).toString() + "/" + startDate.getDate().toString() + "/" + startDate.getFullYear().toString();
  let endDateString: string = (endDate.getMonth() + 1).toString() + "/" + endDate.getDate().toString() + "/" + endDate.getFullYear().toString();

  //let timeRange = "02/01/2024+00:00~02/28/2024+23:59"
  let timeRange = startDateString + "+00:00~" + endDateString + "+23:59";
  let response = await fetch(`https://apigee.googleapis.com/v1/organizations/${projectId}/environments/${apigeeEnvironment}/stats/developer_app?select=avg(total_response_time)&timeRange=${timeRange}&timeUnit=month&filter=(developer_email%20eq%20'${email}')`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  let data = await response.json();
  return json(data);
};