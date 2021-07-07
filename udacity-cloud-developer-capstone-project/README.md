# Serverless Travel blogger Application

Serverless travel blog where a user can use this to write about his experiences on the trips taken.


as a travel list to keep track of the trip planning.

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
