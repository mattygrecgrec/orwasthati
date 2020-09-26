
const artistUl =  document.getElementById('workResultsText')
const currentTime = new Date();



//paint the list of works that come back from the server request.
const paintIt = (stuff) => {
    //console.log("this is the array we're going to sort  " + stuff)
    let d = new Date()
    let d1 = d.toISOString()
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
        let d2 = stuff[i].dateInMyLife + 'T00:00:00.000Z'
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
        let li = document.createElement("LI")
        let span = document.createElement("SPAN")
        if(stuff[i].dateInMyLife == currentTime){
            span.innerText = "you are here right now" + d
            span.setAttribute("class","w3-center" )
            li.setAttribute("class", "w3-theme-l4 w3-center")
            li.appendChild(span)
            
            
        } else {
            let text = document.createTextNode('You ' + dateOperator + ' the exact age, ' + stuff[i].ageAtRelease + ', that ' + stuff[i].artist + ' was when ' + gender + ' released "' + stuff[i].work + '" (Release Date: ' + stuff[i].releaseDate + ').');
            
            let textSmall = 'You ' + dateOperator + ' the exact age, ' + stuff[i].ageAtRelease + ', that ' + stuff[i].artist + ' was when ' + gender + ' released "' + stuff[i].work + '" (Release Date: ' + stuff[i].releaseDate + ').'
            
            let thumb = document.createElement("IMG")
            let div = document.createElement("DIV")
            let span = document.createElement("SPAN")
            let span2 = document.createElement("SPAN")
            let br = document.createElement("BR")
            if(typeof stuff[i].imageUrl === 'undefined'){
                thumb.setAttribute("src", "https://orwasthati.s3.amazonaws.com/workImages/rs-146623-d65dcb014f0ce1daaaa2da683fbc98e2f85e0132.jpg")
                thumb.setAttribute("class", "w3-bar-item w3-circle w3-hide-small")
                thumb.setAttribute("style","width:85px")
                li.setAttribute("class","w3-bar")
                div.setAttribute("class", "w3-bar-item")
                span.setAttribute("class", "w3-large")
                span.innerText = mNice + ' ' + d.getDate() + ', ' + d.getUTCFullYear() + '  -  ' + stuff[i].work
                span2.innerText = textSmall
                
                li.appendChild(thumb)
                li.appendChild(div)
                div.appendChild(span)
                div.appendChild(br)
                div.appendChild(span2)

                
            } else {
                thumb.setAttribute("src", stuff[i].imageUrl)
                thumb.setAttribute("class", "w3-bar-item w3-circle w3-hide-small")
                thumb.setAttribute("style","width:85px")
                li.setAttribute("class","w3-bar")
                div.setAttribute("class", "w3-bar-item")
                span.setAttribute("class", "w3-large")
                span.innerText = mNice + ' ' + d.getDate() + ', ' + d.getUTCFullYear() + '  -  ' + stuff[i].work
                span2.innerText = textSmall
                    
                li.appendChild(thumb)
                li.appendChild(div)
                div.appendChild(span)
                div.appendChild(br)
                div.appendChild(span2)
            }
        }
        document.getElementById('workResultsText').appendChild(li);
    }
}




//hide options until all DOB fields are selected
function showArtists() {
    var m = document.getElementById("DOBMonth").value;
    var y = document.getElementById("DOBYear").value;
    var d = document.getElementById("DOBDay").value;
    //console.log(y.length)
    if ( m == '- Month -' || d == '- Day -' || y.length < 4) {
        document.getElementById('artistSelectBox').style.display = 'none';
    } else {
        document.getElementById('artistSelectBox').style.display = 'inline'
        document.getElementById('generateTable').style.display = 'inline'
    }
}
document.getElementById("DOBYear").addEventListener("input", showArtists);
document.getElementById("DOBMonth").addEventListener("change", showArtists);
document.getElementById("DOBDay").addEventListener("change", showArtists);





//sort the results that we get back from the server request so that the dates are earliest to latest.
const sortArray = (arrayOfObjects) => {
    //console.log(arrayOfObjects.body)
    let myArray = arrayOfObjects.body
    myArray.push({'dateInMyLife': currentTime ,'yourDob':'You are here'})

    const sortedWorks = arrayOfObjects.body.sort((a, b) => new Date(a.dateInMyLife) - new Date(b.dateInMyLife))
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
   // .then(examineIt)
    .then(sortArray)
   // .then(examineIt)
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
       // console.log(childrenOfDiv[i])
        //console.log(childrenOfDiv[i].nodeName + childrenOfDiv[i].checked)
        if(childrenOfDiv[i].nodeName == "INPUT" && childrenOfDiv[i].checked){
           // console.log(childrenOfDiv[i].value)
            aListForFetch.push(childrenOfDiv[i].value)
           // console.log(childrenOfDiv[i].childNodes[0])
        }
    }
    console.log("aListForFetch is  "  + aListForFetch)
    
    if (aListForFetch.length == 0){
        //console.log("nothing selected")
        document.getElementById("buttonError").style.display = "block"
        artistUl.setAttribute("class", "hideThis")

    } else {
        document.getElementById("buttonError").style.display = "none"
        artistUl.setAttribute("class", " w3-ul w3-card-4 shown")

        getData(aListForFetch)
    }
}


//here is the listener to set this all in motion when the user clicks the go button.
document.getElementById("generateTable").addEventListener("click", buttonArray);

