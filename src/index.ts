#!/usr/bin/env node
import chalk from "chalk";

import inquirer from "inquirer";
import figlet from "figlet";
import { getSelectorFromSignature } from "./utils/getSelectorFromSignature";
import { sleep } from "./utils/sleep";
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
	});
}

async function showMenuOptions() {
	const questions = [CALCULATE_SELECTOR_QUESTION, ENCODE_CALLDATA_QUESTION];
	const answer = await inquirer.prompt({
		name: "option",
		type: "list",
		message: "Choose an option",
		choices: questions,
	});
	return answer.option;
}

async function calculateSelectorOption() {
	let signature = "";
	const argumentsTypes = [];
	const answerFunctionName = await inquirer.prompt({
		name: "functionName",
		type: "input",
		message: "Enter the solidity function name",
	});
	if (!answerFunctionName.functionName.length) {
		console.log(chalk.yellow(`Please,Enter the function name`));
		await calculateSelectorOption();
	}
	if (
		answerFunctionName.functionName.includes("(") ||
		answerFunctionName.functionName.includes(")")
	) {
		console.log(
			chalk.yellow(`Please,Enter the function name without the parenthesis`)
		);
		await calculateSelectorOption();
	}

	signature = answerFunctionName.functionName;

	const answerNumberOfArguments = await inquirer.prompt({
		name: "numberOfArguments",
		type: "input",
		message: "Enter the number of arguments:",
	});
	const numberOfArguments = parseInt(answerNumberOfArguments.numberOfArguments);
	for (let i = 1; i <= numberOfArguments; i++) {
		const answerArgumentType = await inquirer.prompt({
			name: "argumentType",
			type: "input",
			message: `Enter the type of argument ${i}:`,
		});
		argumentsTypes.push(answerArgumentType.argumentType);
	}
	signature = signature + `(${argumentsTypes.join(",")})`;
    const selector = getSelectorFromSignature(signature)
	console.log(`SIGNATURE: ${chalk.cyan(signature)}`);
    console.log(`SELECTOR: ${chalk.green( selector)}`);
    await sleep()
    await backToMenuOrRepeat(calculateSelectorOption)
    
}
async function backToMenuOrRepeat(currentRoutine:()=>Promise<any>){
    const BACK_TO_MENU = "Back to menu";
    const REPEAT = "Repeat";
    const answer = await inquirer.prompt({
        name: "option",
        type: "list",
        message: "Choose an option",
        choices: [BACK_TO_MENU,REPEAT],
    });
    console.clear()
    if(answer.option === BACK_TO_MENU){
        await main()
    }
    else{
        await currentRoutine()
    }
}

async function main() {
	await printTitle();
	const option = await showMenuOptions();
    switch (option) {
        case CALCULATE_SELECTOR_QUESTION:{
            await calculateSelectorOption();
            break;
        }
            
    
        default:
            break;
    }
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
