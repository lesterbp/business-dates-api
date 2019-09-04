# business-dates-api
API to Calculate Business Dates

# requirements
- node.js v10

# setting up and starting the app

## dev/local environment
- create your `.env` file based on `.env.template` and fill up the necessary values
- `npm install`
- `npm run dev` will start the app

## production environment
- export the necessary system variables based on the `.env.template`
- `npm install --prod`
- `npm start`


# testing and linting
- `npm run linter` to run the linter (check code styles and search for errors)
- `npm test` to run unit tests
- `npm run integrationTest` to run integration test of subscribing and publishing functionality (only way to test PubSub functionality for now)
