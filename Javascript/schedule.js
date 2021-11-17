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
console.log(date.value);
let tmp = new Date();

let datetmp = `${tmp.getFullYear()}-`;
datetmp += `${tmp.getMonth() + 1}-`;
datetmp += `${tmp.getDate()}`;
console.log(datetmp);

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear
let current_year = new Date().getFullYear();
let date_input = document.createElement("input");
date_input.type = "date";
date_input.min = `${current_year}-01-01`;
date_input.max = `${current_year + 1}-12-31`;
date_input.id = "Game_date";
date_input.value = datetmp;

date.append(date_input);

date_input.addEventListener("input", handleDate);
let date_chosen = null;

function handleDate() {
  let games = document.getElementById("Games") === null;
  if (!games) {
    document.getElementById("Games").remove();
    let gameDiv = document.createElement("div");
    gameDiv.id = "Games";
    document.getElementById("body").append(gameDiv);
  }
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
          //Game time, broadcast, status
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
            if (element.isGameActivated && element.period.isHalftime)
              info += "<br/> Halftime";
            else if (element.isGameActivated && element.period.isEndOfPeriod)
              info += `<br/> Q${element.period.current} Ended`;
            else if (element.isGameActivated)
              info += `<br/> Q${element.period.current} ${element.clock}`;
            else info += `<br/> Final`;
          }

          let gamedetails = `<b>City:</b> ${element.arena.city}<br/><b>Arena:</b> ${element.arena.name}<br/>`;
          if (element.attendance !== "")
            gamedetails += `<b>Game Attendance:</b> ${element.attendance}<br/>`;
          gamedetails += `<a href='${element.tickets.leagGameInfo}'><b>Tickets</b></a><br/>`;
          let section = document.createElement("section");
          section.innerHTML = `<div class="col-12"> 
          <button
            type="button"
            class="btn btn-primary"
            id=${element.gameId}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal${element.gameId}"
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
            id="exampleModal${element.gameId}"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header" id=${element.gameId}>
                  <h5 class="modal-title" id="exampleModalLabel">
                  ${element.vTeam.triCode}<img
                  src="https://cdn.nba.com/logos/nba/${element.vTeam.teamId}/primary/D/logo.svg"
                  width="100"
                  height="100"/> @ <img
                  src="https://cdn.nba.com/logos/nba/${element.hTeam.teamId}/primary/D/logo.svg"
                  width="100"
                  height="100"/>${element.hTeam.triCode} </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">${gamedetails}<div id=ModalBody${element.gameId}></div></div>
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
        let btn = document.querySelectorAll(".btn.btn-primary");
        console.log(btn);

        for (let i = 0; i < btn.length; ++i) {
          btn[i].addEventListener("click", handleClick);
        }
      })
      .catch((error) => console.log(error));
  }
}
handleDate();

function handleClick() {
  console.log(this.id);
  let ModalBody = document.getElementById(`ModalBody${this.id}`);

  //ModalBody.innerHTML = "MOOO";

  let dateChosen = date_input.value.replaceAll("-", "");
  let boxscoreURL = `http://data.nba.net/data/10s/prod/v1/${dateChosen}/${this.id}_boxscore.json`;
  fetch(boxscoreURL)
    .then((response) => response.json())
    .then((data) => {
      if (data.stats !== undefined) {
        console.log(data);
        let hteamId = data.basicGameData.hTeam.teamId;
        let vteamId = data.basicGameData.vTeam.teamId;
        ModalBody.innerHTML = `<table cellpadding="15" id="HomeTable">
      <!-- HEADING OF TABLE -->
      <thead>
        <tr id="header-row">
          <th id="season_Column">Season</th>
          <th>Player</th>
          <th>MIN</th>
          <th>PTS</th>
          <th>AST</th>
          <th>REB</th>
          <th>BLK</th>
          <th>STL</th>
          <th>FTA</th>
          <th>FTM</th>
          <th>FT%</th>
          <th>FGA</th>
          <th>FGM</th>
          <th>FG%</th>
          <th>TO</th>
          <th>PF</th>
        </tr>
      </thead>
      <!-- FILL THE BODY OF TABLE WITH ROWS -->
      <tbody id="tableRows"></tbody>
    </table>`;
      }
    })
    .catch((error) => console.log(error));
}
