#!/bin/bash

echo What should the version be?
read VERSION
echo $VERSION

docker build -t binhthaitrinh/talaria:$VERSION .
docker push binhthaitrinh/talaria:$VERSION
ssh -i ~/.ssh/dell-xps.pem ubuntu@3.19.218.243 "sudo docker pull binhthaitrinh/talaria:$VERSION && sudo docker tag binhthaitrinh/talaria:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"
