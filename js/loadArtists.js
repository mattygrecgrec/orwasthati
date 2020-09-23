//define a few logging functions we're going to need later
const examineIt = (stuff) => {
  //  console.log(stuff)
  //  console.log(stuff.body)
  //  console.log(stuff.artistList)
    
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


//function to paint the checkboxes for each artist
const paintArtists = (JsonResponseFromApi) => {
    let artistArray = JsonResponseFromApi.artistList
    const aa = document.getElementById("artistsArea")
    for(var i = 0; i < artistArray.length; i++) {
        let c = document.createElement("INPUT")
        let l = document.createElement("LABEL")
        let s = document.createElement("SPAN")
        
        c.setAttribute("type", "CHECKBOX")
        c.setAttribute("id", [i] + " artist")
        c.setAttribute("value", artistArray[i])
     //   c.setAttribute("class", "visually-hidden")
        s.setAttribute("class", "label-text")
        s.innerText = artistArray[i]
        c.setAttribute("class", "check")

        aa.appendChild(l);
        l.appendChild(c)
        l.appendChild(s)
    }
}





//load the list of artists from the API and display them in a form
const getArtists = () => {
    fetch("https://pix4xv7iai.execute-api.us-east-1.amazonaws.com/prod", {
      "method": "GET",
        }
      )
    .then(checkHttp)
    .then(dealWithResponse)
 //   .then(examineIt)
    .then(paintArtists)
    .catch(err => {
      console.error(err);
    });
};

window.addEventListener('load', getArtists)



