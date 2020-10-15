#!/bin/bash -e
#
# download the psql dump of the production database
# inject it into the locally running docker-compose

set -e

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "${DIR}/tools.sh"

password=$(secret-list "$NAMESPACE" "POSTGRES_PASSWORD")
PGPASSWORD="${password}" connect "pg_dump --clean --username $NAMESPACE --dbname $NAMESPACE"