import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { appService } from '$lib/app-service.server';
import { Storage, type GetSignedUrlConfig } from '@google-cloud/storage'
import { Firestore } from '@google-cloud/firestore';

// Creates a client
const storage = new Storage();
// Create a new client
const firestore = new Firestore();

export const GET: RequestHandler = async ({ url }) => {

  const email = url.searchParams.get('email') ?? '';

  const document = firestore.doc('data-marketplace-storage/' + email);
  const doc = await document.get();

	return json(doc.data()?.urls);
};

export const POST: RequestHandler = async({ params, url, request}) => {
	const email = url.searchParams.get('email') ?? '';
	const product = url.searchParams.get('product') ?? '';
	const newUrl = "https://storage.googleapis.com/example-bucket/cat.jpeg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=example%40example-project.iam.gserviceaccount.com%2F20181026%2Fus-central1%2Fstorage%2Fgoog4_request&X-Goog-Date=20181026T181309Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=247a2aa45f169edf4d187d54e7cc46e4731b1e6273242c4f4c39a1d2507a0e58706e25e3a85a7dbb891d62afa8496def8e260c1db863d9ace85ff0a184b894b117fe46d1225c82f2aa19efd52cf21d3e2022b3b868dcc1aca2741951ed5bf3bb25a34f5e9316a2841e8ff4c530b22ceaa1c5ce09c7cbb5732631510c20580e61723f5594de3aea497f195456a2ff2bdd0d13bad47289d8611b6f9cfeef0c46c91a455b94e90a66924f722292d21e24d31dcfb38ce0c0f353ffa5a9756fc2a9f2b40bc2113206a81e324fc4fd6823a29163fa845c8ae7eca1fcf6e5bb48b3200983c56c5ca81fffb151cca7402beddfc4a76b133447032ea7abedc098d2eb14a7";

  // Generate a signed URL to a storage file
  // // These options will allow temporary read access to the file
  // const options: GetSignedUrlConfig = {
  //   version: 'v4',
  //   action: 'read',
  //   expires: Date.now() + 60 * 60 * 1000,
    
  // };

  // // Get a v4 signed URL for reading the file
  // const [url] = await storage
  //   .bucket("data-marketplace78")
  //   .file("exports/data-20240220.csv")
  //   .getSignedUrl(options);

  // console.log('Generated GET signed URL:');
  // console.log(url);
  // console.log('You can use this URL with any user agent, for example:');
  // console.log(`curl '${url}'`);

  const document = firestore.doc('data-marketplace-storage/' + email);
  const doc = await document.get();
  let myData = {
    urls: doc.data()?.urls
  };

  if (myData) {
    myData.urls.push({
      product: product,
      url: newUrl 
    });

    await document.set(myData);
  }

	return json(myData.urls);
}