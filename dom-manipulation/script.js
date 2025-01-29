const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" },
  ];
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  
  const addQuoteButton = document.getElementById("addQuote");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  function showRandomQuote() {
    if (quotes.length ==0) {
        quoteDisplay.textContent = 'no Quotes available';
        return ;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `${randomQuote.text} - ${randomQuote.category}`;
  }
  
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
  
    if (text === "" || category === "") {
      alert("Please fill out both fields.");
      return;
    }
  
    quotes.push({ text, category });
  
    newQuoteText.value = "";
    newQuoteCategory.value = "";
  
    alert("New quote added!");
  }
  
  newQuoteButton.addEventListener("click", showRandomQuote);
  addQuoteButton.addEventListener("click", addQuote);
  