/* eslint-disable array-callback-return */

import TutorialService from "./TutorialService";

const mapCategories = async (tutorials) => {
  let categories;
  if (!localStorage.getItem("categories")) {
    categories = await TutorialService.getCategories();
  } else {
    categories = JSON.parse(localStorage.getItem("categories"));
  }

  const updatedTutorials = tutorials.map((f) => {
    if (!!f.category) {
      let id = f.category;
      f.category = categories.find((c) => c.id == id)?.category;
    }
    return f;
  });

  return updatedTutorials;
};

export default mapCategories;