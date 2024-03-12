
export function sleep(ms:number = 2000){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(true);
        },ms)
    })
}