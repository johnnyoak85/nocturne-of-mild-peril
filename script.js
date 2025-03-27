const TEXT_SPEED = 20;
const FADE_IN_SPEED = 75;

const ERROR_MESSAGE = "The adventure has hit a snag. Please try again later.";

const STORY_TEXT = "story-text";
const CHOICES = "choices";

let currentStep = "1";
let typingInterval;

async function loadStep(stepFile) {
  try {
    const response = await fetch(`steps/${stepFile}.json`);
    const stepData = await response.json();

    // Clear existing content
    document.getElementById(STORY_TEXT).innerHTML = "";
    document.getElementById(CHOICES).innerHTML = "";

    // Start typewriter effect
    typewriterEffect(stepData.summary, stepData.choices);
  } catch (error) {
    console.error("Error loading step:", error);
    document.getElementById(STORY_TEXT).innerHTML = ERROR_MESSAGE;
  }
}

function typewriterEffect(text, choices) {
  const storyElement = document.getElementById(STORY_TEXT);
  let index = 0;

  // Clear any existing animation
  clearInterval(typingInterval);

  typingInterval = setInterval(() => {
    storyElement.innerHTML = text.slice(0, index);
    index++;

    if (index > text.length) {
      clearInterval(typingInterval);
      showChoices(choices);
    }
  }, TEXT_SPEED);
}

function showChoices(choices) {
  const choicesContainer = document.getElementById(CHOICES);

  choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.textContent = choice.text;
    button.style.transitionDelay = `${index * 0.1}s`;
    button.onclick = () => {
      currentStep = choice.next;
      loadStep(choice.next);
    };

    choicesContainer.appendChild(button);
    // Trigger fade-in
    setTimeout(() => {
      button.style.opacity = "1";
    }, FADE_IN_SPEED);
  });
}

// Start the game
loadStep(currentStep);
