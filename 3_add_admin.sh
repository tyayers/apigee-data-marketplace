# Call this script with the email address of the user to add as admin, for example: ./3_add_admin user@example.com

TOKEN=$(gcloud auth print-access-token)

curl -i -X POST "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents:batchWrite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @- << EOF

{
  "writes": [
    {
      "update": {
        "name": "projects/$PROJECT_ID/databases/(default)/documents/data-marketplace-users/$1",
        "fields": {
          "id": {
              "stringValue": "$1"
          },
          "roles": {
            "arrayValue": {
              "values": [
                {
                  "stringValue": "admin"
                },
                {
                  "stringValue": "internal"
                }
              ]
            }
          }
        }
      }
    }
  ]
}
EOF
