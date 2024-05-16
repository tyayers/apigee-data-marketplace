TOKEN=$(gcloud auth print-access-token)

curl -i -X POST "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents:batchWrite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @- << EOF

{
  "writes": [
    {
      "update": {
        "name": "projects/$PROJECT_ID/databases/(default)/documents/data-marketplace-slas/no_sla_5k3j",
        "fields": {
          "id": {
              "stringValue": "no_sla_5k3j"
          },
          "name": {
              "stringValue": "No SLA"
          },
          "description": {
              "stringValue": "No SLA guaranteed."
          },
          "upTimeInPercent": {
              "stringValue": ""
          },
          "maxLatencyMS": {
              "stringValue": ""
          }
        }
      }
    }
  ]
}
EOF