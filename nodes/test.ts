import { langfuseHandler, suggestRecipe } from './ExampleNode/recipe-workflow';

async function run() {
	const suggestion = await suggestRecipe('What is a recipe for chocolate cake?', console);
	console.log('Recipe suggestion:', suggestion);
	langfuseHandler.flushAsync().then(() => {
		console.log('Langfuse handler flushed successfully');
	});
}

run();
