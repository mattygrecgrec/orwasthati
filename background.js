
//show the StratoQ printer in the list when the user tries to print something
chrome.printerProvider.onGetPrintersRequested.addListener(
  function ( resultCallback ) {
    resultCallback( [{
      id: 'stratoqmyprints', // printer address
      name: 'StratoQ',
    }] );
  }
);


//Define the options for the StratoQ printer when it is selected
chrome.printerProvider.onGetCapabilityRequested.addListener((pid, callback) => {
  callback({
    "version": '1',
    "printer": {
      "supported_content_type": [{"content_type": "application/pdf"}],
      "color": {
        "option": [
          {"type": "STANDARD_MONOCHROME"},
          {"type": "STANDARD_COLOR", "is_default": true},
          {
            "vendor_id": "ultra-color",
            "type": "CUSTOM_COLOR",
            "custom_display_name": "Best Color"
          }
        ]
      },
    }
  });
});


const checkStorage = (localStorage) => {
  if (localStorage.sqToken === undefined) {
    alert('You need to register your account using the extension before you can print!')
    throw Error('no local token for user');
  }
  else return localStorage;
}



// This checks for the HTTP
const handleHTTPStatus = (response, context) => {
  if (!response.ok) {
    alert('Oops, something went wrong '+ context+'.  You may need to re-register your account again using the extension.   ERROR:  ' + response.statusText);
    throw Error(response.statusText);
  }
  return response;
}



// Step 1: Get the pre-signed url etc from stratoq
const getUploadTarget = (storageStuff , printJob) => {
  const params = new URLSearchParams();
  params.append('file_name', printJob.title);

  const headers = {
    'Authorization': 'Bearer ' + storageStuff.sqToken,
    'x-stratoq-client-version': 'chrome-extension-0.0.1'
  }

  // We need to do a post, and to pass the JWT in the Authorization header,
  // so setup the options we will pass to fetch():
  const fetchOptions = {
    headers: headers,
    method: 'POST',
    mode: 'same-origin',
    body: params
  }


  // We now invoke fetch(), which returns our promise.
  //  return
  return fetch(storageStuff.sqServer + '/api/my_prints/v1/upload_target', fetchOptions)
    .catch((error) => {
      alert('Could not connect to StratoQ.com.  Check your network connection and try again')
      throw error('Could not connect to StratoQ.com.  Check your network connection and try again')
    })
}


// Step 2:
//
// This is called with the JSON info needed to upload the data to AWS This
// prepares the arguments to fetch(), then invokes fetch() to do the
// upload.  fetch() returns yet another promise, and so we return that so
// we can then chain on it.
const performUploadToAWS = (awsInfo, printJob) => {
  // Extract params we want from json
  const {data: {method: method, url: awsUrl}} = awsInfo;
  const fileSize = printJob.document.size

    
  // Create a stream to suck up the file bytes
  const fetchUploadOpts = {
    method: method,
    headers: { "Content-Length": fileSize },
    body: printJob.document
  }
  // Return a new promise that we will get a success/failure from the upload to aws
  return fetch(awsUrl, fetchUploadOpts)
    .catch((error) => {
      alert('Could not connect to My Prints.  Check your network connection and try again')
    })
};





//upload the file to StratoQ when a print is submitted
chrome.printerProvider.onPrintRequested.addListener((printJob, printRequestStatusCallback) => {
  async function getLocalStorageValue(keys) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(keys, function (value) {
          resolve(value);
        })
      }
      catch (ex) {
        reject(ex);
      }
    });
  }

    
  getLocalStorageValue(['sqToken', 'sqServer'])
    .then(checkStorage)
    .then(values => getUploadTarget(values, printJob))
    .then(values => handleHTTPStatus(values, 'getting the upload target from StratoQ'))
    .then(res => res.json())
     .then(awsInfo => performUploadToAWS(awsInfo, printJob))
    .then(values => handleHTTPStatus(values, 'uploading the job to the My Prints queue'))
    .then(response => {
      printRequestStatusCallback("OK"); // Let Chrome know SUCCESS
    })
    .catch(function(error){
      // NOTE: If there is a network error, then it will perhaps be reported as
      // "TypeError: Failed to fetch" which is a CORS error.
      alert('Something went wrong during the upload process.  Please check your network connection and try again.' + error);
      printRequestStatusCallback("FAILED")
    })
});
