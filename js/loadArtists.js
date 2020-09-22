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
  //  console.log(artistArray)
    for(var i = 0; i < artistArray.length; i++) {
        let c = document.createElement("INPUT")
      //  let s = document.createElement("SPAN")
        let l = document.createElement("LABEL")

        c.setAttribute("type", "CHECKBOX")
        //l.setAttribute("for", artistArray[i])
        c.setAttribute("id", [i] + " artist")
        c.setAttribute("value", artistArray[i])
      //  s.setAttribute("id", "span"+[i])
        
        
    //    c.setAttribute("checked", "checked")
        
        
        l.innerText = artistArray[i]
        c.innerText = artistArray[i]

       // aa.appendChild(s)
        //aa.appendChild(c)
    //    aa.appendChild(s)
        aa.appendChild(l);
        l.appendChild(c)
    }
    //const checkboxes = [...document.querySelectorAll('input[type=checkbox]')]
    //console.log(checkboxes)
    //console.log(document.getElementById("artistForm").value)
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



