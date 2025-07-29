import { suggestRecipe } from './recipe-workflow';

test('suggestRecipe should return a recipe suggestion', async () => {
	const suggestion = await suggestRecipe('What is a recipe for chocolate cake?', console);
	expect(suggestion).toBeDefined();
	expect(suggestion).toContain('chocolate');
}, 60000);
