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
            if(this.#catchCbStorage.length === 0){
                throw new UncaughtPromiseError(value);
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
    static resolve(value){
        return new Promise((resolve) => {
            resolve(value);
        })
    }
    static reject(value){
        return new Promise((resolve, reject) => {
            reject(value);
        })
    }
}
class UncaughtPromiseError extends Error {
    constructor(error){
        super(error);
        this.stack = `(in promise) ${error.stack}`;
    }
}
module.exports = arnavPromise

