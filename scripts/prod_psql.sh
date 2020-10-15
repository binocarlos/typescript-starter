#!/bin/bash -e

set -e

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "${DIR}/tools.sh"

password=$(secret-list "$NAMESPACE" "POSTGRES_PASSWORD")
PGPASSWORD="${password}" connect "psql --username $NAMESPACE --dbname $NAMESPACE $@"
