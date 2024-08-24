let currentPage = 1;
const graphicsPerPage = 48;
const category = getQueryParam("category");

let filteredgraphics = graphics;
let data = shuffle(graphics);

const graphicsButton = document.getElementById("graphics");
const imagesButton = document.getElementById("images");
const fontsButton = document.getElementById("fonts");

const buttons = document.querySelectorAll(".button-container .btn");

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    // Remove 'active' class from all buttons
    buttons.forEach((btn) => btn.classList.remove("active"));

    // Add 'active' class to the clicked button
    this.classList.add("active");
  });
  if (!category) {
    graphicsButton.classList.add("active");
  }
  if (category === "images") {
    filteredgraphics = images;
    data = images;
    imagesButton.classList.add("active");
  } else if (category === "fonts") {
    filteredgraphics = fonts;
    data = fonts;
    fontsButton.classList.add("active");
  }
});

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function getRandomItem(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("The input must be a non-empty array.");
  }
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

document.addEventListener("DOMContentLoaded", () => {
  rendergraphics();
  createNav();
  console.log("Document loaded");
});

function rendergraphics() {
  const graphicsContainer = document.getElementById("graphics-container");
  graphicsContainer.innerHTML = "";

  const start = (currentPage - 1) * graphicsPerPage;
  const end = start + graphicsPerPage;
  let currentGraphics = filteredgraphics.slice(start, end);

  currentGraphics.forEach((graphic) => {
    const graphicCard = document.createElement("div");
    graphicCard.className = "graphic-card";
    if (category === "fonts") {
      graphicCard.style.height = "auto";
    }

    // Use a placeholder image URL
    const placeholderImage = "./imgs/loading.svg"; // Replace with your placeholder image URL

    const imgElement = document.createElement("img");
    imgElement.src = placeholderImage;
    imgElement.alt = graphic.title;

    // Add the placeholder image class
    imgElement.classList.add("placeholder-image");

    // Create a function to handle loading the actual image
    function loadImage() {
      const actualImage = new Image();
      actualImage.src = graphic.images[0];
      actualImage.onload = () => {
        imgElement.src = actualImage.src;
        // Remove the placeholder class if needed
        imgElement.classList.remove("placeholder-image");
      };
      actualImage.onerror = (error) => {
        imgElement.src = "./imgs/icon.ico";
        graphicCard.style.height = "200px";
        // console.log(`Error: ${error}`);
      };
    }
    if (category === "fonts") {
      imgElement.classList.add("card-font");
    }
    // Attach an event listener to load the actual image when the placeholder is loaded
    imgElement.onload = loadImage;

    // Construct the rest of the graphic card
    graphicCard.innerHTML = `
      <h3>${graphic.title}</h3>
      <small>${graphic.file_size}</small>
      <small><a href='${graphic.download_link}' target="_blank" download>Download</a></small>
    `;

    graphicCard.insertBefore(imgElement, graphicCard.firstChild);

    // Attach the click event listener to the image
    imgElement.addEventListener("click", () => {
      openModal(graphic.images, 0); // Pass the full image array and the initial index
    });

    graphicsContainer.appendChild(graphicCard);
  });

  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredgraphics.length / graphicsPerPage);

  // Hide pagination if total items are less than graphicsPerPage
  if (totalPages <= 1) {
    return;
  }

  const range = 1; // Number of pages to show before and after the current page
  const startPages = totalPages > 3 ? 2 : 1; // show the first 3 pages if (condition)
  const endPages = totalPages > 3 ? 2 : 1; // show the last 3 pages if (condition)

  function createButton(page) {
    const button = document.createElement("button");
    button.innerText = page;
    if (page === currentPage) {
      button.style.backgroundColor = "#333";
      button.style.color = "white";
    }
    button.addEventListener("click", () => {
      currentPage = page;
      rendergraphics();
    });
    pagination.appendChild(button);
  }

  // Create "Prev" button
  const prevButton = document.createElement("button");
  prevButton.innerText = "Prev";
  if (currentPage > 1) {
    prevButton.addEventListener("click", () => {
      currentPage--;
      rendergraphics();
    });
  } else {
    prevButton.disabled = true;
  }
  pagination.appendChild(prevButton);

  // Show the first few pages
  for (let i = 1; i <= Math.min(startPages, totalPages); i++) {
    createButton(i);
  }

  // Show "..." before the current page range if necessary
  if (currentPage > startPages + range + 1) {
    const ellipsis = document.createElement("span");
    ellipsis.innerText = "...";
    pagination.appendChild(ellipsis);
  }

  // Show the range around the current page
  const start = Math.max(startPages + 1, currentPage - range);
  const end = Math.min(totalPages - endPages, currentPage + range);

  for (let i = start; i <= end; i++) {
    // Avoid duplicating the already shown pages
    if (i > startPages && i <= totalPages - endPages) {
      createButton(i);
    }
  }

  // Show "..." after the current page range if necessary
  if (currentPage < totalPages - endPages - range) {
    const ellipsis = document.createElement("span");
    ellipsis.innerText = "...";
    pagination.appendChild(ellipsis);
  }

  // Show the last few pages
  for (
    let i = Math.max(totalPages - endPages + 1, end + 1);
    i <= totalPages;
    i++
  ) {
    createButton(i);
  }

  // Create "Next" button
  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  if (currentPage < totalPages) {
    nextButton.addEventListener("click", () => {
      currentPage++;
      rendergraphics();
    });
  } else {
    nextButton.disabled = true;
  }
  pagination.appendChild(nextButton);
}

