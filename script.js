const screens = {
  intro: document.getElementById("intro"),
  welcome: document.getElementById("welcome"),
  universe: document.getElementById("universe"),
  planet: document.getElementById("planetView")
};

function showScreen(name) {
  Object.values(screens).forEach(screen => {
    screen.classList.add("hidden");
  });

  screens[name].classList.remove("hidden");
}

document.getElementById("enterButton").addEventListener("click", () => {
  showScreen("welcome");
});

document.getElementById("mapButton").addEventListener("click", () => {
  showScreen("universe");
});

const planets = {
  origin: {
    label: "WORLD 01 // PERSONALITY ARCHIVE",
    title: "ORIGIN",
    description: "Every universe begins somewhere. This one begins with its most interesting explorer. Discover the little details, familiar habits and unexpected facts that make this world unique."
  },
  echo: {
    label: "WORLD 02 // MEMORY ARCHIVE",
    title: "ECHO",
    description: "Some moments leave traces long after they pass. This world holds fragments of memories, little stories and moments worth revisiting."
  },
  unknown: {
    label: "WORLD 03 // UNCHARTED TERRITORY",
    title: "UNKNOWN",
    description: "Not every secret reveals itself immediately. Look closer, solve the clues and see what you can uncover in this unexplored world."
  },
  signal: {
    label: "WORLD 04 // INCOMING TRANSMISSION",
    title: "SIGNAL",
    description: "A message is travelling across the universe. Hidden somewhere in this world are signals meant for one particular explorer."
  },
  nova: {
    label: "WORLD 05 // FINAL DESTINATION",
    title: "NOVA",
    description: "You've reached the final destination. The universe has one last surprise waiting for you."
  }
};

const discovered = new Set();
const fragmentCount = document.getElementById("fragmentCount");
const planetCards = document.querySelectorAll(".planet-card");

planetCards.forEach(card => {
  card.addEventListener("click", () => {
    const name = card.dataset.planet;

    if (name === "nova" && discovered.size < 4) {
      return;
    }

    const planet = planets[name];

    document.getElementById("planetLabel").textContent = planet.label;
    document.getElementById("planetTitle").textContent = planet.title;
    document.getElementById("planetDescription").textContent = planet.description;

    const discoverButton = document.getElementById("discoverButton");

    if (name === "nova") {
      discoverButton.textContent = "ENTER THE FINAL WORLD →";
      discoverButton.disabled = false;
    } else if (discovered.has(name)) {
      discoverButton.textContent = "FRAGMENT COLLECTED ✓";
      discoverButton.disabled = true;
    } else {
      discoverButton.textContent = "DISCOVER FRAGMENT →";
      discoverButton.disabled = false;
    }

    showScreen("planet");
  });
});

document.getElementById("discoverButton").addEventListener("click", () => {
  const title = document.getElementById("planetTitle").textContent;
  const name = title.toLowerCase();

  if (name === "nova") {
    document.getElementById("planetLabel").textContent =
      "MISSION COMPLETE // BIRTHDAY TRANSMISSION";
    document.getElementById("planetTitle").textContent = "HAPPY BIRTHDAY";
    document.getElementById("planetDescription").textContent =
      "Explorer, you've made it to the end of this little universe. But the best part of every journey is the story it leaves behind.";
    document.getElementById("discoverButton").classList.add("hidden");
    return;
  }

  if (!discovered.has(name)) {
    discovered.add(name);
    fragmentCount.textContent =
      String(discovered.size).padStart(2, "0") + " / 04";
  }

  if (discovered.size === 4) {
    const nova = document.querySelector('[data-planet="nova"]');
    nova.classList.remove("locked");
    nova.querySelector(".planet-number").textContent = "WORLD 05 // UNLOCKED";
    nova.querySelector("small").textContent = "The final destination awaits";
    nova.querySelector(".lock-symbol").textContent = "↗";
  }

  document.getElementById("discoverButton").classList.add("hidden");
});

document.getElementById("backButton").addEventListener("click", () => {
  document.getElementById("discoverButton").classList.remove("hidden");
  showScreen("universe");
});
