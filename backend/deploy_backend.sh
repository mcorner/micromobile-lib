#!/bin/bash

FUNCTIONS=( experimentFileResultsHandler )
DIR=$( readlink -f $( readlink "${BASH_SOURCE[0]}" ) )

DEPLOY_DIR=$DIR/../temp_deploy
DEPLOY_FILE_NAME=lambda-deploy.zip
DEPLOY_FILE=$DIR/../$DEPLOY_FILE_NAME
LAMBDA_FILES=$DIR/backend/*
NODE_FILES=$DIR/../node_modules

# Reuse the json config for the deploy
cat $1 |$DIR/to_env.js >$DIR/env.sh
. $DIR/env.sh

#Make zip
rm -rf $DEPLOY_DIR $DEPLOY_FILE
mkdir $DEPLOY_DIR
cd $DEPLOY_DIR
cp -r $LAMBDA_FILES .
cp -r $NODE_FILES .
zip -q -r $DEPLOY_FILE *;
cd ..
rm -rf $DEPLOY_DIR

# Upload to s3
aws --profile $aws_profile s3 cp $DEPLOY_FILE s3://$backend_bucket/$DEPLOY_FILE_NAME

for var in $FUNCTIONS
do
  echo "${var}"
  aws --profile $aws_profile lambda get-function --function-name $var
  rc=$?
  if [[ $rc != 0 ]]; then
    aws --profile $aws_profile lambda create-function --function-name $var --runtime nodejs6.10 --role $LAMBDA_ROLE_ARN --handler index.$var --code S3Bucket=$backend_bucket,S3Key=$DEPLOY_FILE_NAME --timeout 10 --memory-size 128
  else
    aws --profile $aws_profile lambda update-function-code --function-name $var --s3-bucket $backend_bucket --s3-key $DEPLOY_FILE_NAME
  fi
done
