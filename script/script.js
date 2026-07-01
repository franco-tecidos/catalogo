const searchForm = document.querySelector(".search-bar");
const searchInput = document.querySelector("#product-search");
const clearButton = document.querySelector("#product-search-clear");
const emptyMessage = document.querySelector("#search-empty");
const productCards = [...document.querySelectorAll(".product-card")];

const normalizeText = (value) => {
  return value
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const filterProducts = () => {
  const searchTerm = normalizeText(searchInput.value);
  let visibleCount = 0;

  productCards.forEach((card) => {
    const productName = card.querySelector("h3")?.textContent || "";
    const isVisible = normalizeText(productName).includes(searchTerm);

    card.hidden = !isVisible;
    if (isVisible) {
      visibleCount += 1;
    }
  });

  emptyMessage.hidden = visibleCount > 0;
};

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  filterProducts();
});

searchInput?.addEventListener("input", () => {
  if (!searchInput.value) {
    filterProducts();
  }
});

clearButton?.addEventListener("click", () => {
  searchInput.value = "";
  filterProducts();
  searchInput.focus();
});
