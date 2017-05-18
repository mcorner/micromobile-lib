#!/bin/bash

FUNCTIONS=( experimentFileResultsHandler )
DIR=$( dirname $( greadlink -f "${BASH_SOURCE[0]}" ) )

DEPLOY_DIR=$DIR/../temp_deploy
DEPLOY_FILE_NAME=lambda-deploy.zip
DEPLOY_FILE=$DIR/../$DEPLOY_FILE_NAME
LAMBDA_FILES=$DIR/*.js
NODE_FILES=$DIR/../package.json
CONFIG_FILE=./config.json

if [ "$#" -ne 1 ]
then
  echo "ERROR: Supply config.json"
  exit 1
fi

# Reuse the json config for the deploy
cat $1 |$DIR/to_env.js >$DIR/env.sh
. $DIR/env.sh

#Make zip
rm -rf $DEPLOY_DIR $DEPLOY_FILE
mkdir $DEPLOY_DIR
cp $CONFIG_FILE $DEPLOY_DIR
cd $DEPLOY_DIR
cp -r $LAMBDA_FILES .
cp -r $NODE_FILES .
npm install
zip -q -r $DEPLOY_FILE *;
cd ..
rm -rf $DEPLOY_DIR

# Upload to s3
aws --profile $awsProfile s3 cp $DEPLOY_FILE s3://$backendBucket/$DEPLOY_FILE_NAME

for var in $FUNCTIONS
do
  echo "${var}"
  aws --profile $awsProfile lambda get-function --function-name $var
  rc=$?
  if [[ $rc != 0 ]]; then
    echo "Didn't find function...creating it."
    aws --profile $awsProfile lambda create-function --function-name $var --runtime nodejs6.10 --role $lambdaRoleArn --handler index.$var --code S3Bucket=$backendBucket,S3Key=$DEPLOY_FILE_NAME --timeout 10 --memory-size 128
  else
    aws --profile $awsProfile lambda update-function-code --function-name $var --s3-bucket $backendPucket --s3-key $DEPLOY_FILE_NAME
  fi
done
