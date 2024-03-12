#!/usr/bin/env node
import chalk from "chalk";

import inquirer from "inquirer";
import figlet from "figlet";
const CALCULATE_SELECTOR_QUESTION = "Calculate function selector";
const ENCODE_CALLDATA_QUESTION = "Encode calldata";
function printTitle() {
    return new Promise((resolve, reject) => {
        figlet("Abi Encoder!", (err, text) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            console.log(chalk.yellow(text));
            resolve(text);
        });
    })
	
}

async function showMenuOptions(){
    const questions = [
        CALCULATE_SELECTOR_QUESTION,
        ENCODE_CALLDATA_QUESTION,

    ]
    const answer = await inquirer.prompt({
        name:"option",
        type:"list",
        message:"Choose an option",
        choices:questions
    }) 
    return answer.option
}


    

async function main() {
    await printTitle();
	const option =await showMenuOptions();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
