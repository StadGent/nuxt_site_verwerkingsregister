#!/bin/bash

set +e


echo "Running as user: $(oc whoami)"
echo ""
echo "Changing project to verwerkingsregisterpr"
oc project verwerkingsregisterpr

echo "Processing template and creating"
oc process -f openshift/verwerkingsregister-pr.yml | oc create -f - || true
NOT_CREATED=$?

if [ $NOT_CREATED ]; then
  echo "Resources already exist, replacing"
  oc process -f openshift/verwerkingsregister-pr.yml | oc replace -f - || true
  oc rollout latest dc/verwerkingsregister || true
fi
echo "Done."