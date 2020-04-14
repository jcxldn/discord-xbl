FROM node:10-alpine as builder

# Labels for automatic removal by deployStage
ARG BUILD_ID
LABEL stage=builder
LABEL build=$BUILD_ID

# Install 'glib-dev libpng-dev libjpeg-turbo-dev giflib-dev librsvg-dev', https://github.com/lovell/sharp/issues/838#issuecomment-306494787
RUN apk add --no-cache vips-dev fftw-dev build-base python3 glib-dev libpng-dev libjpeg-turbo-dev giflib-dev librsvg-dev && if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi && python3 -m ensurepip && rm -r /usr/lib/python*/ensurepip && pip3 install --no-cache --upgrade pip setuptools wheel && if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi

WORKDIR /app

COPY package*.json ./

RUN npm install --production

FROM node:10-alpine as runner

# Embed the current git commit in the runner image so that git is not required.
ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

# Install libvips (runtime) for sharp - sharp was built in the previous stage but will still need the runtime to start up.
RUN apk add --no-cache vips

WORKDIR /app

COPY --from=builder /app/ ./

COPY . .

ENV NODE_ENV production

CMD ["node", "index.js"]
