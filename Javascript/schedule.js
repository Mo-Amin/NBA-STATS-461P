//Mohamed-Amin Cheaito 2021

//Where most of date info came from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
//Date section
let date = document.querySelector("#Date");

//Left arrow which should take us to previous day
let leftPointButton = document.createElement("Button");

leftPointButton.innerHTML = "<";
leftPointButton.style.marginRight = "80px";
leftPointButton.setAttribute("class", "pointsDate");
date.append(leftPointButton);

console.log(date.value);

let tmp = new Date();

//Get current date and set it as our default value
let datetmp = `${tmp.getFullYear()}-`;

//getMonth = 0-11
if (tmp.getMonth() < 9) {
  datetmp += `0${tmp.getMonth() + 1}-`;
} else {
  datetmp += `${tmp.getMonth() + 1}-`;
}
//getDate = 1-31
if (tmp.getDate() < 10) {
  datetmp += `0${tmp.getDate()}`;
} else {
  datetmp += `${tmp.getDate()}`;
}
console.log(datetmp);

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear

let current_year = 2021;

//Set attributes of the date input
let date_input = document.createElement("input");
date_input.type = "date";
date_input.min = `${current_year}-10-19`;
date_input.max = `${current_year + 1}-04-10`;
date_input.id = "Game_date";
date_input.value = datetmp;
//Don't allow user to enter anything, can only click on calendar and choose from there
date_input.onkeydown = (e) => e.preventDefault();

date.append(date_input);

//Right arrow which should take us to next day
let RightPointButton = document.createElement("Button");
RightPointButton.innerHTML = ">";
RightPointButton.style.marginLeft = "80px";
RightPointButton.setAttribute("class", "pointsDate");
date.append(RightPointButton);

//Make sure we account for When user clicks on date input
date_input.addEventListener("input", handleDate);

//Accounting for when user clicks on arrows
leftPointButton.addEventListener("click", handleLeftPoint);
RightPointButton.addEventListener("click", handleRightPoint);

let date_chosen = null;

/*
function PicImageError(imgError) {
  imgError.src = "../images/Blank_Profile.png";
}
*/

//When user clicks on left arrow, go back a day depending on what day we are currently on
function handleLeftPoint() {
  date_input.stepDown();
  handleDate();
}
//When user clicks on right arrow, go to the next day
function handleRightPoint() {
  date_input.stepUp();
  handleDate();
}

//When user clicks on date make sure we handle it and if it changes
//make sure to add the corresponding games for that day.
function handleDate() {
  //Check if we currently have games on page
  let games = document.getElementById("Games") === null;
  //If existent remove and readd the div element
  if (!games) {
    document.getElementById("Games").remove();
    let gameDiv = document.createElement("div");
    gameDiv.id = "Games";
    document.getElementById("body").append(gameDiv);
  }

  //Make sure we aren't checking the same date as previous
  if (date_chosen !== date_input.value.replaceAll("-", "")) {
    date_chosen = date_input.value.replaceAll("-", "");
    let url = `https://data.nba.net/data/10s/prod/v1/${date_chosen}/scoreboard.json`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //If we don't have games then display message
        if (data.games.length === 0) {
          h1 = document.createElement("h1");
          h1.style.color = "white";
          h1.textContent = "No Games Scheduled";
          document.getElementById("Games").append(h1);
        }
        //We do have games for this day so display them
        else {
          //Used later to attain unique IDs
          let count = 0;
          //Go through each game
          data.games.forEach((element) => {
            //Game information - time, broadcast, status etc.
            let info = null;

            //Game has not yet started so display time and broadcast
            if (!element.isGameActivated && element.gameDuration.hours === "") {
              if (element.startTimeEastern === "") info = "TBD";
              else info = element.startTimeEastern;
              if (element.watch.broadcast.broadcasters.national.length === 0) {
                info += `<br/> League Pass`;
              } else {
                info += `<br/> ${element.watch.broadcast.broadcasters.national[0].shortName}`;
              }
            }
            //Game is live or has finished
            else {
              //Display score
              info = `${element.vTeam.score} - ${element.hTeam.score}`;
              //If we are in an active game and halftime flag is true then display halfime
              if (element.isGameActivated && element.period.isHalftime)
                info += "<br/> Halftime";
              //If game is activated but we have ended a period then say it has ended.
              else if (
                element.isGameActivated &&
                element.period.isEndOfPeriod
              ) {
                //Check if we are in overtime
                if (element.period.current > 4) {
                  info += `<br/> OT${element.period.current - 4} Ended`;
                }
                //No write to show Q2 ended
                else if (element.period.current === 2) {
                  info += "<br/> Halftime";
                }
                //If API forgot to set gameactivated flag to false then enter
                else if (element.period.current === 4) {
                  if (element.vTeam.score !== element.hTeam.score) {
                    info += `<br/> Final`;
                  }
                } else info += `<br/> Q${element.period.current} Ended`;
              }
              //If the game has ended display final
              else if (
                element.isGameActivated &&
                element.period.current === 4 &&
                element.clock === ""
              )
                info += `<br/> Final`;
              //If game is activated and we haven't reached any case above
              //then game is going on currently so display the period it is on and time left in the period
              else if (element.isGameActivated) {
                if (element.period.current > 4)
                  info += `<br/> OT${element.period.current - 4} ${
                    element.clock
                  }`;
                else
                  info += `<br/> Q${element.period.current} ${element.clock}`;
              }
              //Just a safe case, If nothing has been reached game is final
              else info += `<br/> Final`;
            }

            //Details of the game that will be displayed within the popup
            let gamedetails = `<b>City:</b> ${element.arena.city}<br/><b>Arena:</b> ${element.arena.name}<br/>`;
            if (element.attendance !== "" && element.attendance !== "0")
              gamedetails += `<b>Game Attendance:</b> ${element.attendance}<br/>`;

            if (
              element.attendance === "" &&
              element.clock === "" &&
              element.gameDuration.hours === "" &&
              element.gameDuration.minutes === ""
            )
              gamedetails += `<a href='${element.tickets.leagGameInfo}'><b>Purchase Tickets</b></a><br/>`;
            let section = document.createElement("section");

            //Add the game info within a button in a section element.
            //Includes Logos, and info of game from info variable above.

            //Add the popup and add the details to the body from the gamedetails variable above
            //Includes, logos within title and details of game within body.
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
            <p class="atCharacter">${info}<p/>
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
            aria-labelledby="exampleModalLabel${count}"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel${count}">
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
            //Add count in order to have unique IDs
            ++count;
            //Add this game section within the games element existent within html
            //Will be adding all games within this Games element.
            document.getElementById("Games").append(section);
          });

          console.log(data);
          //Get each game section that we added from above foreach
          let btn = document.querySelectorAll(".btn.btn-primary");

          //Make sure event occurs (call handleClick function) when we click on the game section
          for (let i = 0; i < btn.length; ++i) {
            btn[i].addEventListener("click", handleClick);
          }
        }
      })
      .catch((error) => console.log(error));
  }
}

