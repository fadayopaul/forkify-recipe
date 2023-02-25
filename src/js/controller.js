"strict mode";
import "core-js/stable";
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime";
import * as model from "./model.js";
import recipeViews from "./views/recipeViews.js";
import searchViews from "./views/searchViews.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeViews.renderSpinner();

    // 0.) Update result view to mark selected result
    resultsView.update(model.getSearchResultPage());

    // 1.) Loading Recipe
    await model.loadRecipe(id);

    // 2.) Rendering recipe
    recipeViews.render(model.state.recipe);
  } catch (error) {
    // console.error(error);
    recipeViews.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get Search Query
    const query = searchViews.getQuery();
    if (!query) return;

    // Load results
    await model.loadSearchResult(query);

    // 2) Render Results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // Render initial Pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW Results
  resultsView.render(model.getSearchResultPage(goToPage));

  // Render CURRENT Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  recipeViews.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Render bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update the recipe when bookmarked
  recipeViews.update(model.state.recipe);
};

const init = function () {
  recipeViews.addHandlerRender(controlRecipes);
  recipeViews.addHandlerUpdateServings(controlServings);
  recipeViews.addHandlerAddBookmark(controlAddBookmark);
  searchViews.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
