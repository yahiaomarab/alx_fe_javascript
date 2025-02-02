document.addEventListener("DOMContentLoaded", () => {
  let quotes = []; // Use 'let' to modify the quotes array

  // Element references
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  const addQuoteButton = document.getElementById("addQuote");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  const addedQuoteContainer = document.getElementById("added-quote");
  const inputFile = document.getElementById("importFile");
  const exportQuotesButton = document.getElementById("exportQuotes");
  const categoriesSelection = document.getElementById("categoryFilter");

  function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    quotes = storedQuotes; // Load quotes into the array
  }

  function populateCategories() {
    categoriesSelection.innerHTML = '<option value="all">All</option>';

    const categories = [...new Set(quotes.map((quote) => quote.category))];

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoriesSelection.appendChild(option);
    });
  }

  function showRandomQuote() {
    const selectedCategory = categoriesSelection.value;
    const filteredQuotes =
      selectedCategory === "all"
        ? quotes
        : quotes.filter((quote) => quote.category === selectedCategory);

    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available for this category.";
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
  }

  // Add a new quote
  function createAddQuoteForm(save = true) {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
      alert("Please fill out both fields.");
      return;
    }

    // Create a new quote object
    const newQuote = { text, category };

    // Add the new quote to the array
    quotes.push(newQuote);

    // Clear the input fields
    newQuoteText.value = "";
    newQuoteCategory.value = "";

    // Display the newly added quote
    const quoteElement = document.createElement("p");
    quoteElement.textContent = `"${newQuote.text}" - ${newQuote.category}`;
    addedQuoteContainer.appendChild(quoteElement);

    // Save the new quote to localStorage
    if (save) {
      saveQuotes();
    }

    if (![...categoriesSelection.options].some(option => option.value === category)) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoriesSelection.appendChild(option);
    }

    alert("New quote added!");
  }

  // Export quotes as JSON
  function exportQuotes() {
    const jsonData = JSON.stringify(quotes, null, 2); // Format the JSON for readability
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes); // Add imported quotes to the existing quotes array
          saveQuotes(); // Save updated quotes to localStorage
          populateCategories(); // Update categories in the dropdown
          alert("Quotes imported successfully!");
        } else {
          alert("Invalid JSON format.");
        }
      } catch (error) {
        alert("Failed to parse JSON. Please try again.");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // Event listeners
  newQuoteButton.addEventListener("click", showRandomQuote);
  addQuoteButton.addEventListener("click", () => {
    createAddQuoteForm();
  });
  exportQuotesButton.addEventListener("click", exportQuotes);
  inputFile.addEventListener("change", importFromJsonFile);
  categoriesSelection.addEventListener("change", showRandomQuote);
  loadQuotes();
  populateCategories();
  showRandomQuote();
});
