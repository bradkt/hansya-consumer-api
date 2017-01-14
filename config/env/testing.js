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

  models: {
    connection: 'test',
    migrate: 'drop'
  },

  session: {
    adapter: 'redis',
    host: 'redis-10074.c10.us-east-1-2.ec2.cloud.redislabs.com',
    port: 10074,
    ttl: 300,
    db: 0,
    pass: 'Password1',
    prefix: 'sess:'
  }

};