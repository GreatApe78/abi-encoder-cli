export type Step = {
	currentStep: () => Promise<any>;
	nextStep?: {
		name: string;
		routine: () => Promise<any>;
	};
};