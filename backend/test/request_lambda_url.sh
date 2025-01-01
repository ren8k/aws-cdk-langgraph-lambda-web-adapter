#!/bin/bash
LAMBDA_URL="https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXX.lambda-url.ap-northeast-1.on.aws/"
ENDPOINT="api/stream_graph"
API_URL="${LAMBDA_URL}${ENDPOINT}"
PRODUCT_DETAIL="ラベンダーとベルガモットのやさしい香りが特徴の保湿クリームで、ヒアルロン酸とシアバターの配合により、乾燥肌に潤いを与えます。価格は50g入りで3,800円（税込）です。"

curl -X 'POST' \
  "${API_URL}" \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d "{
  \"product_detail\": \"${PRODUCT_DETAIL}\"
}"
