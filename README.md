# Installation
Make sure you have bower, grunt and grunt-cli installed before beginning.

## Install dependencies
`brew install wget` (if you don't already have wget installed)
`npm install` (to get dependencies)
`bower install` (to get requirejs)
`bundle install` (to get the sass gem for development)

## To begin
Run `grunt` (see below if this is a brand new project for how to get rizzo)

Grunt will watch your javascript, sass, images, and hbs (handlebars) files for changes and rebuild the necessary pieces from /src to /dist.

Add livereload to your browser for no-refresh devving. mmmm.

Don't forget to change the production and staging urls of your assemble tasks.

## To update/bump rizzo (or for first-time initiation of a project)
Run `grunt rizzo`. This will first go and wget the latest partials from the live version of rizzo, then it will update the rizzo gem.

## Setup
Also, if you're creating a new static site, be sure to follow the steps for [setting up a static site](https://lonelyplanet.atlassian.net/wiki/pages/viewpage.action?pageId=30834739). It will walk you through correctly setting up your git repo and jenkins jobs.

## Staging
Pushing to the staging branch will kick off a staging build. Jenkins looks for the staging environment variable and runs `grunt staging`.

## Production
Pushing to the master branch will kick off a production build. Jenkins looks for the production environment variable and runs `grunt build`.
