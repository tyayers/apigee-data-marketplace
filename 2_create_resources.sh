echo "Setting project to $PROJECT_ID"
gcloud config set project $PROJECT_ID
TOKEN=$(gcloud auth print-access-token)

echo "Enabling APIs..."
gcloud services enable firestore.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable integrations.googleapis.com
gcloud services enable connectors.googleapis.com
gcloud services enable cloudkms.googleapis.com
gcloud services enable identitytoolkit.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable iamcredentials.googleapis.com

# Sleep 5 seconds to let the API be initialized...
sleep 5

echo "Creating service account and assigning roles..."
gcloud iam service-accounts create mpservice \
    --description="Service account to manage marketplace services" \
    --display-name="MarketplaceService"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:mpservice@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/integrations.integrationInvoker"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:mpservice@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/datastore.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:mpservice@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/apigee.developerAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:mpservice@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/apigee.environmentAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:mpservice@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/bigquery.dataViewer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:mpservice@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:mpservice@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/bigquery.jobUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:mpservice@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:mpservice@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountTokenCreator"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:mpservice@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.invoker"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="user:$ADMIN_EMAIL" \
    --role="roles/integrations.suspensionResolver"

echo "Provision Application Integration..."
integrationcli provision -t $TOKEN -p $PROJECT_ID -r $REGION

PROJECTNUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:service-$PROJECTNUMBER@gcp-sa-integrations.iam.gserviceaccount.com" \
    --role='roles/iam.serviceAccountTokenCreator'

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:service-$PROJECTNUMBER@gcp-sa-integrations.iam.gserviceaccount.com" \
    --role='roles/cloudkms.cryptoKeyEncrypterDecrypter'

sleep 5

echo "Create integration auth profile..."
curl -X POST "https://integrations.googleapis.com/v1/projects/$PROJECT_ID/locations/$REGION/authConfigs" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data-binary @- << EOF

{
  "displayName": "Marketplace Auth Profile",
  "decryptedCredential": {
    "credentialType": "SERVICE_ACCOUNT",
    "serviceAccountCredentials": {
      "serviceAccount": "mpservice@$PROJECT_ID.iam.gserviceaccount.com",
      "scope": "https://www.googleapis.com/auth/cloud-platform"
    }
  }
}
EOF

echo "Creating Firestore default instance..."
if [[ $(gcloud app describe 2>&1 || true) == *'ERROR'* ]]; then echo 'No app engine or firestore instances found, creating...' && gcloud app create --region=europe-west; fi
gcloud alpha firestore databases update --type=firestore-native

echo "Setting web app variables..."
touch .env
echo $"PUBLIC_SITE_NAME=$SITE_NAME" >> .env
echo $"PUBLIC_API_HOST=$APIGEE_ENVGROUP_HOST" >> .env
echo $"PUBLIC_PROJECT_ID=$PROJECT_ID" >> .env
echo $"PUBLIC_APIGEE_ENV=$APIGEE_ENV" >> .env
echo $"PUBLIC_APIHUB_REGION=$APIGEE_APIHUB_REGION" >> .env
echo $"PUBLIC_FIREBASE_APIKEY=$FIREBASE_APIKEY" >> .env
echo $"PUBLIC_FIREBASE_AUTHDOMAIN=$FIREBASE_AUTHDOMAIN" >> .env
echo $"PUBLIC_OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID" >> .env

echo "Creating Apigee KVM..."
apigeecli kvms create -e $APIGEE_ENV -n marketplace-kvm -o $PROJECT_ID -t $(gcloud auth print-access-token)

echo "Creating storage bucket..."
gcloud storage buckets create gs://$BUCKET_NAME --location=eu
# Set in Apigee KVM so the API knows the bucket
apigeecli kvms entries create -m marketplace-kvm -k storage_bucket -l $BUCKET_NAME -e $APIGEE_ENV -o $PROJECT_ID -t $(gcloud auth print-access-token) 2>/dev/null
apigeecli kvms entries update -m marketplace-kvm -k storage_bucket -l $BUCKET_NAME -e $APIGEE_ENV -o $PROJECT_ID -t $(gcloud auth print-access-token)
