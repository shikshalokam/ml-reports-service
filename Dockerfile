FROM node:12

WORKDIR /usr/src/app

#copy package.json file
COPY package.json ./

#install fonts
RUN apt update && apt install fonts-indic -y \
    && fc-cache -f 

#install node packges
RUN npm install

#copy all files 
COPY . .

#expose the application port
EXPOSE 3003

#start the application
CMD node app.js