FROM worklog-api-loopback:latest
WORKDIR /worklog-api
COPY ./ ./
RUN mv 'server/datasources.local-deploy.js' 'server/datasources.local.js' &&\
  npm install 
