#!/bin/bash

# don't run directly - run via `npm run`

# set -e

MAX_PROCESS=10

log_dir=$(mktemp -d)

cd samples
echo "Forking runs for..."
pids=()
names=()
for d in */; do
    while [[ "$(jobs -pr | wc -l)" -ge "$MAX_PROCESS" ]]; do sleep 0.1; done
    base=$(basename "$d")
    echo "$d..."
    cd "$d"
    npm run build > "$log_dir/$base.log" 2>&1 &
    pids+=($!)
    names+=("$base")
    cd ..
done

echo "(logs at $log_dir)"
echo "..."

code=0
fails=0
for i in "${!pids[@]}"; do
    pid="${pids[$i]}"
    name="${names[$i]}"
    # echo "$name $pid"
    wait $pid
    status=$?
    # echo "$name exited with status $status"
    if [[ $status -ne 0 ]]; then
        echo
        echo "$name exited with status $status:"
        echo "---------------------"
        cat "$log_dir/$name.log"
        echo "---------------------"
        code=$status
        fails=$((fails + 1))
    fi
done

rm -rf "$log_dir"

echo
echo "Done with $fails failure(s)."
exit $code