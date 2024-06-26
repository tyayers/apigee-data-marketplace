gcloud config set project $PROJECT_ID

INTEGATION_NAME=MP-UsersFirestore
cp ./integrations/$INTEGATION_NAME.json ./integrations/$INTEGATION_NAME.local.json
sed -i "s/example-project/$PROJECT_ID/g" ./integrations/$INTEGATION_NAME.local.json
curl -X POST "https://integrations.googleapis.com/v1/projects/$PROJECT_ID/locations/$REGION/integrations/$INTEGATION_NAME/versions" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data-binary @./integrations/$INTEGATION_NAME.local.json
SNAPSHOT=$(echo $(integrationcli integrations versions list -t $(gcloud auth print-access-token) -n $INTEGATION_NAME -p $PROJECT_ID -r $REGION) | jq ".integrationVersions[0].snapshotNumber")
integrationcli integrations versions publish -t $(gcloud auth print-access-token) -n $INTEGATION_NAME -p $PROJECT_ID -r $REGION -s $SNAPSHOT

INTEGATION_NAME=MP-UsersRoles
cp ./integrations/$INTEGATION_NAME.json ./integrations/$INTEGATION_NAME.local.json
sed -i "s/example-project/$PROJECT_ID/g" ./integrations/$INTEGATION_NAME.local.json
curl -X POST "https://integrations.googleapis.com/v1/projects/$PROJECT_ID/locations/$REGION/integrations/$INTEGATION_NAME/versions" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data-binary @./integrations/$INTEGATION_NAME.local.json
SNAPSHOT=$(echo $(integrationcli integrations versions list -t $(gcloud auth print-access-token) -n $INTEGATION_NAME -p $PROJECT_ID -r $REGION) | jq ".integrationVersions[0].snapshotNumber")
integrationcli integrations versions publish -t $(gcloud auth print-access-token) -n $INTEGATION_NAME -p $PROJECT_ID -r $REGION -s $SNAPSHOT

INTEGATION_NAME=MP-Users
# Make a copy and replace variables
cp ./integrations/$INTEGATION_NAME.json ./integrations/$INTEGATION_NAME.local.json
sed -i "s/example-project/$PROJECT_ID/g" ./integrations/$INTEGATION_NAME.local.json
sed -i "s/approver@example.com/$ADMIN_EMAIL/g" ./integrations/$INTEGATION_NAME.local.json
sed -i "s/"example.com"/$INTERNAL_DOMAINS/g" ./integrations/$INTEGATION_NAME.local.json

curl -X POST "https://integrations.googleapis.com/v1/projects/$PROJECT_ID/locations/$REGION/integrations/$INTEGATION_NAME/versions" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data-binary @./integrations/$INTEGATION_NAME.local.json
SNAPSHOT=$(echo $(integrationcli integrations versions list -t $(gcloud auth print-access-token) -n $INTEGATION_NAME -p $PROJECT_ID -r $REGION) | jq ".integrationVersions[0].snapshotNumber")
integrationcli integrations versions publish -t $(gcloud auth print-access-token) -n $INTEGATION_NAME -p $PROJECT_ID -r $REGION -s $SNAPSHOT

INTEGATION_NAME=MP-StorageSync
curl -X POST "https://integrations.googleapis.com/v1/projects/$PROJECT_ID/locations/$REGION/integrations/$INTEGATION_NAME/versions" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data-binary @./integrations/$INTEGATION_NAME.json
# Save config variables for deployment
echo "{\"\`CONFIG_projectId\`\": \"$PROJECT_ID\", \"\`CONFIG_apigeeHost\`\": \"$APIGEE_ENVGROUP_HOST\"}" > "$INTEGATION_NAME.config.local.json"

SNAPSHOT=$(echo $(integrationcli integrations versions list -t $(gcloud auth print-access-token) -n $INTEGATION_NAME -p $PROJECT_ID -r $REGION) | jq ".integrationVersions[0].snapshotNumber")
integrationcli integrations versions publish -t $(gcloud auth print-access-token) -n $INTEGATION_NAME -p $PROJECT_ID -r $REGION -s $SNAPSHOT --config-vars "$INTEGATION_NAME.config.local.json"
