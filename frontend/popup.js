document.addEventListener("DOMContentLoaded", () => {
    const selectedTextElement = document.getElementById("selected-text");
    const responseElement = document.getElementById("response");
    const askBtn = document.getElementById("ask-btn");
    const copyBtn = document.getElementById("copy-btn");
    const speakBtn = document.getElementById("speak-btn");
    const loader = document.getElementById("loader");
    const modeSelector = document.getElementById("mode");
  
    // Load selected text
    chrome.storage.local.get("selectedText", ({ selectedText }) => {
      selectedTextElement.textContent = selectedText || "No text selected.";
    });
  
    askBtn.addEventListener("click", async () => {
      chrome.storage.local.get("selectedText", async ({ selectedText }) => {
        if (!selectedText) {
          responseElement.textContent = "Please highlight text on a page first.";
          return;
        }
  
        const mode = modeSelector.value;
        const prompt = buildPrompt(selectedText, mode);
  
        loader.classList.remove("hidden");
        responseElement.textContent = "";
        copyBtn.classList.add("hidden");
        speakBtn.classList.add("hidden");
  
        try {
          const res = await fetch("http://localhost:5000/gemini", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
          });
  
          const data = await res.json();
          const output = data.response || "No response from AI.";
  
          responseElement.textContent = output;
          copyBtn.classList.remove("hidden");
          speakBtn.classList.remove("hidden");
        } catch (error) {
          console.error("Error:", error);
          responseElement.textContent = "Error connecting to AI.";
        } finally {
          loader.classList.add("hidden");
        }
      });
    });
  
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(responseElement.textContent).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
      });
    });
  
    speakBtn.addEventListener("click", () => {
      const text = responseElement.textContent;
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    });
  
    function buildPrompt(text, mode) {
      switch (mode) {
        case "simplify":
          return `Explain this in a way a 5th grader would understand:\n\n${text}`;
        case "meme":
          return `Explain this in a fun, meme-style way with humor:\n\n${text}`;
        case "explain":
        default:
          return `Explain this in simple terms:\n\n${text}`;
      }
    }
  });
  