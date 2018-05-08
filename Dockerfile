FROM node:8
COPY --chown=node:node ./ /home/node/app/
WORKDIR /home/node/app
ENV PATH="$PATH:/home/node/app/node_modules/.bin"

USER node
RUN cp .env.local .env  && \
    yarn && \
    yarn add bower && \
    yarn add grunt && \
    bower install && \
    grunt modernizr:dist

CMD ["ember", "serve", "--proxy", "http://localhost:8080"]
