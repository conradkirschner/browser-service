FROM node:14.0
# Add Webdriver Manager

# Contributors
LABEL author="Vincent Voyer <vincent@zeroload.net>"
LABEL maintainers="Serban Ghita <serbanghita@gmail.com>, David Catalan <catalan.david@gmail.com>"


# Env variables
ENV LC_ALL=C
ENV DISPLAY=:99
ENV SELENIUM_CONSOLE_URL=http://localhost:4444/wd/hub
ENV SCREEN_GEOMETRY=1024x768x16


# Expose Selenium web console port
EXPOSE 4444


# Update packages
RUN apt-get -qqy update


# Install commons
RUN apt-get -qqy install \
    apt-transport-https \
    ca-certificates \
    curl \
    jq \
    software-properties-common \
    sudo \
    openjdk-8-jre-headless \
    wget \
    xvfb \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-scalable \
    xfonts-cyrillic


# Install Browser from vendor source
# Strategies copied from official Selenium Docker images (https://github.com/SeleniumHQ/docker-selenium)

## Install latest Firefox
ARG FIREFOX_VERSION=latest
RUN FIREFOX_DOWNLOAD_URL="https://download.mozilla.org/?product=firefox-latest&os=linux64&lang=de" \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
  && wget --no-verbose -O /tmp/firefox.tar.bz2 $FIREFOX_DOWNLOAD_URL \
  && rm -rf /opt/firefox \
  && tar -C /opt -xjf /tmp/firefox.tar.bz2 \
  && rm /tmp/firefox.tar.bz2 \
  && mv /opt/firefox /opt/firefox-$FIREFOX_VERSION \
  && ln -fs /opt/firefox-$FIREFOX_VERSION/firefox /usr/bin/firefox

## Install latest Google Chrome
ARG CHROME_VERSION="google-chrome-stable"
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update -qqy \
  && apt-get -qqy install \
    ${CHROME_VERSION:-google-chrome-stable} \
  && rm /etc/apt/sources.list.d/google-chrome.list \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

## Chrome Launch Script Wrapper (forces no-sandbox so no need to use --privileged parameter)
COPY ./scripts/wrap_chrome_binary /opt/bin/wrap_chrome_binary
RUN /opt/bin/wrap_chrome_binary


# Install Node.js LTS
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get -qqy install -y nodejs

# Add non-root user
RUN useradd 1000 \
         --shell /bin/bash  \
         --create-home \
  && usermod -a -G sudo 1000 \
  && echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers \
  && echo '1000:secret' | chpasswd


# Install selenium-standalone
ARG DEBUG
RUN npm install -g selenium-standalone
RUN selenium-standalone install


ADD ./scripts/ /home/1000/scripts


# Add Tini for graceful shutdown
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]


# Force using non root user to execute the image
USER 1000


# Display Selenium environment
RUN . /home/1000/scripts/utils.sh && print_selenium_env


# Selenium server healthcheck
HEALTHCHECK --start-period=5s --interval=3s --retries=8 \
    CMD curl -qsf "$SELENIUM_CONSOLE_URL/status" | jq -r '.value.ready' | grep "true" || exit 1


# Run our start script under Tini
CMD ["/home/1000/scripts/start.sh"]

# Add Application
USER 0
# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

RUN npm ci

RUN npx webdriver-manager clean && npx webdriver-manager update
# If you are building your code for production
# RUN npm ci --only=production

COPY . .
ENV INSTALL_DRIVER=true
RUN  ["sh", "-c", "exec node -r esm index.js" ]
ENV INSTALL_DRIVER=false
RUN chown -R 1000:1000 /usr/src/app
USER 1000

ENV LOADBALANCER_HOST=localhost
ENV LOADBALANCER_PORT=3001
EXPOSE 3001
CMD ["sh", "-c", "exec node -r esm index.js" ]
