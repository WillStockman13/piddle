var http = require("http");
var https = require("https");
var url = require("url");
var sys = require("sys");
var events = require("events");
var fs = require('fs');

var xml2js = require('xml2js');;

exports.create = function(applicationId, password) {
  return new ocrsdk(applicationId, password);
}

exports.ProcessingSettings = ProcessingSettings;

function ocrsdk(applicationId, password) {
  this.appId = applicationId;
  this.password = password;

  this.serverUrl = "http://cloud.ocrsdk.com"; // You can change it to
                        // https://cloud.ocrsdk.com if
                        // you need secure channel
}


function ProcessingSettings() {

  this.country = 'usa';

  this.imageSource = 'auto';

  this.correctOrientation = 'true';

  this.correctSkew = 'true';

}

ocrsdk.prototype.processImage = function(filePath, settings, userCallback) {

  // if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
  //   userCallback(new Error("file " + filePath + " doesn't exist"), null);
  //   return;
  // }

  if (settings == null) {
    settings = new ProcessingSettings();
  }

  var req = this._createTaskRequest('POST', '/processReceipt',
      userCallback);

  var fileContents = fs.readFileSync(filePath);
  req.write(fileContents);
  req.end();
}

ocrsdk.prototype.getTaskStatus = function(taskId, userCallback) {
  var req = this._createTaskRequest('GET', '/getTaskStatus?taskId=' + taskId,
      userCallback);
  req.end();
}

ocrsdk.prototype.isTaskActive = function(taskData) {
  if (taskData.status == 'Queued' || taskData.status == 'InProgress') {
    return true;
  }
  return false;
}

ocrsdk.prototype.waitForCompletion = function(taskId, userCallback) {

  if (taskId.indexOf('00000000') > -1) {
    // A null Guid passed here usually means a logical error in the calling code
    userCallback(new Error('Null id passed'), null);
    return;
  }
  var recognizer = this;
  var waitTimeout = 5000;

  function waitFunction() {
    recognizer.getTaskStatus(taskId,
      function(error, taskData) {
        if (error) {
          userCallback(error, null);
          return;
        }

        console.log("Task status is " + taskData.status);

        if (recognizer.isTaskActive(taskData)) {
          setTimeout(waitFunction, waitTimeout);
        } else {

          userCallback(null, taskData);
        }
      });
  }
  setTimeout(waitFunction, waitTimeout);
}

ocrsdk.prototype.downloadResult = function(resultUrl, outputFilePath,
    userCallback) {
  var file = fs.createWriteStream(outputFilePath);

  var parsed = url.parse(resultUrl);

  var req = https.request(parsed, function(response) {
    response.on('data', function(data) {
      file.write(data);
    });

    response.on('end', function() {
      file.end();
      userCallback(null);
    });
  });

  req.on('error', function(error) {
    userCallback(error);
  });

  req.end();

}

ocrsdk.prototype._createTaskRequest = function(method, urlPath,
    taskDataCallback) {

  function parseXmlResponse(data) {
    var response = null;

    var parser = new xml2js.Parser({
      explicitCharKey : false,
      trim : true,
      explicitRoot : true,
      mergeAttrs : true
    });
    parser.parseString(data, function(err, objResult) {
      if (err) {
        taskDataCallback(err, null);
        return;
      }

      response = objResult;
    });

    if (response == null) {
      return;
    }

    if (response.response == null || response.response.task == null
        || response.response.task[0] == null) {
      if (response.error != null) {
        taskDataCallback(new Error(response.error.message[0]['_']), null);
      } else {
        taskDataCallback(new Error("Unknown server response"), null);
      }

      return;
    }

    var task = response.response.task[0];

    taskDataCallback(null, task);
  }

  function getServerResponse(res) {
    res.setEncoding('utf8');
    res.on('data', parseXmlResponse);
  }

  var requestOptions = url.parse(this.serverUrl + urlPath);
  requestOptions.auth = this.appId + ":" + this.password;
  requestOptions.method = method;
  requestOptions.headers = {
    'User-Agent' : "node.js client library"
  };

  var req = null;
  if (requestOptions.protocol == 'http:') {
    req = http.request(requestOptions, getServerResponse);
  } else {
    req = https.request(requestOptions, getServerResponse);
  }

  req.on('error', function(e) {
    taskDataCallback(e, null);
  });

  return req;
}


