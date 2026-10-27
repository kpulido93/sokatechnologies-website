#!/usr/bin/env bash
set -euo pipefail

UUID_V4_RE='^[[:xdigit:]]{8}-[[:xdigit:]]{4}-4[[:xdigit:]]{3}-[89aAbB][[:xdigit:]]{3}-[[:xdigit:]]{12}$'
VALID_UUID='550e8400-e29b-41d4-a716-446655440000'

if [[ ! "$VALID_UUID" =~ $UUID_V4_RE ]]; then
  echo "valid UUID v4 was rejected" >&2
  exit 1
fi

for candidate in \
  "" \
  "aa' OR 1=1 --" \
  " $VALID_UUID" \
  "$VALID_UUID " \
  "550e8400-e29b-11d4-a716-446655440000" \
  "550e8400-e29b-41d4-0716-446655440000" \
  "not-a-uuid"; do
  if [[ "$candidate" =~ $UUID_V4_RE ]]; then
    echo "invalid request_id was accepted: $candidate" >&2
    exit 1
  fi
done

echo "request-id-validation: PASS"
