(function () {
  "use strict";

  var catalogLink = document.getElementById("catalogLink");
  var content = document.getElementById("content");

  var state = {
    categories: null,
  };

  function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function create(tag, className, text) {
    var node = document.createElement(tag);

    if (className) {
      node.className = className;
    }

    if (typeof text === "string") {
      node.textContent = text;
    }

    return node;
  }

  function showStatus(message) {
    clearNode(content);
    var panel = create("section", "panel");
    panel.appendChild(create("p", "status-text", message));
    content.appendChild(panel);
  }

  function fetchJson(url) {
    return fetch(url).then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status + " for " + url);
      }

      return response.json();
    });
  }

  function loadCategories() {
    if (Array.isArray(state.categories)) {
      return Promise.resolve(state.categories);
    }

    return fetchJson("data/categories.json").then(function (payload) {
      var categories = payload.categories;

      if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error("Categories list is empty");
      }

      state.categories = categories;
      return categories;
    });
  }

  function buildCategoryCard(category) {
    var card = create("article", "category-card");
    var title = create("h3", "", category.name);
    var openLink = create("a", "category-link", "Відкрити категорію");
    var notesText = category.notes ? category.notes : "Без приміток.";
    var notes = create("p", "", notesText);

    openLink.href = "#category-" + category.shortname;
    openLink.dataset.action = "open-category";
    openLink.dataset.shortname = category.shortname;

    card.appendChild(title);
    card.appendChild(create("p", "", "ID: " + category.id));
    card.appendChild(create("p", "", "Службова назва: " + category.shortname));
    card.appendChild(notes);
    card.appendChild(openLink);

    return card;
  }

  function renderCatalog(categories) {
    clearNode(content);

    var panel = create("section", "panel");
    panel.appendChild(create("h2", "", "Категорії каталогу"));
    panel.appendChild(
      create(
        "p",
        "",
        "Обери категорію для завантаження позицій без оновлення сторінки."
      )
    );

    var grid = create("div", "catalog-grid");

    categories.forEach(function (category) {
      grid.appendChild(buildCategoryCard(category));
    });

    panel.appendChild(grid);

    var specials = create("a", "special-link", "Specials (випадкова категорія)");
    specials.href = "#specials";
    specials.dataset.action = "specials";
    panel.appendChild(specials);

    content.appendChild(panel);
  }

  function buildItemCard(item) {
    var card = create("article", "item-card");
    var image = document.createElement("img");

    image.className = "item-image";
    image.width = 200;
    image.height = 200;
    image.loading = "lazy";
    image.alt = item.name;
    image.src =
      "https://placehold.co/200x200/e2e8f0/111827?text=" +
      encodeURIComponent(item.shortname);

    card.appendChild(image);
    card.appendChild(create("h3", "", item.name));
    card.appendChild(create("p", "", item.description));
    card.appendChild(create("p", "", "Shortname: " + item.shortname));
    card.appendChild(create("p", "item-price", "Ціна: " + item.price));

    return card;
  }

  function renderCategory(category, items, fromSpecials) {
    clearNode(content);

    var panel = create("section", "panel");
    var titleText = fromSpecials
      ? "Specials: " + category.name
      : "Категорія: " + category.name;

    panel.appendChild(create("h2", "", titleText));
    panel.appendChild(create("p", "", "ID: " + category.id));
    panel.appendChild(create("p", "", "Службова назва: " + category.shortname));
    panel.appendChild(
      create("p", "", category.notes || "Примітки відсутні для цієї категорії.")
    );

    var backLink = create("a", "inline-link", "Повернутися до каталогу");
    backLink.href = "#catalog";
    backLink.dataset.action = "catalog";
    panel.appendChild(backLink);

    content.appendChild(panel);

    var grid = create("section", "items-grid");

    items.forEach(function (item) {
      grid.appendChild(buildItemCard(item));
    });

    content.appendChild(grid);
  }

  function loadCategoryItems(shortname) {
    return fetchJson("data/" + shortname + ".json").then(function (payload) {
      if (!Array.isArray(payload.items)) {
        throw new Error("Items list is invalid for " + shortname);
      }

      return payload;
    });
  }

  function openCategory(shortname, fromSpecials) {
    showStatus("Завантаження категорії...");

    return loadCategories()
      .then(function (categories) {
        var category = categories.find(function (entry) {
          return entry.shortname === shortname;
        });

        if (!category) {
          throw new Error("Category not found: " + shortname);
        }

        return loadCategoryItems(shortname).then(function (payload) {
          renderCategory(category, payload.items, fromSpecials);
        });
      })
      .catch(function (error) {
        showStatus("Не вдалося завантажити категорію. " + error.message);
      });
  }

  function openCatalog() {
    showStatus("Завантаження каталогу...");

    return loadCategories()
      .then(function (categories) {
        renderCatalog(categories);
      })
      .catch(function (error) {
        showStatus("Не вдалося завантажити каталог. " + error.message);
      });
  }

  function openSpecials() {
    showStatus("Формуємо Specials...");

    return loadCategories()
      .then(function (categories) {
        var randomIndex = Math.floor(Math.random() * categories.length);
        var randomCategory = categories[randomIndex];

        return openCategory(randomCategory.shortname, true);
      })
      .catch(function (error) {
        showStatus("Не вдалося відкрити Specials. " + error.message);
      });
  }

  catalogLink.addEventListener("click", function (event) {
    event.preventDefault();
    openCatalog();
  });

  content.addEventListener("click", function (event) {
    var target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    var link = target.closest("a[data-action]");

    if (!link) {
      return;
    }

    event.preventDefault();

    var action = link.dataset.action;

    if (action === "open-category") {
      openCategory(link.dataset.shortname, false);
      return;
    }

    if (action === "specials") {
      openSpecials();
      return;
    }

    if (action === "catalog") {
      openCatalog();
    }
  });

  openCatalog();
})();
