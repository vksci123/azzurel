FROM nodesource/jessie:5.3.0

ENV NODE_PATH /usr/lib/node_modules/

COPY . /app 
WORKDIR /app 
ENTRYPOINT ["npm", "start"]
