/* TEST BELOW */

const arnavPromise = require('./arnavPromise');

// function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
//   }
  
// let p = new arnavPromise((resolve, reject) =>{
//     let num = getRandomInt(30)
//     console.log(num);
//     if(num %2 == 0){
//         console.log("resolving promise")
//         resolve(num);
//     }
//     else {
//         console.log("rejecting promise")
//         reject("No Hi to you!");
//     }
    

// });
// let isDivisibleByFour = (val) => {
//     return new arnavPromise((resolve, reject) => {
//             if(val%4 ==0){
//                 resolve("Divisible by 4");
//             }
//             reject("Not divisible by 4");
            
//     })
// }


// p.then((num) => { 
//         console.log("number was even")
//         isDivisibleByFour(num).then((msg) => {
//             console.log(msg);
//         })
//         .catch((msg) => { console.log("Catched: "+ msg)})        
//     })
//     .catch(() => {console.log("number was odd")
//     })
//     .finally(() => { console.log("game finished!")})


    
    
// const wait = (ms) => new arnavPromise((resolve) => setTimeout(resolve, ms));

// wait(0).then(() => console.log(4));
// arnavPromise.resolve()
//     .then(() => console.log(2))
//     .then(() => console.log(3));
// console.log(1);

const promise = new arnavPromise(function(resolve, reject){
    console.log("Promise callback");
    resolve();
}).then(function(result) {
    console.log("promise callback (.then)");
});

setTimeout(function() {
    console.log("event-loop cycle: Promise (fulfilled)")
}, 0)

console.log("Promise (pending)", promise);