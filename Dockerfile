FROM jcxldn/vips-docker:node12-alpine as builder


# Labels for automatic removal by deployStage
ARG BUILD_ID
LABEL stage=builder
LABEL build=$BUILD_ID

# Embed the current git commit in the runner image so that git is not required.
ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

WORKDIR /app

COPY package*.json ./

# Install build enviroment for sharp
RUN apk add --no-cache --virtual sharp-deps glib-dev fftw-dev build-base python3 \
	&& if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi \
	&& python3 -m ensurepip \
	#&& rm -r /usr/lib/python*/ensurepip \
	# Install pip3 virtualenv
	&& pip3 install --no-cache --upgrade pip virtualenv \
	&& python3 -m venv env \
	&& source env/bin/activate \
	# Virtualenv active, continue.
	&& pip3 install --no-cache --upgrade setuptools wheel \
	&& if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi \
	# Install vips dev dependencies again for sharp to compile against
	&& /add.deps \
	# Install npm dependencies, including sharp, which will compile here.
	&& npm install --production \
	# Exit virtualenv
	&& deactivate \
	# Cleaning up.
	&& rm -r /usr/lib/python*/ensurepip \
	&& pip3 uninstall -y pip virtualenv \
	&& apk del --purge sharp-deps \
	&& /del.deps

COPY . .

ENV NODE_ENV production

CMD ["node", "index.js"]