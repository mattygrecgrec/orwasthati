//define a few functions we'll use later during the lookup
const examineIt = (stuff) => {
    console.log(stuff)
    return stuff;
}

const dealWithResponse = (stuff) => {
    let expertInfo = stuff.json()
   // console.log('The expert info response is   ' + expertInfo)
    return expertInfo;
}

const checkHttp = (promise) => {
 //   console.log('the status of the request is  ' + promise.status)
    if (promise.status !== 200) {
        alert('uh oh...problem getting the expert info back ' + promise.status);
    }
    return promise;
}



const
