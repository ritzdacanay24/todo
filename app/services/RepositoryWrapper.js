
import AuthService from "../services/auth.service";
import ItemService from "../services/item.service";
import KrogerService from "../services/kroger.service";
import ListService from "../services/list.service";
import RecipeService from "../services/recipe.service";
import SpoonacularService from "../services/spoonacular.service";
import SupportService from "../services/support.service";
import UserService from "../services/user.service";

class RepositoryWrapper {
  constructor() {
    this.ItemService = new ItemService();
    this.UserService = new UserService();
    this.AuthService = new AuthService();
    this.KrogerService = new KrogerService();
    this.ListService = new ListService();
    this.RecipeService = new RecipeService();
    this.SpoonacularService = new SpoonacularService();
    this.SupportService = new SupportService();
  }
}

export default RepositoryWrapper;
