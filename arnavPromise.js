const stateMap = {
    "PENDING": "Pending",
    "FULFILLED": "Fulfilled",
    "REJECTED": "Rejected"
}



class arnavPromise {
    #thenCbStorage = [];
    #catchCbStorage = [];
    #value;
    #state = stateMap.PENDING;

    

    constructor(cbFcn){
        try{
            cbFcn(this.#cbFcnSuccess.bind(this), this.#cbFcnFail.bind(this));
        }catch(e){
            this.#cbFcnFail(e);
        }
    }

    #executeStoredCb(){
        //console.log("inside execute fcn");
        if(this.#state === stateMap.FULFILLED){
            this.#thenCbStorage.forEach(cb => {
                //console.log("Executing then cbs")
                cb(this.#value);
            })
            this.#thenCbStorage = [];
        }
        if(this.#state === stateMap.REJECTED){
            this.#catchCbStorage.forEach(cb => {
                //console.log("Executing catch cbs")
                cb(this.#value);
            })
            this.#catchCbStorage = [];
        }
    }
    #cbFcnSuccess(value){
        setTimeout(() => {
            if( value instanceof arnavPromise){
                value.then(this.#cbFcnSuccess.bind(this), this.#cbFcnFail.bind(this))
                return
            }
            if(this.#state === stateMap.PENDING){
                //console.log("changing promise state to fulfilled")
                this.#value = value;
                this.#state = stateMap.FULFILLED;
                this.#executeStoredCb();
            }
            else return;
        }, 0)
    // });
    }
    #cbFcnFail(value){
        setTimeout(() => {
            //console.log(value);
            if( value instanceof arnavPromise){
                value.then(this.#cbFcnSuccess.bind(this), this.#cbFcnFail.bind(this))
                return
            }
            if(this.#state === stateMap.PENDING){
                //console.log("changing promise state to rejected")
                this.#value = value;
                this.#state = stateMap.REJECTED;
                this.#executeStoredCb();
            }
            else return;
        }, 0)
        
    }
    then(thencb, catchcb){
        //console.log("inside then")
        return new arnavPromise((resolve, reject) => {
            this.#thenCbStorage.push(result => {
                if(thencb == null){
                    resolve(result)
                    return
                }
                try {
                    resolve(thencb(result));
                }catch(error){
                    reject(error);
                }
            })
        
            this.#catchCbStorage.push(result => {
                if(catchcb == null){
                    reject(result)
                    return
                }
                try {
                    resolve(catchcb(result));
                }catch(error){
                    reject(error);
                }
            })

            this.#executeStoredCb();
        });
    }
    catch(catchcb){
        return this.then(undefined, catchcb);
    }

    finally(finallycb){
        return this.then(result => {
            finallycb()
            return result;
        }, result => {
            finallycb()
            throw result;
        })
    }
}

module.exports = arnavPromise

/* TEST BELOW */

/*
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
        try{
            if(val%4 ==0){
                resolve("Divisible by 4");
            }
            else{
                reject("Not divisible by 4")
            }
        }catch(e){
            throw new Error;
        }
    })
}



p.then((num) => { 
        console.log("number was even")
        isDivisibleByFour(num).then((msg) => {
            console.log(msg);
        })
        .catch(() => { console.log("not divisible by 4")})        
    })
    .catch(() => {console.log("number was odd")
    })
    .finally(() => { console.log("game finished!")})
*/    

