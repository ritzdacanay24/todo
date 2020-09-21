import API from "../utils/API";

class SpoonacularService {

    async extractRecipeFromUrl(url) {
        return await API.post(`/spoonacular/extractRecipeFromUrl`, { url: url });
    }

    async searchByRecipeName(recipeName, offset, number) {
        return await API.get(`/spoonacular/searchRecipe/${number}/total/${offset}/startFrom/${recipeName}/recipe`);
    }

    async getRecipeInfoById(recipeId) {
        return await API.get(`/spoonacular/searchRecipeById/${recipeId}`);
    }

    async getInformationBulk(params) {
        return await API.get(`/spoonacular/informationBulk`, { params });
    }

    async getMealPlan() {
        return await API.get(`/spoonacular/mealPlanGenerate`);
    }

}

export default new SpoonacularService();