cd ./apis/UsersAPI-v1
apigeecli apis create bundle -f apiproxy --name UsersAPI-v1 -o $PROJECT_ID -t $(gcloud auth print-access-token)
apigeecli apis deploy -n UsersAPI-v1 -o $PROJECT_ID -e $APIGEE_ENV -t $(gcloud auth print-access-token) -s "mpservice@$PROJECT_ID.iam.gserviceaccount.com" --ovr
cd ../..
