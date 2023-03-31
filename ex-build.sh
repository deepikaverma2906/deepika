DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
npm run build

export ECR_LOC=bitvividtac
export ECR_REPO=itms
# export ECR_REPO=bitvivid-itms-logs-dispatcher
export LOCAL_BUILD_NAME=bitvivid-itms-api-dashboard # to be changed
export LOCAL_BUILD_VER=0.26 # can be changed

export PROD_BUILD_NAME=bitvivid-itms-api-dashboard # to be changed
export PROD_BUILD_VER=0.26 # can be changed

echo "dckr_pat_pWlLa4Iq9xgtZCc8s_AgHfxy5BA" | docker login -u bitvividtac --password-stdin # for Docker Hub
# aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_LOC   # for AWS use this
docker build ${DIR} -f Dockerfile -t $LOCAL_BUILD_NAME:$LOCAL_BUILD_VER
docker tag $LOCAL_BUILD_NAME:$LOCAL_BUILD_VER   $ECR_LOC/$ECR_REPO:$PROD_BUILD_NAME-$PROD_BUILD_VER
docker push $ECR_LOC/$ECR_REPO:$PROD_BUILD_NAME-$PROD_BUILD_VER
echo $ECR_LOC/$ECR_REPO:$PROD_BUILD_NAME-$PROD_BUILD_VER