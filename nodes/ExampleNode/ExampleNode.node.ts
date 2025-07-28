import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { langfuseHandler, suggestRecipe } from './recipe-workflow';
export class ExampleNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AI Assistant',
		name: 'exampleNode',
		group: ['transform'],
		version: 1,
		description: 'Basic Recipe Suggestor',
		defaults: {
			name: 'Recipe Suggestor',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Type of Recipe',
				name: 'Prompt',
				type: 'string',
				default: '',
				placeholder: 'Placeholder value',
				description: 'The description text',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const prompt = (await this.getExecuteData()).node.parameters.Prompt;
		this.logger.info('Initializing ExampleNode ' + JSON.stringify(prompt));
		this.logger.info('Step 1: Executing model');

		const result = await suggestRecipe(prompt!.toString(), this.logger);

		const nodeResult: INodeExecutionData = {
			json: result as unknown as INodeExecutionData,
		};
		this.logger.info('Step 4: Created result node: ' + JSON.stringify(nodeResult.json));

		langfuseHandler.flushAsync().then(() => {
			this.logger.info('Langfuse handler flushed successfully');
		});

		return [[nodeResult]];
	}
}
