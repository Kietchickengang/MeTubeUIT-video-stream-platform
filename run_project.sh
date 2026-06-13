#!/bin/bash

echo "[+] Starting servers ..."

npm run start --prefix ./api_server &

npm run start --prefix ./frontend/Metube-UI &

npm run start --prefix ./worker_server &

echo "[+] Servers are working"

wait