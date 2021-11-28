document.cookie = "cross-site-cookie=bar; SameSite=None Secure";

//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
let date = document.querySelector("#Date");

let leftPointButton = document.createElement("Button");

leftPointButton.innerHTML = "<";
leftPointButton.style.marginRight = "80px";
leftPointButton.setAttribute("class", "pointsDate");
date.append(leftPointButton);

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
date_input.min = `${current_year}-10-19`;
date_input.max = `${current_year + 1}-04-10`;
date_input.id = "Game_date";
date_input.value = datetmp;
date_input.onkeydown = (e) => e.preventDefault();

date.append(date_input);

let RightPointButton = document.createElement("Button");
RightPointButton.innerHTML = ">";
RightPointButton.style.marginLeft = "80px";
RightPointButton.setAttribute("class", "pointsDate");
date.append(RightPointButton);

date_input.addEventListener("input", handleDate);

leftPointButton.addEventListener("click", handleLeftPoint);
RightPointButton.addEventListener("click", handleRightPoint);

let date_chosen = null;

function PicImageError(imgError) {
  imgError.src = "../images/Blank_Profile.png";
}

function handleLeftPoint() {
  date_input.stepDown();
  handleDate();
}
function handleRightPoint() {
  date_input.stepUp();
  handleDate();
}

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
        if (data.games.length === 0) {
          h1 = document.createElement("h1");
          h1.style.color = "white";
          h1.textContent = "No Games Scheduled";
          document.getElementById("Games").append(h1);
        } else {
          data.games.forEach((element) => {
            //Game time, broadcast, status
            let info = null;
            if (!element.isGameActivated && element.gameDuration.hours === "") {
              if (element.startTimeEastern === "") info = "TBD";
              else info = element.startTimeEastern;
              if (element.watch.broadcast.broadcasters.national.length === 0) {
                info += `<br/> League Pass`;
              } else {
                info += `<br/> ${element.watch.broadcast.broadcasters.national[0].shortName}`;
              }
            } else {
              info = `${element.vTeam.score} - ${element.hTeam.score}`;
              if (element.isGameActivated && element.period.isHalftime)
                info += "<br/> Halftime";
              else if (
                element.isGameActivated &&
                element.period.isEndOfPeriod
              ) {
                if (element.period.current > 4) {
                  info += `<br/> OT${element.period.current - 4} Ended`;
                } else info += `<br/> Q${element.period.current} Ended`;
              } else if (
                element.isGameActivated &&
                element.period.current === 4 &&
                element.clock === ""
              )
                info += `<br/> Final`;
              else if (element.isGameActivated) {
                if (element.period.current > 4)
                  info += `<br/> OT${element.period.current - 4} ${
                    element.clock
                  }`;
                else
                  info += `<br/> Q${element.period.current} ${element.clock}`;
              } else info += `<br/> Final`;
            }

            let gamedetails = `<b>City:</b> ${element.arena.city}<br/><b>Arena:</b> ${element.arena.name}<br/>`;
            if (element.attendance !== "" && element.attendance !== "0")
              gamedetails += `<b>Game Attendance:</b> ${element.attendance}<br/>`;
            gamedetails += `<a href='${element.tickets.leagGameInfo}'><b>Purchase Tickets</b></a><br/>`;
            let section = document.createElement("section");
            section.innerHTML = `<div class="col-12"> 
          <button
            type="button"
            class="btn btn-primary shadow-none"
            id=${element.gameId}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal${element.gameId}"
          >
            <figure>
              <img
                src="https://cdn.nba.com/logos/nba/${element.vTeam.teamId}/primary/D/logo.svg"
                width="100"
                height="100"
                alt="${element.vTeam.triCode} Logo"
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
                alt="${element.hTeam.triCode} Logo"
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
                  alt="${element.vTeam.triCode} Logo"
                  height="100"/> @ <img
                  src="https://cdn.nba.com/logos/nba/${element.hTeam.teamId}/primary/D/logo.svg"
                  alt="${element.hTeam.triCode} Logo"
                  width="100"
                  height="100"/>${element.hTeam.triCode} </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">${gamedetails}
                <div id=ModalBody${element.gameId}></div>
                </div>
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
        }
      })
      .catch((error) => console.log(error));
  }
}
handleDate();

let vclick = false;
let hclick = false;

function handleClick() {
  vclick = false;
  hclick = false;

  console.log(this.id);
  let ModalBody = document.getElementById(`ModalBody${this.id}`);

  //ModalBody.innerHTML = "MOOO";

  let dateChosen = date_input.value.replaceAll("-", "");
  let boxscoreURL = `http://data.nba.net/data/10s/prod/v1/${dateChosen}/${this.id}_boxscore.json`;
  fetch(boxscoreURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.stats !== undefined) {
        console.log(data);
        let hteamId = data.basicGameData.hTeam.teamId;
        ModalBody.innerHTML = `
        <h5 id="LeadersLabel">Team Leaders</h5>
        <div class="leaders">
        <figure>
          <figcaption class="LeaderNames">${data.stats.hTeam.leaders.points.players[0].firstName} ${data.stats.hTeam.leaders.points.players[0].lastName}</figcaption>
          <img class ="leadersPic" alt="Picture of Home Team point leader ${data.stats.hTeam.leaders.points.players[0].firstName} ${data.stats.hTeam.leaders.points.players[0].lastName}"id="leaderhomePoints"src = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${data.stats.hTeam.leaders.points.players[0].personId}.png" />
        </figure>
        <p class="hLeader">${data.stats.hTeam.leaders.points.value}</p><p class="LeaderPoints">PTS</p><p class="vLeader">${data.stats.vTeam.leaders.points.value}</p>
        <figure>
          <figcaption class="LeaderNames">${data.stats.vTeam.leaders.points.players[0].firstName} ${data.stats.vTeam.leaders.points.players[0].lastName}</figcaption>
          <img class ="leadersPic" alt=" Picture of Visitor Team point leader ${data.stats.vTeam.leaders.points.players[0].firstName} ${data.stats.vTeam.leaders.points.players[0].lastName}"src = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${data.stats.vTeam.leaders.points.players[0].personId}.png"/>
        </figure>
        </div>
        <div class="leaders">
        
        <figure>
          <figcaption class="LeaderNames">${data.stats.hTeam.leaders.assists.players[0].firstName} ${data.stats.hTeam.leaders.assists.players[0].lastName}</figcaption> 
          <img class ="leadersPic" alt="Picture of Home Team assists leader ${data.stats.hTeam.leaders.assists.players[0].firstName} ${data.stats.hTeam.leaders.assists.players[0].lastName}"src = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${data.stats.hTeam.leaders.assists.players[0].personId}.png"/>
        </figure>
        <p class="hLeader">${data.stats.hTeam.leaders.assists.value}</p><p class="LeaderAssists">ASTS</p><p class="vLeader">${data.stats.vTeam.leaders.assists.value}</p>
        <figure>
          <figcaption class="LeaderNames">${data.stats.vTeam.leaders.assists.players[0].firstName} ${data.stats.vTeam.leaders.assists.players[0].lastName}</figcaption> 
          <img class ="leadersPic" alt ="Picture of Visitor Team assists leader ${data.stats.vTeam.leaders.assists.players[0].firstName} ${data.stats.vTeam.leaders.assists.players[0].lastName}"src = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${data.stats.vTeam.leaders.assists.players[0].personId}.png"/>
        </figure>
        </div>
        <div class="leaders"> 
        <figure>
          <figcaption class="LeaderNames">${data.stats.hTeam.leaders.rebounds.players[0].firstName} ${data.stats.hTeam.leaders.rebounds.players[0].lastName}</figcaption>
          <img class ="leadersPic" alt="Picture of Home Team rebounds leader ${data.stats.hTeam.leaders.rebounds.players[0].firstName} ${data.stats.hTeam.leaders.rebounds.players[0].lastName}"src = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${data.stats.hTeam.leaders.rebounds.players[0].personId}.png"/>
        </figure>
        <p class="hLeader">${data.stats.hTeam.leaders.rebounds.value}</p><p class="LeaderRebounds">REBS</p><p class="vLeader">${data.stats.vTeam.leaders.rebounds.value}</p>
        <figure>
          <figcaption class="LeaderNames">${data.stats.vTeam.leaders.rebounds.players[0].firstName} ${data.stats.vTeam.leaders.rebounds.players[0].lastName}</figcaption>
          <img class ="leadersPic" alt="Picture of Visitor Team rebounds leader ${data.stats.vTeam.leaders.rebounds.players[0].firstName} ${data.stats.vTeam.leaders.rebounds.players[0].lastName}"src = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${data.stats.vTeam.leaders.rebounds.players[0].personId}.png"/>
        </figure>
        </div>
        <h5 id="BoxscoreLabel"><br/>BOXSCORE:</h5>
        <button type="button" class="btn btn-dark" id='vTeam${this.id}'>${data.basicGameData.vTeam.triCode}</button>
        <button type="button" class="btn btn-dark" id='hTeam${this.id}'>${data.basicGameData.hTeam.triCode}</button> 
      <div class="Teams" id="HomeTable${this.id}">

        <div class="TeamStats">
          <img src="https://cdn.nba.com/logos/nba/${data.basicGameData.hTeam.teamId}/primary/D/logo.svg"
            alt="${data.basicGameData.hTeam.triCode} Team Logo"
            width="100"
            height="100"
         />
        ${data.basicGameData.hTeam.triCode}
        </div>
      <table cellpadding="15">
      <!-- HEADING OF TABLE -->
      <thead>
        <tr id="header-row">
          <th>Player</th>
          <th>MIN</th>
          <th>PTS</th>
          <th>AST</th>
          <th>REB</th>
          <th>BLK</th>
          <th>STL</th>
          <th>FTM</th>
          <th>FTA</th>
          <th>FT%</th>
          <th>FGM</th>
          <th>FGA</th>
          <th>FG%</th>
          <th>TO</th>
          <th>PF</th>
        </tr>
      </thead>
      <!-- FILL THE BODY OF TABLE WITH ROWS -->
      <tbody id="HomeTeamrows${this.id}"></tbody>
    </table>
    </div>
    <div class="Teams" id="VisitorTable${this.id}">
      <div class="TeamStats">
        <img src="https://cdn.nba.com/logos/nba/${data.basicGameData.vTeam.teamId}/primary/D/logo.svg"
        alt="${data.basicGameData.vTeam.triCode} Team Logo"
        width="100"
        height="100"
        />
      ${data.basicGameData.vTeam.triCode}
      </div>
    <table cellpadding="15">
      <!-- HEADING OF TABLE -->
      <thead>
        <tr id="header-row">
          <th>Player</th>
          <th>MIN</th>
          <th>PTS</th>
          <th>AST</th>
          <th>REB</th>
          <th>BLK</th>
          <th>STL</th>
          <th>FTM</th>
          <th>FTA</th>
          <th>FT%</th>
          <th>FGM</th>
          <th>FGA</th>
          <th>FG%</th>
          <th>TO</th>
          <th>PF</th>
        </tr>
      </thead>
      <!-- FILL THE BODY OF TABLE WITH ROWS -->
      <tbody id="VisterTeamrows${this.id}"></tbody>
    </table>
    </div>`;
        let team = null;
        let boxscoreShowBtn = document.querySelectorAll(".btn.btn-dark");
        for (let i = 0; i < boxscoreShowBtn.length; ++i) {
          boxscoreShowBtn[i].addEventListener("click", handleBoxscorebutton);
        }
        data.stats.activePlayers.forEach((element) => {
          if (element.teamId === hteamId) {
            team = document.getElementById(`HomeTeamrows${this.id}`);
          } else {
            team = document.getElementById(`VisterTeamrows${this.id}`);
          }
          if (element.dnp === "") {
            team.innerHTML += `
          <tr>
          <td><b>#${element.jersey} ${element.firstName} ${element.lastName}</b></td>
          <td>${element.min}</td>
          <td>${element.points}</td>
          <td>${element.assists}</td>
          <td>${element.totReb}</td>
          <td>${element.blocks}</td>
          <td>${element.steals}</td>
          <td>${element.ftm}</td>
          <td>${element.fta}</td>
          <td>${element.ftp}</td>
          <td>${element.fgm}</td>
          <td>${element.fga}</td>
          <td>${element.fgp}</td>
          <td>${element.turnovers}</td>
          <td>${element.pFouls}</td>
          </tr>`;
          }
        });
        /*
        let element = null;
        if (this.id.slice(0,5)) element = data.stats.hTeam.totals;
        else element = data.stats.vTeam.totals;
        */
        let element = null;
        element = data.stats.hTeam.totals;
        team = document.getElementById(`HomeTeamrows${this.id}`);
        for (let i = 0; i < 2; ++i) {
          team.innerHTML += `
            <tr>
            <td><b>Total</b></td>
            <td>${element.min}</td>
            <td>${element.points}</td>
            <td>${element.assists}</td>
            <td>${element.totReb}</td>
            <td>${element.blocks}</td>
            <td>${element.steals}</td>
            <td>${element.ftm}</td>
            <td>${element.fta}</td>
            <td>${element.ftp}</td>
            <td>${element.fgm}</td>
            <td>${element.fga}</td>
            <td>${element.fgp}</td>
            <td>${element.turnovers}</td>
            <td>${element.pFouls}</td>
            </tr>`;
          element = data.stats.vTeam.totals;
          team = document.getElementById(`VisterTeamrows${this.id}`);
        }
      }
    })
    .catch((error) => console.log(error));
}

