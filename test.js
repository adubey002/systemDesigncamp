/* TEST BELOW */

const arnavPromise = require('./arnavPromise');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  
let p = new arnavPromise((resolve, reject) =>{
    let num = getRandomInt(30)
    console.log(num);
    if(num %2 == 0){
        console.log("resolving promise")
        resolve(num);
    }
    else {
        console.log("rejecting promise")
        reject("No Hi to you!");
    }
    

});
let isDivisibleByFour = (val) => {
    return new arnavPromise((resolve, reject) => {
            if(val%4 ==0){ff
                resolve("Divisible by 4");
            }
            reject("Not divisible by 4");
            
    })
}


p.then((num) => { 
        console.log("number was even")
        isDivisibleByFour(num).then((msg) => {
            console.log(msg);
        })
        .catch((msg) => { console.log("Catched: "+ msg)})        
    })
    .catch(() => {console.log("number was odd")
    })
    .finally(() => { console.log("game finished!")})
