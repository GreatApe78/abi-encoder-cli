import { ethers } from "ethers";


export function getSelectorFromSignature(signature:string){
    return ethers.id(signature).slice(0, 10);
}