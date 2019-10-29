#!/bin/bash

set -e


echo "Running as user: $(oc whoami)"
echo ""
echo "Changing project to verwerkingsregisterdv"
oc project verwerkingsregisterdv

echo "Importing nodejs S2I image"
oc import-image registry.access.redhat.com/rhscl/nodejs-8-rhel7:latest --confirm || true

echo "Processing template and creating"
oc process -f openshift/verwerkingsregister-dv.yml | oc create -f - || true
NOT_CREATED=$?

if [ $NOT_CREATED ]; then
  echo "Resources already exist, replacing"
  oc process -f openshift/verwerkingsregister-dv.yml | oc replace -f - || true
  echo "Starting builds"
  oc start-build verwerkingsregister
fi
echo "Done."