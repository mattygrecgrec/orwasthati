//define a few logging functions we're going to need later
const examineIt = (stuff) => {
    console.log(stuff)
    console.log(stuff.body)
    return stuff.body;
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



function makeUl(array) {
    // Create the list element:
    var list = document.createElement('ul');
    for(var i = 0; i < array.length; i++) {
        console.log(stuff[0].artist + ' released "' + stuff[0].work + '" on ' + stuff[0].releaseDate + ' at the age of ' + stuff[0].ageAtRelease + '.  On ' + stuff[0].dateInMyLife + ' you will be the same age to the day that they were when they released it.')
        // Create the list item:
        //var item = document.createElement('li');
        // Set its contents:
        //item.appendChild(document.createTextNode(array[i]));
        // Add it to the list:
        //list.appendChild(item);
    }
    // Finally, return the constructed list:
    return list;
}

const setWorksTable = (stuff) => {
    //console.log(stuff[0].artist + ' released "' + stuff[0].work + '" on ' + stuff[0].releaseDate + ' at the age of ' + stuff[0].ageAtRelease + '.  On ' + stuff[0].dateInMyLife + ' you will be the same age to the day that they were when they released it.')
    document.getElementById("workResults").appendChild(makeUL(stuff[0].dateInMyLife));
}




const loopTest = (stuff) => {
    d = new Date()
    d1 = d.toISOString()
    let gender
    
    for(var i = 0; i < stuff.length; i++) {
        if (stuff[i].gender == 'm') {
            gender = "he"
        } else {
            gender = "she"
        }
        
        let dateOperator
        d2 = stuff[i].dateInMyLife + 'T00:00:00.000Z'
        if (d1 >= d2) {
            dateOperator = "were"
        } else {
            dateOperator = "will be"
        }
    
        var li = document.createElement("LI")
        var text = document.createTextNode('On ' + stuff[i].dateInMyLife + ' you ' + dateOperator + ' the same age, to-the-day, that ' + stuff[i].artist + ' was when ' + gender + ' released "' + stuff[i].work + '" (age: ' + stuff[i].ageAtRelease + ', Release Date: ' + stuff[i].releaseDate + ').');
        li.appendChild(text)
        document.getElementById("workResultsText").appendChild(li);
    }
}





//hide the GO button until all DOB options are selected
function showGoButton() {
    var m = document.getElementById("DOBMonth").value;
    var y = document.getElementById("DOBYear").value;
    var d = document.getElementById("DOBDay").value;
    if ( m == '- Month -' || y == '- Year -' || d == '- Day -' ) {
        document.getElementById('generateTable').style.display = 'none';
    } else {
        document.getElementById('generateTable').style.display = 'inline';
    }
}
document.getElementById("DOBYear").addEventListener("change", showGoButton);
document.getElementById("DOBMonth").addEventListener("change", showGoButton);
document.getElementById("DOBDay").addEventListener("change", showGoButton);





//This is what we do when the button is clicked.  First we fetch the data from our API then we create a table baded off the results.
const getData = (buttonResults) => {
    let dob = document.getElementById("DOBYear").value + '-' + document.getElementById("DOBMonth").value + '-' + document.getElementById("DOBDay").value
    console.log(dob)
    fetch("https://izas4pssoe.execute-api.us-east-1.amazonaws.com/staging", {
      "method": "POST",
      "headers": {
        "content-type": "text/plain"
      },
      "body": JSON.stringify(
         {'artists': ['James Joyce', 'Bob Dylan'], 'dob': dob}
      )
    })
    .then(checkHttp)
    .then(dealWithResponse)
    .then(examineIt)
    .then(loopTest)
    .catch(err => {
      console.error(err);
    });
}


document.getElementById("generateTable").addEventListener("click", getData);
