FROM jcxldn/vips-docker:node12-alpine as builder

# Labels for automatic removal by deployStage
ARG BUILD_ID
LABEL stage=builder
LABEL build=$BUILD_ID

RUN apk add --no-cache glib-dev fftw-dev build-base python3 && if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi && python3 -m ensurepip && rm -r /usr/lib/python*/ensurepip && pip3 install --no-cache --upgrade pip setuptools wheel && if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi

WORKDIR /app

COPY package*.json ./

RUN npm install --production

FROM jcxldn/vips-docker:node12-alpine as runner

# Embed the current git commit in the runner image so that git is not required.
ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

WORKDIR /app

COPY --from=builder /app/ ./

COPY . .

ENV NODE_ENV production

CMD ["node", "index.js"]
