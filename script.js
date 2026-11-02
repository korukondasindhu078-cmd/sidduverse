
document.addEventListener("DOMContentLoaded", function () {
  const enterButton = document.getElementById("enterButton");
  const intro = document.querySelector(".intro");
  const universe = document.getElementById("universe");
  const progress = document.getElementById("progress");

  let discovered = [];

  enterButton.addEventListener("click", function () {
    intro.hidden = true;
    universe.hidden = false;
  });

  document.querySelectorAll(".planet-card").forEach(function (planet) {
    planet.addEventListener("click", function () {
      const name = planet.dataset.planet;

      if (name === "NOVA") {
        alert("This destination is classified. Discover the other four worlds first!");
        return;
      }

      if (!discovered.includes(name)) {
        discovered.push(name);
        progress.textContent = discovered.length + " / 4";
      }

      alert(name + " discovered! More secrets await inside this world.");
    });
  });
});
