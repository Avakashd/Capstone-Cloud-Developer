# Serverless Travel blogger Application

Serverless travel blog where a user can use this to write about his experiences on the trips taken.
It’s the home for the adventure stories. The ups, the downs and everything between. One can share photos and stories from the places they visit and the cultures explored. User can post tip’s & tricks to help travel better and/or cheaper.

Backend
To build and deploy the application, first edit the backend/serverless.yml file to set the appropriate AWS and Auth0 parameters, then run the following commands:

cd to the backend folder: cd backend
Install dependencies: npm install
Build and deploy to AWS: sls deploy -v
Frontend
To run the client application, first edit the client/src/config.ts file to set the appropriate AWS and Auth0 parameters, then run the following commands:

cd to the client folder: cd client
Install dependencies: npm install
Run the client application: npm run start
This should start a development server with the React application that will interact with the serverless TODO application.

![image](https://user-images.githubusercontent.com/63589180/124769854-73a0d100-df57-11eb-861b-a369c17c72b3.png)
