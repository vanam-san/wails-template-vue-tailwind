FROM node:26-trixie-slim AS node
FROM oven/bun:1.4.5 AS bun
FROM golang:1.26.11-trixie AS toolchain

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
RUN ln -s bun /usr/local/bin/bunx

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential ca-certificates dbus-x11 fonts-dejavu-core libgtk-4-dev \
        libwebkitgtk-6.0-dev nsis novnc openbox pkg-config websockify x11vnc xauth xvfb \
    && rm -rf /var/lib/apt/lists/*

RUN go install github.com/wailsapp/wails/v3/cmd/wails3@v3.1.0

ARG LOCAL_UID=1000
ARG LOCAL_GID=1000
RUN groupadd --gid "${LOCAL_GID}" developer \
    && useradd --uid "${LOCAL_UID}" --gid "${LOCAL_GID}" --create-home developer \
    && mkdir -p /workspace/frontend/node_modules /home/developer/go/pkg/mod \
    && install -d -o developer -g developer /home/developer/.cache/go-build /home/developer/.cache/bun \
    && chown -R developer:developer /workspace /home/developer

# The checksum database writes under GOPATH, outside GOMODCACHE.
ENV GOPATH=/home/developer/go \
    GOCACHE=/home/developer/.cache/go-build \
    GOMODCACHE=/home/developer/go/pkg/mod \
    BUN_INSTALL_CACHE_DIR=/home/developer/.cache/bun

USER developer
WORKDIR /workspace
