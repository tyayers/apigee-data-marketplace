# This script copies the environment variables file to a local version, and generates a random storage name
cp 1_env.sh 1_env.local.sh
RANDOM_SUFFIX=$(head /dev/urandom | tr -dc a-z0-9 | head -c5)
sed -i "/export BUCKET_NAME=marketplace-/c\export BUCKET_NAME=marketplace-$RANDOM_SUFFIX" 1_env.local.sh