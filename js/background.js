//paint the list of works that come back from the server request.
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




//hide options until all DOB fields are selected
function showArtists() {
    var m = document.getElementById("DOBMonth").value;
    var y = document.getElementById("DOBYear").value;
    var d = document.getElementById("DOBDay").value;
    if ( m == '- Month -' || y == '- Year -' || d == '- Day -' ) {
        document.getElementById('artistSelectBox').style.display = 'none';
    } else {
        document.getElementById('artistSelectBox').style.display = 'inline'
        document.getElementById('generateTable').style.display = 'inline'
    }
}
document.getElementById("DOBYear").addEventListener("change", showArtists);
document.getElementById("DOBMonth").addEventListener("change", showArtists);
document.getElementById("DOBDay").addEventListener("change", showArtists);





//sort the results that we get back from the server request so that the dates are earliest to latest.
const sortArray = (arrayOfObjects) => {
    const sortedWorks = arrayOfObjects.sort((a, b) => new Date(a.dateInMyLife) - new Date(b.dateInMyLife))
    return sortedWorks
}




//This is what we do when the button is clicked.  First we fetch the data from our API then we create a table based off the results.
const getData = (buttonResults) => {
    let dob = document.getElementById("DOBYear").value + '-' + document.getElementById("DOBMonth").value + '-' + document.getElementById("DOBDay").value
    fetch("https://izas4pssoe.execute-api.us-east-1.amazonaws.com/staging", {
      "method": "POST",
      "headers": {
        "content-type": "text/plain"
      },
      "body": JSON.stringify(
         {'artists': buttonResults, 'dob': dob}
      )
    })
    .then(checkHttp)
    .then(dealWithResponse)
    .then(examineIt)
    .then(sortArray)
 //   .then(examineIt)
 //   .then(getSelectedArtists)
    .then(paintIt)
    .catch(err => {
      console.error(err);
    });
}




// use this function to generate an array of the selected artists before fetching the results.  This is used in the POST body.
const buttonArray = () => {
    const aListForFetch = []
    var childrenOfDiv = document.getElementById("artistsArea").childNodes;
   //console.log("the children artistsArea are...   " + childrenOfDiv)

    for(i = 0; i < childrenOfDiv.length; i++){
        if(childrenOfDiv[i].nodeName == "LABEL" && childrenOfDiv[i].childNodes[1].checked){
            aListForFetch.push(childrenOfDiv[i].childNodes[1].value)
            console.log(childrenOfDiv[i].childNodes[1])
        }
    }
    //console.log("aListForFetch is  "  + aListForFetch)
    if (aListForFetch.length == 0 ){
        //console.log("nothing selected")
        document.getElementById("buttonError").style.display = "block"
        let ul = document.getElementById('workResultsText');
        if (ul) {
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }
        }
    } else {
        document.getElementById("buttonError").style.display = "none"
        getData(aListForFetch)
    }
}


document.getElementById("generateTable").addEventListener("click", buttonArray);







//
const writeToDemo = () => {
    document.getElementById("demo").innerText = "yeah!"
}


