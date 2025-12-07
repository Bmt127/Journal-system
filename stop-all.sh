#!/bin/bash

echo "Stopping ALL microservices..."

if [ ! -f pids.txt ]; then
    echo "No pids.txt file found. Nothing to stop."
    exit 0
fi

while read -r pid; do
    if kill -0 "$pid" 2>/dev/null; then
        echo "Killing PID $pid"
        kill "$pid"
    fi
done < pids.txt

rm pids.txt

echo "Done."