function handleBoxscorebutton() {
  let Team = this.id.slice(0, 5);
  let GameID = this.id.slice(5, this.id.length);
  console.log(this.id);
  // console.log(this.id.slice(5, this.id.length));

  let vtable = document.getElementById(`VisitorTable${GameID}`);
  let htable = document.getElementById(`HomeTable${GameID}`);
  if (Team === "vTeam") {
    //If we clicked and want to show
    if (!vclick) {
      vtable.style.display = "block";
      htable.style.display = "none";
      hclick = false;
      vclick = true;
    } else {
      vtable.style.display = "none";
      vclick = false;
    }
    /*
    vtable.style.display = "block";
    htable.style.display = "none";
    */
  } else if (Team === "hTeam") {
    if (!hclick) {
      htable.style.display = "block";
      vtable.style.display = "none";
      vclick = false;
      hclick = true;
    } else {
      htable.style.display = "none";
      hclick = false;
    }

    /*
    htable.style.display = "block";
    vtable.style.display = "none";
    */
  } else {
    vtable.style.display = "none";
    htable.style.display = "none";
  }
  /*
  if (Team === "vTeam") {
    
    table = document.getElementById(`VisitorTable${GameID}`);
    console.log(table.style.display.value);
    
   //If it is clicked
    if (!vclick) {
      table.style.display = "block";
      vclick = true;
    } else {
      table.style.display = "none";
      vclick = false;
    }
  }
  if (Team === "hTeam") {
    table = document.getElementById(`HomeTable${GameID}`);
    console.log(table.style.display.value);
    if (!hclick) {
      table.style.display = "block";
      hclick = true;
    } else {
      table.style.display = "none";
      hclick = false;
    }
  }
  */
}
