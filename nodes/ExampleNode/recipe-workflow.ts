import { ChatOllama } from '@langchain/ollama';
import CallbackHandler from 'langfuse-langchain';
import { Logger } from 'n8n-workflow';
export const langfuseHandler = new CallbackHandler({
	publicKey: 'pk-lf-e24d2367-763a-4dfa-9aad-a5219a39fd22',
	secretKey: 'sk-lf-5aea3d29-e773-46e2-8acb-efd4297273c4',
	baseUrl: 'http://192.168.178.21:3000',
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