//We call it first thing in order to get the games for the default/Current date
handleDate();

//These are used for the boxscore buttons to help
//distinguish which one user clicked.
let vclick = false;
let hclick = false;

function handleClick() {
  //Reset the boxscore clicks since we entered a new popup
  vclick = false;
  hclick = false;

  //GameID
  console.log(this.id);
  let ModalBody = document.getElementById(`ModalBody${this.id}`);

  //Make sure we remove the - characters in order to meet api requirements
  let dateChosen = date_input.value.replaceAll("-", "");
  let boxscoreURL = `https://data.nba.net/data/10s/prod/v1/${dateChosen}/${this.id}_boxscore.json`;
  fetch(boxscoreURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      //Make sure there is data for each category
      if (
        data.stats !== undefined &&
        (data.stats.vTeam.leaders.points.value === "0" ||
          data.stats.hTeam.leaders.points.value === "0" ||
          data.stats.vTeam.leaders.rebounds.value === "0" ||
          data.stats.hTeam.leaders.rebounds.value === "0" ||
          data.stats.vTeam.leaders.assists.value === "0" ||
          data.stats.hTeam.leaders.assists.value === "0")
      ) {
        ModalBody.innerHTML = `<h5 class="LeadersLabel"><br/>No data for this game yet! Check Back Later!</h5>`;
      }
      //Make sure we have stats for game
      else if (data.stats !== undefined) {
        console.log(data);
        //Will be used later to see if we display home or visitor boxscore
        let hteamId = data.basicGameData.hTeam.teamId;
        //Add the point,rebound, and assist leaders with pictures and values
        //Add the table headers for boxscore for home/visitor teams
        ModalBody.innerHTML = `
        <h5 class="LeadersLabel"><br/>Team Leaders</h5>
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
        <tr class="header-row">
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
        <tr class="header-row">
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

        //We have two buttons for home/visitor team make sure we have an event occuring
        //When those buttons are called.
        let boxscoreShowBtn = document.querySelectorAll(".btn.btn-dark");
        for (let i = 0; i < boxscoreShowBtn.length; ++i) {
          boxscoreShowBtn[i].addEventListener("click", handleBoxscorebutton);
        }
        //Go through active players and add their data to their teams tables(boxscore)
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

        let element = null;

        //We added each active players stats now we must add the total stats combined for the team in the last row.
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

//Must handle box score buttons clicked and will determine which team boxscore to display
function handleBoxscorebutton() {
  //We assigned the table ids to visitorTable/hometable and their gameID

  //So the first 5 characters will help determine the team we will be displaying
  let Team = this.id.slice(0, 5);
  let GameID = this.id.slice(5, this.id.length);
  console.log(this.id);
  // console.log(this.id.slice(5, this.id.length));

  //Allows us to easily show/hide the tables(boxscores)
  let vtable = document.getElementById(`VisitorTable${GameID}`);
  let htable = document.getElementById(`HomeTable${GameID}`);

  //If user clicked visitor team enter
  if (Team === "vTeam") {
    //If visitor isn't already clicked user wants to show the table
    if (!vclick) {
      vtable.style.display = "block";
      htable.style.display = "none";
      hclick = false;
      vclick = true;
    }
    //If it has already been clicked then user wants to hide table
    else {
      vtable.style.display = "none";
      vclick = false;
    }
  }
  //If user clicked home team enter
  else if (Team === "hTeam") {
    //If home isn't already clicked user wants to show the table
    if (!hclick) {
      htable.style.display = "block";
      vtable.style.display = "none";
      vclick = false;
      hclick = true;
    }
    //If it has already been clicked then user wants to hide table
    else {
      htable.style.display = "none";
      hclick = false;
    }
  }
  //Safe case to hide both tables
  else {
    vtable.style.display = "none";
    htable.style.display = "none";
  }
}
