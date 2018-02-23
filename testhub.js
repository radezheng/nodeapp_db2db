var EventHubClient = require('azure-event-hubs').Client;

var connectionString = process.env.hubconn;
var eventHubPath = 'hub01';

var client = EventHubClient.fromConnectionString(connectionString, eventHubPath);

var sendEvent = function (eventBody) {
  return function (sender) {
    
    for(var i=0; i<100; i++){
        msg = eventBody + i;
        console.log('Sending Event: ' + msg);
        sender.send(msg,'mypk2');
    }
        
    //client.close();
  };
};

client.open()
.then(function() {
    return client.createSender();
  })
  .then(sendEvent('foo'))
  .catch(printError);

  var printError = function (err) {
    console.error(err.message);
  };