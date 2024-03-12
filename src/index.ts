#!/usr/bin/env node
import chalk from "chalk";

import inquirer from "inquirer";
import figlet from "figlet";
import { getSelectorFromSignature } from "./utils/getSelectorFromSignature";
import { sleep } from "./utils/sleep";
import { calculateCalldata } from "./utils/calculateCalldata";
const CALCULATE_SELECTOR_QUESTION = "Calculate function selector";
const ENCODE_CALLDATA_QUESTION = "Encode calldata";

const BACK_TO_MENU = "Back to menu";
const REPEAT = "Repeat";

let signature: string = "";

let selector: string = "";
function printDivider() {
	console.log(
		chalk.yellow("-------------------------------------------------")
	);
}
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
	const questions = [CALCULATE_SELECTOR_QUESTION];
	const answer = await inquirer.prompt({
		name: "option",
		type: "list",
		message: "Choose an option",
		choices: questions,
	});
	return answer.option;
}

async function calculateSelectorOption() {
	selector = "";
	signature = "";
	const argumentsTypes = [];
	const answerFunctionName = await inquirer.prompt({
		name: "functionName",
		type: "input",
		message: "Enter the solidity function name:",
	});
	if (!answerFunctionName.functionName.length) {
		console.log(chalk.yellow(`You must provide a non-empty name!`));
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
	selector = getSelectorFromSignature(signature);
	printDivider();
	console.log(`SIGNATURE: ${chalk.cyan(signature)}`);
	console.log(`SELECTOR: ${chalk.green(selector)}`);
	printDivider();
	await sleep();
	//await backToMenuOrRepeat(calculateSelectorOption);

	const answer = await inquirer.prompt({
		name: "option",
		type: "list",
		message: "Choose an option",
		choices: [BACK_TO_MENU, REPEAT, ENCODE_CALLDATA_QUESTION],
	});
	switch (answer.option) {
		case ENCODE_CALLDATA_QUESTION: {
			await encodeCalldataOption(numberOfArguments);
			break;
		}

		case REPEAT: {
            console.clear();
			await calculateSelectorOption();
			break;
		}
		case BACK_TO_MENU: {
			await main();
			break;
		}
		default:
			break;
	}
	//return {signature,selector}
}
async function backToMenuOrRepeat(routine: () => Promise<any>) {
	const answer = await inquirer.prompt({
		name: "option",
		type: "list",
		message: "Choose an option",
		choices: [BACK_TO_MENU, REPEAT],
	});
	switch (answer.option) {
		case REPEAT: {
            console.clear();
			await routine();
			break;
		}
		case BACK_TO_MENU: {
			await main();
			break;
		}
		default:
			break;
	}
}
async function encodeCalldataOption(numberOfArguments: number) {
	const args = [];
	for (let i = 1; i <= numberOfArguments; i++) {
		const answer = await inquirer.prompt({
			name: `argument`,
			type: "input",
			message: `Enter the value of argument ${i}:`,
		});
		args.push(answer.argument);
	}
	const calldata = calculateCalldata(signature, args);
	printDivider();
	console.log(`CALLDATA: ${chalk.green(calldata)}`);
	printDivider();
	await backToMenuOrRepeat(async () => encodeCalldataOption(numberOfArguments));
}
async function main() {
	console.clear();
	await printTitle();
	const option = await showMenuOptions();
	switch (option) {
		case CALCULATE_SELECTOR_QUESTION: {
			await calculateSelectorOption();
			break;
		}

		default: {
			break;
		}
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
