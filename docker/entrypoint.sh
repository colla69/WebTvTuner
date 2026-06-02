#!/bin/sh
# Start the Node.js stream proxy in the background
node /opt/stream-proxy.mjs &

# Start nginx in the foreground
nginx -g 'daemon off;'
