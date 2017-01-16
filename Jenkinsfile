node{
  stage 'Checkout'
  checkout scm
  stage 'Deploy to dev heroku'
  sh 'heroku config:set NPM_CONFIG_PRODUCTION=false -a dev-hansya-consumer-api'
  sh 'heroku config:set NODE_ENV=ci -a dev-hansya-consumer-api'
  sh 'heroku git:remote -a dev-hansya-consumer-api'
  sh 'git push heroku master'
  stage 'Turn off dyno instance'
  sh 'heroku ps:scale web=0 -a dev-hansya-consumer-api'
  stage 'Run CI tests on heroku'
  sh 'heroku run --exit-code "npm install && npm run test" -a dev-hansya-consumer-api'
  stage 'Deploy to Test'
  sh 'heroku git:remote -a test-hansya-consumer-api'
  sh 'heroku config:set NPM_CONFIG_PRODUCTION=false -a test-hansya-consumer-api'
  sh 'heroku config:set NODE_ENV=testing -a test-hansya-consumer-api'
  sh 'git push heroku master'
  sh 'heroku ps:scale web=1 -a test-hansya-consumer-api'
}
