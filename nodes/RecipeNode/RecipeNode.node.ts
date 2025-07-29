import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { langfuseHandler, suggestRecipe } from '../../workflows/recipe-workflow';
export class RecipeNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Recipe Node',
		name: 'recipeNode',
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
		this.logger.info('Initializing RecipeNode ' + JSON.stringify(prompt));
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