// Search functionality
const searchBtn = document.getElementById("search");
searchBtn.placeholder = "Search In Graphics | Logo Mockup, Menus...etc";
if (category === "images") {
  searchBtn.placeholder = "Search In Images | Lion, Elephant...etc";
} else if (category === "fonts") {
  searchBtn.placeholder = "Search In Fonts...";
}

searchBtn.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  if (!query) {
    rendergraphics();
    return; // Exit early if query is empty
  }

  // Split the query into individual words
  const queryWords = query.split(/\s+/); // Split by whitespace

  filteredgraphics = data.filter((graphic) => {
    // Use optional chaining and nullish coalescing to handle possible null values
    return queryWords.every((word) => {
      return (
        (graphic.title?.toLowerCase() ?? "").includes(word) ||
        (graphic.category?.toLowerCase() ?? "").includes(word)
      );
    });
  });

  currentPage = 1; // Reset to first page
  rendergraphics();
});

// Show the button when the user scrolls down 20px from the top
window.onscroll = function () {
  if (
    document.body.scrollTop > 1000 ||
    document.documentElement.scrollTop > 1000
  ) {
    scrollToTopBtn.style.display = "flex";
  } else {
    scrollToTopBtn.style.display = "none";
  }
};

// When the user clicks on the button, scroll to the top of the document
scrollToTopBtn.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
let imageUrls = [];
let currentImageIndex = 0;

function openModal(images, initialIndex = 0) {
  imageUrls = images;
  currentImageIndex = initialIndex;

  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const prevButton = document.getElementById("modal-prev");
  const nextButton = document.getElementById("modal-next");

  // Placeholder image URL
  const placeholderImageUrl = "./imgs/loading.svg"; // Replace with your actual placeholder image path

  // Function to update the modal image
  function updateImage(index) {
    if (imageUrls.length > 0) {
      currentImageIndex = index;
      const imageUrl = imageUrls[currentImageIndex];
      if (imageUrl) {
        modalImage.src = placeholderImageUrl;
        modalImage.onload = function () {
          modalImage.src = imageUrl; // Replace with the real image once it's loaded
        };
        if (category === "fonts") {
          modalImage.classList.add("font-image");
        } else {
          modalImage.classList.remove("font-image");
        }
        recenterImage();
        updateNavigationButtons();
      } else {
        console.error("Unable to load image at index:", currentImageIndex);
      }
    }
  }

  // Function to recenter the image
  function recenterImage() {
    const scale = 1;
    if (category === "fonts") {
      modalImage.style.transform = `translate(0px, 50%) scale(${scale})`;
    } else {
      modalImage.style.transform = `translate(0px, 0px) scale(${scale})`;
    }
  }

  // Function to update navigation button visibility
  function updateNavigationButtons() {
    prevButton.style.display = currentImageIndex > 0 ? "block" : "none";
    nextButton.style.display =
      currentImageIndex < imageUrls.length - 1 ? "block" : "none";
  }

  // Function to navigate images
  function navigateImage(direction) {
    const newIndex = currentImageIndex + direction;
    if (newIndex >= 0 && newIndex < imageUrls.length) {
      updateImage(newIndex);
    }
  }

  // Initialize with the first image
  updateImage(currentImageIndex);

  // Attach click events for navigation buttons
  prevButton.addEventListener("click", () => navigateImage(-1));
  nextButton.addEventListener("click", () => navigateImage(1));

  // Close modal on clicking outside the image
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Show the modal
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

document.getElementById("close").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    document.getElementById("modal").style.display = "none";
  }
});

function createNav() {
  const navbar = document.getElementById("navbar");
  const footer = document.getElementsByTagName("footer")[0];
  const navStructure = {
    Mockups: [],
    Templates: [],
    Others: [], // Will be replaced with the rest of the categories
  };

  // Populate the nav structure based on the category names
  filteredgraphics.forEach((item) => {
    if (item.category.includes("Mockups")) {
      navStructure["Mockups"].push(item);
    } else if (item.category.includes("Templates")) {
      navStructure["Templates"].push(item);
    } else {
      if (!navStructure[item.category]) {
        navStructure[item.category] = [];
      }
      navStructure[item.category].push(item);
    }
  });

  function createNavItem(label, links) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = `${label} (${links.length})`; // Add count of items
    a.href = "#"; // Prevents the default link behavior

    a.addEventListener("click", () => {
      // Remove "active" class from all other nav items
      const navItems = document.querySelectorAll("#navbar a");
      navItems.forEach((item) => item.classList.remove("active"));

      // Add "active" class to the clicked item
      a.classList.add("active");

      // Update the filtered graphics and reset to the first page
      filteredgraphics = links;
      currentPage = 1;
      rendergraphics();
    });

    li.appendChild(a);
    return li;
  }

  // Add the nav items to the navbar
  Object.keys(navStructure).forEach((key) => {
    if (navStructure[key].length > 0) {
      navbar.appendChild(createNavItem(key, navStructure[key]));
    }
  });
  footer.style.display = "block";
}
