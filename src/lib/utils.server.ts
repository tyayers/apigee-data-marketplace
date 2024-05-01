import { GoogleCloudDataService } from "./data-services/data-service.gcp";

export class UtilsServer {
  dataService: GoogleCloudDataService = new GoogleCloudDataService();
}

export let utilsServer: UtilsServer = new UtilsServer();