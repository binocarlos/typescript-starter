#!/bin/bash -e
#
# scripts to manage the postgres database
#

set -e

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "${DIR}/tools.sh"

function secret-manifest() {
  cat <<EOT
apiVersion: v1
kind: Secret
metadata:
  name: ${SECRETNAME}
  namespace: ${NAMESPACE}
type: Opaque
data:
EOT
  while read line
  do
    arr=(${line//=/ })
    local name=${arr[0]}
    local value=${arr[1]}
    local base64Value=$(echo -n ${value} | base64 | sed -z 's/\n//g')
    echo "  ${name}: ${base64Value}"
  done < "/dev/stdin"
}

cat "$DIR/../env.prod" | secret-manifest