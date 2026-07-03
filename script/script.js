const searchForm = document.querySelector(".search-bar");
const searchInput = document.querySelector("#product-search");
const clearButton = document.querySelector("#product-search-clear");
const emptyMessage = document.querySelector("#search-empty");
const productCards = [...document.querySelectorAll(".product-card")];
const detailLinks = [...document.querySelectorAll('a[href^="#detalhe-"]')];
const modals = [...document.querySelectorAll(".modal")];
const modalCloseTriggers = [...document.querySelectorAll(".modal-close, .modal-backdrop")];
let activeModal = null;
let viewerImages = [];
let viewerIndex = 0;

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

const openModal = (modal) => {
  if (!modal) {
    return;
  }

  activeModal?.classList.remove("is-open");
  activeModal = modal;
  activeModal.classList.add("is-open");
  document.body.classList.add("modal-open");
};

const closeModal = () => {
  activeModal?.classList.remove("is-open");
  activeModal = null;
  document.body.classList.remove("modal-open");

  if (window.location.hash.startsWith("#detalhe-")) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
};

detailLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const modal = document.querySelector(link.getAttribute("href"));

    if (!modal) {
      return;
    }

    event.preventDefault();
    openModal(modal);
  });
});

modalCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    closeModal();
  });
});

const imageViewer = document.createElement("div");
imageViewer.className = "image-viewer";
imageViewer.innerHTML = `
  <button class="image-viewer-close" type="button">✕ Fechar</button>
  <button class="image-viewer-nav image-viewer-prev" type="button" aria-label="Imagem anterior">Anterior</button>
  <img alt="">
  <button class="image-viewer-nav image-viewer-next" type="button" aria-label="Proxima imagem">Proxima</button>
`;
document.body.appendChild(imageViewer);

const viewerImage = imageViewer.querySelector("img");
const viewerClose = imageViewer.querySelector(".image-viewer-close");
const viewerPrev = imageViewer.querySelector(".image-viewer-prev");
const viewerNext = imageViewer.querySelector(".image-viewer-next");

const showViewerImage = (index) => {
  if (!viewerImages.length) {
    return;
  }

  viewerIndex = (index + viewerImages.length) % viewerImages.length;
  const selectedImage = viewerImages[viewerIndex];

  viewerImage.src = selectedImage.src;
  viewerImage.alt = selectedImage.alt;
};

const changeViewerImage = (direction) => {
  showViewerImage(viewerIndex + direction);
};

const closeImageViewer = () => {
  imageViewer.classList.remove("is-open");
  viewerImage.removeAttribute("src");
  viewerImage.alt = "";
  viewerImages = [];
  viewerIndex = 0;
};

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    const clickedImage = event.target.closest(".modal-img, .image-gallery img");

    if (!clickedImage) {
      return;
    }

    viewerImages = [...modal.querySelectorAll(".modal-img, .image-gallery img")];
    showViewerImage(viewerImages.indexOf(clickedImage));
    imageViewer.classList.add("is-open");
  });
});

imageViewer.addEventListener("click", (event) => {
  if (event.target === imageViewer) {
    closeImageViewer();
  }
});

viewerClose.addEventListener("click", closeImageViewer);
viewerPrev.addEventListener("click", () => changeViewerImage(-1));
viewerNext.addEventListener("click", () => changeViewerImage(1));

document.addEventListener("keydown", (event) => {
  const viewerIsOpen = imageViewer.classList.contains("is-open");

  if (viewerIsOpen && event.key === "ArrowLeft") {
    changeViewerImage(-1);
    return;
  }

  if (viewerIsOpen && event.key === "ArrowRight") {
    changeViewerImage(1);
    return;
  }

  if (event.key === "Escape") {
    if (viewerIsOpen) {
      closeImageViewer();
      return;
    }

    closeModal();
  }
});
