//define a few logging functions we're going to need later
const examineIt = (stuff) => {
    console.log(stuff)
    return stuff;
}

const dealWithResponse = (stuff) => {
    let info = stuff.json()
    console.log('The expert info response is   ' + info)
    return info;
}

const checkHttp = (promise) => {
    console.log('the status of the request is  ' + promise.status)
    if (promise.status !== 200) {
       // alert('uh oh...problem getting the expert info back ' + promise.status);
    }
    return promise;
}

function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');
    for(var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');
        // Set its contents:
        item.appendChild(document.createTextNode(array[i]));
        // Add it to the list:
        list.appendChild(item);
    }
    // Finally, return the constructed list:
    return list;
}





//This is what we do when the button is clicked.  First we fetch the data from our API then we create a table baded off the results.
const getData = (buttonResults) => {
    fetch("https://izas4pssoe.execute-api.us-east-1.amazonaws.com/staging", {
      "method": "POST",
      "headers": {
        "content-type": "text/plain"
      },
      "body": JSON.stringify(
         {'artists': ['James Joyce', 'Bob Dylan'], 'dob': '1986-10-10'}
      )
    })
    .then(checkHttp)
    .then(dealWithResponse)
    .then(examineIt)
    .catch(err => {
      console.error(err);
    });
}




document.getElementById("generateTable").addEventListener("click", getData);
