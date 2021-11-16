/*
let months = document.querySelector("#months");
let days = document.querySelector("#Days");

//Add days
for (let i = 1; i < 32; ++i) {
  let tmp = document.createElement("option");
  tmp.value = `${i}`;
  tmp.textContent = `${i}`;
  days.append(tmp);
}

for (let i = 1; i < 13; ++i) {
  let tmp = document.createElement("option");
  tmp.value = `${i}`;
  tmp.textContent = `${i}`;
  months.append(tmp);
}
*/

//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
let date = document.querySelector("#Date");
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear
let current_year = new Date().getFullYear();
let date_input = document.createElement("input");
date_input.type = "date";
date_input.min = `${current_year}-01-01`;
date_input.max = `${current_year + 1}-12-31`;
date_input.id = "Game_date";
date.append(date_input);

date_input.addEventListener("input", handleDate);
let date_chosen = null;

/*
let img = document.createElement("img");
img.src = "https://cdn.nba.com/logos/nba/1610612757/primary/D/logo.svg";
document.querySelector(
  "#btnModal"
).innerHTML = `<img src="https://cdn.nba.com/logos/nba/1610612757/primary/D/logo.svg" width='200px'height='200px'/>`;
*/

function handleDate() {
  document.getElementById("Games").remove();
  let gameDiv = document.createElement("div");
  gameDiv.id = "Games";
  document.getElementById("body").append(gameDiv);
  console.log(date_input.value.replaceAll("-", ""));
  // BOXSCORE URL = http://data.nba.net/data/10s/prod/v1/{data}/{game_Id}_boxscore.json
  //Make sure we aren't checking the same date as previous
  if (date_chosen !== date_input.value.replaceAll("-", "")) {
    date_chosen = date_input.value.replaceAll("-", "");
    let url = `http://data.nba.net/data/10s/prod/v1/${date_chosen}/scoreboard.json`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.games.forEach((element) => {
          let info = null;
          if (!element.isGameActivated && element.gameDuration.hours === "") {
            info = element.startTimeEastern;
            if (element.watch.broadcast.broadcasters.national.length === 0) {
              info += `<br/> League Pass`;
            } else {
              info += `<br/> ${element.watch.broadcast.broadcasters.national[0].shortName}`;
            }
          } else {
            info = `${element.vTeam.score} - ${element.hTeam.score}`;
            if (element.isGameActivated)
              info += `<br/> Q${element.period.current} ${element.clock}`;
          }
          let section = document.createElement("section");
          section.innerHTML = `<div class="col-12"> 
          <button
            type="button"
            class="btn btn-primary"
            id="${element.gameId}"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <figure>
              <img
                src="https://cdn.nba.com/logos/nba/${element.vTeam.teamId}/primary/D/logo.svg"
                width="100"
                height="100"
                class="img_class"
              />
              <figcaption>${element.vTeam.win}-${element.vTeam.loss}</figcaption>
              
            </figure>
            <p id="atCharacter">${info}<p/>
            <figure>
              <img
                src="https://cdn.nba.com/logos/nba/${element.hTeam.teamId}/primary/D/logo.svg"
                width="100"
                height="100"
                class="img_class"
              />
              <figcaption>${element.hTeam.win}-${element.hTeam.loss}</figcaption>
            </figure>
          </button>
    
          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">...</div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
          document.getElementById("Games").append(section);
        });
        console.log(data);
      })
      .catch((error) => console.log(error));
  }
}
