#!/usr/bin/env bash
set -euo pipefail

# VNC stays inside the container. Compose publishes only the local browser viewer.
openbox &
x11vnc -forever -shared -localhost -rfbport 5900 &
websockify --web /usr/share/novnc 6080 127.0.0.1:5900 &

# Docker's default profile blocks the user namespaces WebKit's bubblewrap needs.
# Keep this override in the local dev container and load only your trusted app.
export WEBKIT_DISABLE_SANDBOX_THIS_IS_DANGEROUS=1
exec wails3 dev
