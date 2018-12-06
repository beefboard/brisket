# Brisket

> Web frontend for beefboard

## About

Developed in `Nuxt.js` brisket aims to be a fast and interactive frontend for beefboard.

It employs server-side rendering, with means the first page paint is faster than using
any client side rendered framework.

## Developing

`npm install` to install packages.

### Running

`npm run dev` can be used to run the server in development mode. By default
`https://api.beefboard.mooo.com` is used as the API server. But this can be
set with `export API_URL=xxx`

### Unit testing

`npm test` will run extensive unit test suite, which tests functionality
of all pages and components.

### Acceptence testing

`npm run acceptence` ensures that the application runs and provides basic functionality.
It is more of a sanity test, as unit tests cover all core functionality

Acceptence tests can only be run on a production server. To build a production server
run `npm run build`
