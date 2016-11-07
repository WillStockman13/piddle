var API = require('account');

var appId = API.appId;
var password = API.password;
var fs = require('fs');
var outputPath = 'result.txt';//username

var ocrCall = function(imagePath, req, res) {
  var ocrsdkModule = require('./ocrsdk.js');
  var ocrsdk = ocrsdkModule.create(appId, password);
  ocrsdk.serverUrl = "http://cloud.ocrsdk.com"; // change to https for secure connection

  function downloadCompleted(error) {
    if (error) {
      console.log("Error: " + error.message);
      return;
    }
    console.log("Done.");

    fs.readFile('result.txt', function(err, data) {
      data = data.toString();
      var counter = data.indexOf('index')
      data = data.split('recognizedText>')
      data.shift();
      data.pop();
      data.pop();
      var newArray = [];
      var counter = 2;
      data.forEach(function(items) {
        if(counter % 2 === 0) {
          if(items.indexOf('[CDATA')) {
            items = items.split('[CDATA[');
            items.shift()
            items = items[0].split(']]></');
            items = items[0].split('\n');
            if (items[1]) {

              splitItems = items[1].split(' ');


              var price = '';
            
              splitItems.forEach(function(item) {
                var r = /^\$?[0-9]+\.[0-9][0-9]?$/;
         
                if (r.test(item)) {
      
                  price = item;
                }
              });

 
              items = items[1].split(price)

              var itemObj = {
                description: items[0],
                price: price
              };

              if (items[0].indexOf('**Sb8T0TIL') === -1) {
                newArray.push(itemObj);
              }
            }

          }
        }
        counter++
      })
      
      res.end(JSON.stringify(newArray));
    })
  }

  function processingCompleted(error, taskData) {
    if (error) {
      console.log("Error: " + error.message);
      return;
    }

    if (taskData.status != 'Completed') {
      console.log("Error processing the task.");
      if (taskData.error) {
        console.log("Message: " + taskData.error);
      }
      return;
    }

    console.log("Processing completed.");
    console.log("Downloading result to " + outputPath);

    ocrsdk
        .downloadResult(taskData.resultUrl.toString(), outputPath,
            downloadCompleted);
  }

  function uploadCompleted(error, taskData) {
    if (error) {
      console.log("Error: " + error.message);
      return;
    }

    console.log("Upload completed.");
    console.log("Task id = " + taskData.id + ", status is " + taskData.status);
    if (!ocrsdk.isTaskActive(taskData)) {
      console.log("Unexpected task status " + taskData.status);
      return;
    }

    ocrsdk.waitForCompletion(taskData.id, processingCompleted);
  }

  var settings = new ocrsdkModule.ProcessingSettings();
  settings.language = "English";
  settings.exportFormat = "txt"; 

  console.log("Uploading image..");
  ocrsdk.processImage(imagePath, settings, uploadCompleted);

} 

module.exports = ocrCall;
