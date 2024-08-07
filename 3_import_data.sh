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
                  "stringValue": "internal"
                },
                {
                  "stringValue": "external"
                },
                {
                  "stringValue": "partner"
                },
                {
                  "stringValue": "publisher"
                }
              ]
            },
          },
        }
      }
    }
  ]
}
EOF

arrIN=(${ADMIN_EMAIL//@/ })
curl -i -X POST "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents:batchWrite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @- << EOF

{
  "writes": [
    {
      "update": {
        "name": "projects/$PROJECT_ID/databases/(default)/documents/data-marketplace-users/$ADMIN_EMAIL",
        "fields": {
          "email": {
              "stringValue": "$ADMIN_EMAIL"
          },
          "firstName": {
              "stringValue": "Marketplace"
          },
          "lastName": {
              "stringValue": "Admin"
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
            },
          },
          "status": {
              "stringValue": "approved"
          },
          "userName": {
              "stringValue": "${arrIN[0]}"
          }
        }
      }
    }
  ]
}
EOF

curl -i -X POST "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents:batchWrite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @- << EOF

{
  "writes": [
    {
      "update": {
        "name": "projects/$PROJECT_ID/databases/(default)/documents/data-marketplace-config/product",
        "fields": {
          "id": {
              "stringValue": "product"
          },
          "categories": {
            "arrayValue": {
              "values": [
                {
                  "stringValue": "ESG - Environmental"
                },
                {
                  "stringValue": "ESG - Social"
                },
                {
                  "stringValue": "ESG - Governance"
                },
                {
                  "stringValue": "Investment - Research"
                },
                {
                  "stringValue": "Investment - Statistics"
                },
                {
                  "stringValue": "Investment - Management"
                },
                {
                  "stringValue": "Pre-IPO - Research"
                },
                {
                  "stringValue": "Pre-IPO - Statistics"
                },
                {
                  "stringValue": "Pre-IPO - Management"
                },
                {
                  "stringValue": "Listing - Research"
                },
                {
                  "stringValue": "Listing - Statistics"
                },
                {
                  "stringValue": "Listing - Management"
                },
                {
                  "stringValue": "Trading - Research"
                },
                {
                  "stringValue": "Trading - Statistics"
                },
                {
                  "stringValue": "Trading - Classes"
                }
              ]
            },
          },
        }
      }
    }
  ]
}
EOF