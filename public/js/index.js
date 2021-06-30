let ingredientsToCheck = [];

// Adds ingredient to ingredient box.
$("#add-btn").click(() => {
  const currIngredient = $("#ingredient-input").val().trim().toLowerCase();

  if (
    ingredientsToCheck.includes(currIngredient) ||
    containsOnlyWhiteSpace(currIngredient)
  ) {
    alert("Ingredient you entered is invalid or has already been chosen");
  } else {
    ingredientsToCheck.push(currIngredient);
    populateIngredientBox();
  }

});

// Removes ingredient from ingredient box
$("#ingredients-box").click((e) => {
  const index = ingredientsToCheck.indexOf($(e.target).text().trim());
  if (index > -1) {
    ingredientsToCheck.splice(index, 1);
  }

  if ($(e.target).attr("class") == "selected-ingredient") {
    $(e.target).remove();
  }
});

// Checks ingredient ruling
$("#check-btn").click(() => {
  $("#add-btn").attr("hidden", true);
  $("#check-btn").attr("hidden", true);

  let accumulativeResults = [];

  makeGetsWithIngredients(accumulativeResults);

  setTimeout(() => {
    combineRulings.bind(this, accumulativeResults);
    displayImage(combineRulings(accumulativeResults));
    $("#message")
      .attr("hidden", false)
      .html(`<h3>${combineRulings(accumulativeResults).toUpperCase()}</h3>`);
    $("#redirect-btn").attr("hidden", false);
    $("#link-to-req-btn").attr("hidden", false);
    $("#ingredient-input").attr("hidden", true);
  }, 1000);
  switchDisplays();
});

// Redirects to request ingredient page
$("#link-to-req-btn").click(() => {
  window.location.href = "/request";
})


// Makes get requests with ingredients to retrieve their ruling
function makeGetsWithIngredients(accumulativeArr) {
  ingredientsToCheck.forEach((e) => {
    $.get(`/ingredients/${e}`, (ruling) => {
      let result = [];
      result.push(e);
      result.push(ruling);
      accumulativeArr.push(ruling);
      displayResults([result]);
    });
  });
}

// Adds ingredients to ingredient box
function populateIngredientBox() {
  const newIngredient = ingredientsToCheck.slice(-1);

  $("#ingredients-box")
    .attr("hidden", false)
    .append(
      `<h3 class='selected-ingredient'> ${newIngredient} <i class='fas fa-minus'></i></h3>`
    );
}

// Removes ingredient box and displays results
function switchDisplays() {
  $("#ingredients-box").slideUp("slow", () => {
    $("#result-box").attr("hidden", false);
  });
}

// Displays results box
function displayResults(results) {
  results.forEach((e) => {
    $("#result-box").append(
      `<h3 class="checked-ingredient" style="color: ${setColor(e[1])[0]}">${
        e[0]
      }${setColor(e[1])[1]}</h3>`
    );
  });
}

// Sets color of ingredient depending on ruling
function setColor(ruling) {
  if (ruling === "No match") {
    return ["#c2bcae", "<i class='fas fa-question result-icon'></i>"];
  } else if (ruling === "halal") {
    return ["#b9e300", "<i class='fas fa-check result-icon'></i>"];
  } else if (ruling === "doubtful") {
    return ["#f0b930", "<i class='fas fa-exclamation result-icon'></i>"];
  } else {
    return ["#ff3838", "<i class='fas fa-times result-icon'></i>"];
  }
}

// Displays image depending on ruling
function displayImage(ruling) {
  const imageBox = $("#image-box");

  imageBox.attr("hidden", false);

  if (ruling === "halal") {
    imageBox.html("<i class='flaticon-halal-sign'></i>");
  } else if (ruling === "haram") {
    imageBox.html("<i class='flaticon-haram'></i>");
  } else if (ruling === "doubtful") {
    imageBox.html("<i class='flaticon-caution-sign'></i>");
  } else {
    imageBox.html("<i class='flaticon-file'></i>");
  }
}

// Combines rulings of single ingredients into a final ruling for all
function combineRulings(ingredients) {
  let haramCnt = 0;
  let halalCnt = 0;
  let doubtCnt = 0;
  let unknownCnt = 0;

  ingredients.forEach((e) => {
    if (e === "halal") {
      halalCnt++;
    } else if (e === "haram") {
      haramCnt++;
    } else if (e === "doubtful") {
      doubtCnt++;
    } else {
      unknownCnt++;
    }
  });

  if (haramCnt > 0) {
    return "haram";
  } else if (doubtCnt > 0) {
    return "doubtful";
  } else if (unknownCnt > 0) {
    return "unknown";
  } else {
    return "halal";
  }
}

// Checks if given string contains only whitespace
function containsOnlyWhiteSpace(string) {
  if (!string.replace(/\s/g, "").length) {
    return true;
  }
}