import API from "../utils/API";

class RecipeService {
    
  async addRecipeAction(params) {
    return await API.post(`recipes/`, params);
  }

  async deleteRecipeById(recipeId) {
    return await API.delete(`recipes/${recipeId}`);
  }

  async getRecipeByUserId(userId) {
    return await API.get(`recipes/${userId}`);
  }

  async getRecipeById(recipeId) {
    return await API.get(`recipes/${recipeId}/recipeId`);
  }
  
}

export default RecipeService;