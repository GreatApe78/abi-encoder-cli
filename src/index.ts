#!/usr/bin/env node
import * as chalk from "chalk";
import inquirer from "inquirer";
import { getSelectorFromSignature } from "./utils/getSelectorFromSignature.js";
import { sleep } from "./utils/sleep.js";
import { calculateCalldata } from "./utils/calculateCalldata.js";
import { printDivider, printTitle } from "./utils/printing.js";
import { Step } from "./types/types.js";

//const CALCULATE_SELECTOR_QUESTION = "Calculate function selector";
const ENCODE_CALLDATA_QUESTION = "Encode calldata";

const BACK_TO_MENU = "Back to menu";
const REPEAT = "Repeat";

let signature: string = "";
let selector: string = "";

/* async function showMenuOptions() {
	const questions = [CALCULATE_SELECTOR_QUESTION];
	const answer = await inquirer.prompt({
		name: "option",
		type: "list",
		message: "Choose an option",
		choices: questions,
	});
	return answer.option;
}
 */

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
		console.log(chalk.default.yellow(`You must provide a non-empty name!`));
		await calculateSelectorOption();
	}
	if (
		answerFunctionName.functionName.includes("(") ||
		answerFunctionName.functionName.includes(")")
	) {
		console.log(
			chalk.default.yellow(
				`Please,Enter the function name without the parenthesis`
			)
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
		let type = answerArgumentType.argumentType;
		if(type==="CUSTOM"){
			const answerCustomType = await inquirer.prompt({
				name: "customType",
				type: "input",
				message: `Enter the properties of the custom type between parenthesis and separated by commas:`,
			

			});
			type = answerCustomType.customType;
			if(!type.includes("(") || !type.includes(")")){
				console.log(
					chalk.default.yellow(
						`Please,Enter the custom type with parenthesis`
					)
				);
				await calculateSelectorOption();
			}
		}

		argumentsTypes.push(type);
	}
	signature = signature + `(${argumentsTypes.join(",")})`;
	selector = getSelectorFromSignature(signature);
	printDivider();
	console.log(`  SIGNATURE: ${chalk.default.cyan(signature)}`);
	console.log(`  SELECTOR: ${chalk.default.green(selector)}`);
	printDivider();
	await sleep();

	await handleNextStep({
		currentStep: calculateSelectorOption,
		nextStep: {
			name: ENCODE_CALLDATA_QUESTION,
			routine: () => encodeCalldataOption(numberOfArguments),
		},
	});
}

async function handleNextStep({ currentStep, nextStep }: Step) {
	const choices = [BACK_TO_MENU, REPEAT].concat(nextStep ? nextStep.name : []);
	const answer = await inquirer.prompt({
		name: "option",
		type: "list",
		message: "Choose an option",
		choices: choices,
	});
	switch (answer.option) {
		case REPEAT: {
			console.clear();
			await currentStep();
			break;
		}
		case BACK_TO_MENU: {
			await main();
			break;
		}
		case nextStep?.name: {
			console.clear();
			await nextStep?.routine();
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
	let calldata: string = "";
	try {
		calldata = calculateCalldata(signature, args);
	} catch (error) {
		console.log(
			chalk.default.red(
				"Error. You provided an invalid argument. Please, try again!"
			)
		);
		await sleep(1000);
		await handleNextStep({
			currentStep: () => encodeCalldataOption(numberOfArguments),
		});
	}
	printDivider();
	console.log(`  CALLDATA: ${chalk.default.green(calldata)}`);
	printDivider();

	await handleNextStep({
		currentStep: () => encodeCalldataOption(numberOfArguments),
	});
}
async function main() {
	console.clear();
	await printTitle();
	await calculateSelectorOption();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
