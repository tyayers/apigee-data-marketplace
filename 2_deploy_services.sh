# Load environment variables
gcloud config set project $PROJECT_ID
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
    --service-account=mpservice@$PROJECT_ID.iam.gserviceaccount.com \
    --set-env-vars ORIGIN="$SERVICE_URL,VITE_SITE_NAME=$SITE_NAME,VITE_API_HOST=$APIGEE_ENVGROUP_HOST,VITE_PROJECT_ID=$PROJECT_ID,VITE_APIGEE_ENV=$APIGEE_ENV,VITE_FIREBASE_APIKEY=$FIREBASE_APIKEY,VITE_FIREBASE_AUTHDOMAIN=$FIREBASE_AUTHDOMAIN"

duration=$SECONDS
echo "Total deployment finished in $((duration / 60)) minutes and $((duration % 60)) seconds."