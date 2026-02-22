// Import the Init
import { initializeLearningPage } from "./init.js";

document.addEventListener("DOMContentLoaded", () => {
  //  Read the attributes
  const body = document.body;
  const grammarFrom = body.dataset.grammarFrom;
  const grammarTo = body.dataset.grammarTo;

  // Calls the initialization function
  if (grammarFrom && grammarTo) {
    initializeLearningPage(grammarFrom, grammarTo);
  } else {
    console.error(
      "Missing 'data-grammar-from' or 'data-grammar-to' data in the body",
    );
  }
});
