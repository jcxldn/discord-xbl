FROM jcxldn/vips-docker:node12-alpine as builder

# Labels for automatic removal by deployStage
ARG BUILD_ID
LABEL stage=builder
LABEL build=$BUILD_ID

# haha fixes which should be in the base exported container oops lol
#RUN apk add glib-dev cairo librsvg && export PATH=/lib/vips/bin:$PATH
RUN cp -rl /lib/vips/* /usr/ && apk add glib-dev librsvg-dev librsvg cairo libpng

# Install 'glib-dev libpng-dev libjpeg-turbo-dev giflib-dev librsvg-dev', https://github.com/lovell/sharp/issues/838#issuecomment-306494787
RUN apk add --no-cache glib-dev fftw-dev build-base python3 && if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi && python3 -m ensurepip && rm -r /usr/lib/python*/ensurepip && pip3 install --no-cache --upgrade pip setuptools wheel && if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi

WORKDIR /app

COPY package*.json ./

RUN npm install --production

FROM jcxldn/vips-docker:node12-alpine as runner

# Embed the current git commit in the runner image so that git is not required.
ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

# Install libvips (runtime) for sharp - sharp was built in the previous stage but will still need the runtime to start up.
#RUN apk add --no-cache vips


# haha fixes which should be in the base exported container oops lol
#RUN apk add glib-dev cairo librsvg && export PATH=/lib/vips/bin:$PATH
RUN cp -rl /lib/vips/* /usr/ && apk add glib-dev librsvg-dev librsvg cairo libpng

WORKDIR /app

COPY --from=builder /app/ ./

COPY . .

ENV NODE_ENV production

CMD ["node", "index.js"]
