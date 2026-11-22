FROM node:26-trixie-slim AS node
FROM golang:1.26.11-trixie AS toolchain

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/npm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential ca-certificates dbus-x11 fonts-dejavu-core libgtk-4-dev \
        libwebkitgtk-6.0-dev nsis novnc openbox pkg-config websockify x11vnc xauth xvfb \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && npm install --global pnpm@11.25.0 \
    && go install github.com/wailsapp/wails/v3/cmd/wails3@v3.1.0

ARG LOCAL_UID=1000
ARG LOCAL_GID=1000
RUN groupadd --gid "${LOCAL_GID}" developer \
    && useradd --uid "${LOCAL_UID}" --gid "${LOCAL_GID}" --create-home developer \
    && mkdir -p /workspace/frontend/node_modules /home/developer/go/pkg/mod \
    && install -d -o developer -g developer /home/developer/.cache/go-build /home/developer/.cache/pnpm \
    && chown -R developer:developer /workspace /home/developer

# The checksum database writes under GOPATH, outside GOMODCACHE.
ENV GOPATH=/home/developer/go \
    GOCACHE=/home/developer/.cache/go-build \
    GOMODCACHE=/home/developer/go/pkg/mod \
    PNPM_HOME=/home/developer/.cache/pnpm

USER developer
WORKDIR /workspace
