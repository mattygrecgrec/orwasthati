//define a few logging functions we're going to need later
const examineIt = (stuff) => {
    console.log(stuff)
    console.log(stuff.body)
    return stuff.body;
}

const dealWithResponse = (stuff) => {
    let info = stuff.json()
    //console.log('The expert info response is   ' + info)
    return info;
}

const checkHttp = (promise) => {
    //console.log('the status of the request is  ' + promise.status)
    if (promise.status !== 200) {
       // alert('uh oh...problem getting the expert info back ' + promise.status);
    }
    return promise;
}



const paintIt = (stuff) => {
    d = new Date()
    d1 = d.toISOString()
    let gender
    
    //remove existing entries
    let ul = document.getElementById('workResultsText');
    if (ul) {
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }
    
    //now loop through
    for(var i = 0; i < stuff.length; i++) {
        //determine which word we should use for the gender
        if (stuff[i].gender == 'm') {
            gender = "he"
        } else {
            gender = "she"
        }
        //determine which phrase we should use for the past/present
        let dateOperator
        d2 = stuff[i].dateInMyLife + 'T00:00:00.000Z'
        if (d1 >= d2) {
            dateOperator = "were"
        } else {
            dateOperator = "will be"
        }
    
        //convert the date to a friendly string
        let d = new Date(stuff[i].dateInMyLife)
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let dNice = days[d.getUTCDay()]

        let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
        let mNice = months[d.getUTCMonth()]
        
        
        //create the ordered list of works and paint them
        var li = document.createElement("LI")
        var text = document.createTextNode(mNice + ' ' + d.getDate() + ', ' + d.getUTCFullYear() + ' - You ' + dateOperator + ' the exact age(' + stuff[i].ageAtRelease + ') that ' + stuff[i].artist + ' was when ' + gender + ' released "' + stuff[i].work + '" (Release Date: ' + stuff[i].releaseDate + ').');
        li.appendChild(text)
        document.getElementById('workResultsText').appendChild(li);
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





const sortArray = (arrayOfObjects) => {
    //const date1 = new Date(arrayOfObjects[1].dateInMyLife)
    //console.log(date1)
    const sortedWorks = arrayOfObjects.sort((a, b) => new Date(a.dateInMyLife) - new Date(b.dateInMyLife))
    console.log(sortedWorks)
    return sortedWorks
}


//This is what we do when the button is clicked.  First we fetch the data from our API then we create a table baded off the results.
const getData = (buttonResults) => {
    let dob = document.getElementById("DOBYear").value + '-' + document.getElementById("DOBMonth").value + '-' + document.getElementById("DOBDay").value
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
    .then(sortArray)
 //   .then(examineIt)
    .then(paintIt)
    .catch(err => {
      console.error(err);
    });
}


document.getElementById("generateTable").addEventListener("click", getData);
