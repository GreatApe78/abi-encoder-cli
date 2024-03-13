import * as  chalk from "chalk";
import figlet from "figlet";

export function printDivider() {
	console.log(
		chalk.default.yellow("-------------------------------------------------")
	);
}
export function printTitle() {
	return new Promise((resolve, reject) => {
		figlet("Abi Encoder!", (err, text) => {
			if (err) {
				console.error(err);
				reject(err);
			}
			console.log(chalk.default.yellow(text));
			resolve(text);
		});
	});
}
