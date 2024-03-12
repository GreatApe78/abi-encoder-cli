
import {ethers }from "ethers";

export function calculateCalldata(signature:string, args:any[]){
    //const selector = getSelectorFromSignature(signature);
    const abiInterface = new ethers.Interface([`function ${signature}`]);
    const calldata = abiInterface.encodeFunctionData(signature,args);
    return `${calldata}`
}
//const calldata = calculateCalldata("transfer(address,uint256)",["0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",100])
//console.log(calldata)