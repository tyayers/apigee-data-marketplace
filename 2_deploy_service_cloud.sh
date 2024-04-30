# Load environment variables
source 1_env.dev.sh
gcloud config set project $PROJECT_ID
SECONDS=0

# Create artifact registry, if needed
gcloud artifacts repositories create docker-registry --repository-format=docker \
--location="$REGION" --description="Docker registry" 2>/dev/null    

# Submit build
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_LOCATION="$REGION",_REPOSITORY="docker-registry",_IMAGE="$NAME" .

# Deploy to Cloud Run
gcloud run deploy $NAME --image "$REGION-docker.pkg.dev/$PROJECT_ID/docker-registry/$NAME" \
    --platform managed --region $REGION --allow-unauthenticated --min-instances=1 \
    --set-env-vars ORIGIN="$CLOUD_RUN_URL"

duration=$SECONDS
echo "Total deployment finished in $((duration / 60)) minutes and $((duration % 60)) seconds."