TOKEN=$(gcloud auth print-access-token)

curl -i -X POST "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents:batchWrite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @- << EOF

{
  "writes": [
    {
      "update": {
        "name": "projects/$PROJECT_ID/databases/(default)/documents/data-marketplace-config/identity",
        "fields": {
          "id": {
              "stringValue": "identity"
          },
          "roles": {
            "arrayValue": {
              "values": [
                {
                  "stringValue": "admin"
                },
                {
                  "stringValue": "publisher"
                },
                {
                  "stringValue": "internal"
                },
                {
                  "stringValue": "external"
                },
                {
                  "stringValue": "partner"
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