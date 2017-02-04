/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  cors: {
    allRoutes: true,
    origin: '*',
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
    headers: 'content-type'
  },

  models: {
    connection: 'testDatabase',
    migrate: 'drop'
  },

  session: {
    connection: 'testRedis'
  },

  dashboard: "https://bucketeer-d89c87a6-7073-4603-bd65-7bdd75831a5b.s3.amazonaws.com/public"
};