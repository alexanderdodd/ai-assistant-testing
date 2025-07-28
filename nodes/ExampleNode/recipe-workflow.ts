import { ChatOllama } from '@langchain/ollama';
import CallbackHandler from 'langfuse-langchain';
import { Logger } from 'n8n-workflow';
export const langfuseHandler = new CallbackHandler({
	publicKey: 'pk-lf-81b09d6a-d284-4cae-9c34-0d87131445d9',
	secretKey: 'sk-lf-897c1f39-202b-4b7a-821f-b400e9541bb0',
	baseUrl: 'http://localhost:3000',
});

const model = new ChatOllama({
	model: 'qwen3:8b',
	temperature: 0.6,
	topP: 0.95,
	topK: 20,
	format: 'json',
	verbose: true,
});

export async function suggestRecipe(input: string, logger: Logger): Promise<string> {
	logger.info('Step 1: Executing model');

	const result = await model.invoke(
		[
			{ role: 'user', content: input },
			{
				role: 'system',
				content:
					'You are a helpful assistant generating a recipe based on the user prompts. Always provide some kind of recipe, no matter what the user provides. Provide it in a JSON format.',
			},
		],
		{
			callbacks: [langfuseHandler],
		},
	);

	logger.info('Step 2: Received model result: ' + result.content.toString());
	logger.info('Step 3: Prepping result node');

	return result.content.toString();
}
