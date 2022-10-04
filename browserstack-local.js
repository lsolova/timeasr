/* eslint-disable */
const nightwatch = require('nightwatch');
const browserstack = require('browserstack-local');
let bs_local;

// Creates an instance of Local
nightwatch.bs_local = bs_local = new browserstack.Local();

// You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
// Set the access key and starts local
bs_local.start({'key': process.env.BROWSERSTACK_ACCESS_KEY}, function() {
  console.log('Started BrowserStackLocal');
  console.log('BrowserStackLocal running:', bs_local.isRunning());
  // Your test code goes here, from creating the driver instance till the end, i.e. bs_local.stop

  let interval = setInterval(() => {
    const isRunning = bs_local.isRunning();
    if (!isRunning) {
      clearInterval(interval);
      console.log('Stopped BrowserStackLocal');
    }
  }, 1000);

  // bs_local.stop(function() {
  // });
});
