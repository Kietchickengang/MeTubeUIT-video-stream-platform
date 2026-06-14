#!/bin/bash

echo "[+] Cleaning before starting..."

powershell -Command "Get-NetTCPConnection -LocalPort 8000, 8001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id \$_ -Force }" 2>/dev/null

sleep 2

echo "[+] Starting servers ..."

npm run start --prefix ./api_server &
npm run start --prefix ./frontend/Metube-UI &
npm run start --prefix ./worker_server &

echo "[+] Servers are working"
wait