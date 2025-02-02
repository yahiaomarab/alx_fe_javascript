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

  // Load quotes from localStorage
  function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    quotes = storedQuotes; // Load quotes into the array
  }

  // Populate categories dropdown
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

  // Filter quotes based on selected category
  function filterQuotes() {
    const selectedCategory = categoriesSelection.value;
    return selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);
  }

  // Display a random quote
  function showRandomQuote() {
    const filteredQuotes = filterQuotes();

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

    const newQuote = { text, category };

    quotes.push(newQuote);

    newQuoteText.value = "";
    newQuoteCategory.value = "";

    const quoteElement = document.createElement("p");
    quoteElement.textContent = `"${newQuote.text}" - ${newQuote.category}`;
    addedQuoteContainer.appendChild(quoteElement);

    if (save) {
      saveQuotes();
    }
  
    if (
      ![...categoriesSelection.options].some(
        (option) => option.value === category
      )
    ) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoriesSelection.appendChild(option);
    }
    postQuoteToServer(newQuote.text, newQuote.category);

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

  // Fetch quotes from the server
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.map((item) => ({ text: item.title, category: "default" }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  function syncDataWithServer() {
    fetchQuotesFromServer().then((serverQuotes) => {
      if (serverQuotes.length > 0) {
        serverQuotes.forEach((serverQuote) => {
          const exists = quotes.some(
            (quote) =>
              quote.text === serverQuote.text && quote.category === serverQuote.category
          );
          if (!exists) {
            quotes.push(serverQuote);
          }
        });
        saveQuotes();
        populateCategories(); // Ensure categories are updated after sync
        alert("Data synchronized with the server.");
      } else {
        alert("No new data from the server.");
      }
    });
  }
  
  function postQuoteToServer(text, category) {
    const newQuote = { text, category };

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuote),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("New quote posted:", data);
      })
      .catch((error) => {
        console.error("Error posting quote:", error);
      });
  }

  setInterval(syncDataWithServer, 1 * 60 * 1000);
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
