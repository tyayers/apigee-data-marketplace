# Load environment variables
gcloud config set project $PROJECT_ID

# Deploy signed url function
cd ./services/signedurl-function
gcloud functions deploy signedurl-function \
  --gen2 \
  --runtime=python310 \
  --region=$REGION \
  --source=. \
  --entry-point=get_url \
  --ingress-settings=all \
  --trigger-http \
  --no-allow-unauthenticated \
  --service-account=mpservice@$PROJECT_ID.iam.gserviceaccount.com
cd ../..
# Get function URL
FUNCTION_URL=$(gcloud functions describe signedurl-function --region $REGION --format 'value(url)')
# Set in Apigee KVM so the API knows where to call
apigeecli kvms entries create -m marketplace-kvm -k storage_function_url -l $FUNCTION_URL -e $APIGEE_ENV -o $PROJECT_ID -t $(gcloud auth print-access-token) 2>/dev/null
apigeecli kvms entries update -m marketplace-kvm -k storage_function_url -l $FUNCTION_URL -e $APIGEE_ENV -o $PROJECT_ID -t $(gcloud auth print-access-token)
gcloud functions add-invoker-policy-binding signedurl-function \
  --member="serviceAccount:mpservice@$PROJECT_ID.iam.gserviceaccount.com" --region=$REGION

# Deploy marketplace app
SECONDS=0
# Create artifact registry, if needed
gcloud artifacts repositories create docker-registry --repository-format=docker \
--location="$REGION" --description="Docker registry" 2>/dev/null    

# Submit build
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_LOCATION="$REGION",_REPOSITORY="docker-registry",_IMAGE="$SERVICE_NAME" .

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME --image "$REGION-docker.pkg.dev/$PROJECT_ID/docker-registry/$SERVICE_NAME" \
    --platform managed --region $REGION --allow-unauthenticated --min-instances=1

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --format 'value(status.url)' --region $REGION)

# Redeploy to Cloud Run
gcloud run deploy $SERVICE_NAME --image "$REGION-docker.pkg.dev/$PROJECT_ID/docker-registry/$SERVICE_NAME" \
  --platform managed --region $REGION --allow-unauthenticated --min-instances=1 \
  --service-account=mpservice@$PROJECT_ID.iam.gserviceaccount.com --port=3000 \
  --set-env-vars "ORIGIN=$SERVICE_URL,VITE_ORIGIN=$SERVICE_URL"

# gcloud run deploy $SERVICE_NAME --image "$REGION-docker.pkg.dev/$PROJECT_ID/docker-registry/$SERVICE_NAME" \
#   --platform managed --region $REGION --allow-unauthenticated --min-instances=1 \
#   --service-account=mpservice@$PROJECT_ID.iam.gserviceaccount.com --port=3000 \
#   --set-env-vars "ORIGIN=$SERVICE_URL,PUBLIC_ORIGIN=$SERVICE_URL,PUBLIC_SITE_NAME=$SITE_NAME,PUBLIC_API_HOST=$APIGEE_ENVGROUP_HOST,PUBLIC_PROJECT_ID=$PROJECT_ID,PUBLIC_APIGEE_ENV=$APIGEE_ENV,PUBLIC_FIREBASE_APIKEY=$FIREBASE_APIKEY,PUBLIC_FIREBASE_AUTHDOMAIN=$FIREBASE_AUTHDOMAIN"

duration=$SECONDS
echo "Total deployment finished in $((duration / 60)) minutes and $((duration % 60)) seconds."