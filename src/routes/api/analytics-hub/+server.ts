import { json, type RequestHandler } from "@sveltejs/kit";
import type { DataExchange, DataExchnageListing } from "$lib/interfaces";
import { GoogleAuth } from "google-auth-library";

const projectId: string = import.meta.env.VITE_PROJECT_ID;

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

export const GET: RequestHandler = async ({ url, setHeaders }) => {
  let token = await auth.getAccessToken();
  let result: {dataExchanges: DataExchange[], listings: DataExchnageListing[]} = {dataExchanges: [], listings: []};
  let exchangeData: {dataExchanges: DataExchange[]} = {dataExchanges: []};

  let exchangesResponse = await fetch(`https://analyticshub.googleapis.com/v1/projects/${projectId}/locations/eu/dataExchanges`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  if (exchangesResponse.status == 200) {
    exchangeData = await exchangesResponse.json();
  }
  else {
    console.error(`Error retrieving AnalyticsHub Exchanges from project ${projectId}.`);
    console.error(`Response ${exchangesResponse.status} - ${exchangesResponse.statusText}`);
  }

  if (exchangeData && exchangeData.dataExchanges && exchangeData.dataExchanges.length > 0) {
    
    result.dataExchanges = result.dataExchanges.concat(exchangeData.dataExchanges);

    for (let exchange of exchangeData.dataExchanges) {
      let listingsData: {listings: DataExchnageListing[]} = {listings: []};

      let listingsResponse = await fetch(`https://analyticshub.googleapis.com/v1/${exchange.name}/listings`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      if (listingsResponse.status == 200) {
        listingsData = await listingsResponse.json();
      }
      else {
        console.error(`Error retrieving AnalyticsHub Exchange listings for ${exchange.name}.`);
        console.error(`Response ${listingsResponse.status} - ${listingsResponse.statusText}`);
      }

      if (listingsData && listingsData.listings && listingsData.listings.length > 0) {
        result.listings = result.listings.concat(listingsData.listings);
      }
    }
  }

  return json(result);
};