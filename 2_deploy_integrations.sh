gcloud config set project $PROJECT_ID
TOKEN=$(gcloud auth print-access-token)

INTEGATION_NAME=MP-UsersFirestore
cp ./integrations/$INTEGATION_NAME.json ./integrations/$INTEGATION_NAME.local.json
sed -i "s/example-project/$PROJECT_ID/g" ./integrations/$INTEGATION_NAME.local.json
curl -X POST "https://integrations.googleapis.com/v1/projects/$PROJECT_ID/locations/$REGION/integrations/$INTEGATION_NAME/versions" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data-binary @./integrations/$INTEGATION_NAME.local.json

integrationcli integrations versions publish -t $TOKEN -n $INTEGATION_NAME -p $PROJECT_ID -r $REGION -s 1

INTEGATION_NAME=MP-UsersRoles
cp ./integrations/$INTEGATION_NAME.json ./integrations/$INTEGATION_NAME.local.json
sed -i "s/example-project/$PROJECT_ID/g" ./integrations/$INTEGATION_NAME.local.json
curl -X POST "https://integrations.googleapis.com/v1/projects/$PROJECT_ID/locations/$REGION/integrations/$INTEGATION_NAME/versions" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data-binary @./integrations/$INTEGATION_NAME.local.json

integrationcli integrations versions publish -t $TOKEN -n $INTEGATION_NAME -p $PROJECT_ID -r $REGION -s 1


INTEGATION_NAME=MP-Users
# Make a copy and replace variables
cp ./integrations/$INTEGATION_NAME.json ./integrations/$INTEGATION_NAME.local.json
sed -i "s/example-project/$PROJECT_ID/g" ./integrations/$INTEGATION_NAME.local.json
sed -i "s/approver@example.com/$ADMIN_EMAIL/g" ./integrations/$INTEGATION_NAME.local.json
sed -i "s/"example.com"/$INTERNAL_DOMAIN/g" ./integrations/$INTEGATION_NAME.local.json

curl -X POST "https://integrations.googleapis.com/v1/projects/$PROJECT_ID/locations/$REGION/integrations/$INTEGATION_NAME/versions" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data-binary @./integrations/$INTEGATION_NAME.local.json

integrationcli integrations versions publish -t $TOKEN -n $INTEGATION_NAME -p $PROJECT_ID -r $REGION -s 1
