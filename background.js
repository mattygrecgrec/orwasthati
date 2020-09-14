
const getData = (buttonResults) => {
    fetch("https://izas4pssoe.execute-api.us-east-1.amazonaws.com/staging", {
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "body": {
        "artists": [
          "James Joyce",
          "Bob Dylan"
        ],
        "dob": "1986-10-10"
      }
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.error(err);
    });
}



document.getElementById("generateTable").addEventListener("click", getData);
