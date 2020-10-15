#!/bin/bash -e
#
# download the psql dump of the production database
# inject it into the locally running docker-compose

set -e

export NAMESPACE=${NAMESPACE:="typescript-starter"}
export SECRETNAME="appsecrets"

# get the id of a pod in a namespace using the app label
function pod() {
  local namespace="${1}"
  if [ -z "${namespace}" ]; then
    echo >&2 "namespace required"
    exit 1
  fi
  local app="${2}"
  if [ -z "${app}" ]; then
    echo >&2 "app required"
    exit 1
  fi
  kubectl get po -n ${namespace}  -l "app=${app}" -o jsonpath="{.items[0].metadata.name}"
}

function secret-list() {
  local namespace="${1}"
  local propname="${2}"
  local filter=''
  if [ -z "${namespace}" ]; then
    echo >&2 "namespace required"
    exit 1
  fi
  if [ -n "${propname}" ]; then
    kubectl get secret -n ${namespace} ${SECRET_NAME} -o json | jq -r ".data.${propname}" | base64 --decode
  else
    while IFS= read -r line; do
      arr=(${line// / })
      local name=${arr[0]}
      local value=${arr[1]}
      if [ -z "${value}" ]; then
        echo "${name}="
      else
        local base64Value=$(echo -n ${value} | base64 --decode)
        echo "${name}=${base64Value}"
      fi
    done < <(kubectl get secret -n ${namespace} ${SECRET_NAME} -o json | jq -r '.data' | grep ':' | sed 's/[\",:]//g')
  fi
}

function connect() {
  local args=''
  local beforecommand=''
  if [ -z "${PGPASSWORD}" ]; then
    echo >&2 "PGPASSWORD required"
    exit 1
  fi
  if [ -t 0 ]; then
    args=' -t'
  else
    beforecommand=' cat | '
  fi
  POD_NAME=$(pod postgres postgres)
  kubectl exec --namespace postgres -i ${args} $POD_NAME -- sh -c "export PGPASSWORD=${PGPASSWORD} && ${beforecommand} ${@}"
}
