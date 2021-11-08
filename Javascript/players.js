let container = document.querySelector(".Player_container");
let row = document.querySelector(".row");

//Player ID
let id = null;
//Check if user only writes one space
let onespace = false;

//These are used to uncapitalize names and check
let firstNameCheck = "";
let lastNameCheck = "";

let userinput = document.querySelector("#userinput");
let urlNBA = `http://data.nba.net/data/10s/prod/v1/2021/players.json`;

let table = document.querySelector("#table");
table.style.display = "none";
let player_prof = document.querySelector("#player_profile");
player_prof.style.display = "none";
let search = document.querySelector(".form-group");

userinput.addEventListener("input", handleinput);

//Search input
function handleinput(event) {
  //If we already have onespace disallow it
  if (event.data === " " && userinput.value.includes(" ") && onespace) {
    userinput.value = userinput.value.slice(0, -1);
    return;
  }
  //Don't allow user to enter space to start search
  else if (event.data === " " && userinput.value[0] === " ") {
    userinput.value = userinput.value.slice(0, -1);
    return;
  }
  //If we encounter a space then make sure we set it to true
  //so we can only allow one space
  if (event.data === " ") onespace = true;
  //if we don't have a space in our search then we can allow one now
  if (!userinput.value.includes(" ")) onespace = false;

  //Seperate the first and last name
  if (userinput.value.indexOf(" ") !== -1) {
    firstNameCheck = userinput.value.substring(
      0,
      userinput.value.indexOf(" ") - 1
    );
    lastNameCheck = userinput.value.substring(
      userinput.value.indexOf(" ") + 1,
      userinput.value.length - 1
    );
  } else {
    firstNameCheck = userinput.value;
    lastNameCheck = "";
  }
  if (lastNameCheck == " ") lastNameCheck = "";

  fetchprofile(urlNBA);
}

//let urlNBA = `https://data.nba.net/data/10s/prod/v1/current/standings_conference.json`;
let fetchprofile = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.league.standard);
      row.remove();
      row = document.createElement("div");
      row.setAttribute("class", "row mt-2 g-3");
      container.append(row);

      //We want to check when both search and names from api match
      firstNameCheck = firstNameCheck.toLowerCase();
      lastNameCheck = lastNameCheck.toLowerCase();
      data.league.standard.forEach((element) => {
        let FirstNamelowercase = element.firstName.toLowerCase();
        let LastNamelowercase = element.lastName.toLowerCase();

        //Check if player is active and that we match what we are looking for
        if (
          (element.isActive &&
            FirstNamelowercase.includes(firstNameCheck) &&
            LastNamelowercase.includes(lastNameCheck)) ||
          (element.isActive &&
            FirstNamelowercase.includes(lastNameCheck) &&
            LastNamelowercase.includes(firstNameCheck))
        ) {
          let row_of_cards = document.createElement("div");

          row_of_cards.setAttribute("class", "col-6 col-md-6 col-lg-4");
          row.append(row_of_cards);
          let card = document.createElement("div");
          card.setAttribute("class", "card");
          card.setAttribute("id", element.personId);

          //Event occurs when user clicks on card
          card.addEventListener("click", handleClick);
          row_of_cards.append(card);
          let img = document.createElement("img");

          img.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${element.personId}.png`;
          img.alt = `Media day picture of ${element.firstName} ${element.lastName}`;
          card.append(img);

          let body = document.createElement("div");
          body.setAttribute("class", "card-body");
          row_of_cards.append(body);

          let player_name = document.createElement("h3");
          player_name.setAttribute("class", "card-title");
          player_name.textContent = element.firstName + " " + element.lastName;
          body.append(player_name);
        }
      });
      let player_card = document.querySelectorAll(".card");

      for (let i = 0; i < player_card.length; ++i) {
        player_card[i].addEventListener("click", handleClick);
      }

      /*
      //This is when we want display standings for each conference


      console.log(data.league.standard.conference.east);
      let east = data.league.standard.conference.west;
      east.forEach((element) => {
        let img = document.createElement("img");
        img.width = 100;
        img.src = `https://cdn.nba.com/logos/nba/${element.teamId}/primary/L/logo.svg`;
        document.querySelector("#body").append(img);
      });
      */
    })
    .catch((error) => console.log(error));
};
fetchprofile(urlNBA);

let val = null;
function handleOptionSelection(event) {
  val = this.value;
}
//When we click on player card we want to show player profile
function handleClick(event) {
  //id = event.path[1].id;

  let graph = document.querySelector("#Graph_option");
  console.log(graph.value);
  graph.addEventListener("input", handleOptionSelection);
  if (val != null) console.log(val);

  //Get player ID so we can access/find information for that player
  id = this.id;
  table.style.display = "block";
  search.style.display = "none";
  player_prof.style.display = "flex";
  row.remove();
  let urlPlayerStats = `https://data.nba.net/data/10s/prod/v1/2021/players/${id}_profile.json`;
  fetch(urlNBA)
    .then((response) => response.json())
    .then((data) => {
      //Find player and start displaying his Information
      data.league.standard.forEach((element) => {
        if (element.personId == id) {
          console.log(element.firstName);
          row.remove();
          let info_section = document.querySelector("#player_info");

          let player_image = document.createElement("img");

          player_image.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${element.personId}.png`;

          let team_image = document.createElement("img");
          team_image.src = `https://cdn.nba.com/logos/nba/${element.teamId}/primary/D/logo.svg`;
          //Just temporary use CSS instead
          //Just add classes for player images and team images
          if (window.screen.width < 600) {
            player_image.width = 130;
            player_image.height = 95;
            team_image.width = 75;
          } else {
            team_image.width = 150;
          }
          info_section.append(player_image);

          info_section.append(team_image);

          let h1 = document.createElement("h1");
          h1.textContent = `${element.firstName} ${element.lastName}`;
          info_section.append(h1);
        }
      });
      return fetch(urlPlayerStats);
    })
    .then((response) => response.json())
    .then((data) => {
      let playerSeasonStats = data.league.standard.stats.regularSeason.season;
      console.log("STATS", data.league.standard.stats.regularSeason.season);
      //We have fetched stats and now want to look through the various seasons
      //and display them in a table
      playerSeasonStats.forEach((element) => {
        console.log(element.seasonYear);
        let Tablerows = document.querySelector("#tableRows");
        let season_row = document.createElement("tr");
        Tablerows.append(season_row);
        let td = document.createElement("td");
        td.textContent = `${element.seasonYear}`;
        td.id = "season_Column";
        season_row.append(td);
        td.style.fontWeight = "bold";

        let GP_td = document.createElement("td");
        GP_td.textContent = `${element.total.gamesPlayed}`;
        season_row.append(GP_td);

        let GS_td = document.createElement("td");
        GS_td.textContent = `${element.total.gamesStarted}`;
        season_row.append(GS_td);

        let Min_td = document.createElement("td");
        Min_td.textContent = `${element.total.mpg}`;
        season_row.append(Min_td);

        let PTS_td = document.createElement("td");
        PTS_td.textContent = `${element.total.ppg}`;
        season_row.append(PTS_td);

        let AST_td = document.createElement("td");
        AST_td.textContent = `${element.total.apg}`;
        season_row.append(AST_td);

        let REB_td = document.createElement("td");
        REB_td.textContent = `${element.total.rpg}`;
        season_row.append(REB_td);

        let BLK_td = document.createElement("td");
        BLK_td.textContent = `${element.total.bpg}`;
        season_row.append(BLK_td);

        let STL_td = document.createElement("td");
        STL_td.textContent = `${element.total.spg}`;
        season_row.append(STL_td);

        let TO_td = document.createElement("td");
        TO_td.textContent = `${element.total.topg}`;
        season_row.append(TO_td);

        let FT_td = document.createElement("td");
        FT_td.textContent = `${element.total.ftp}`;
        season_row.append(FT_td);

        let FG_td = document.createElement("td");
        FG_td.textContent = `${element.total.fgp}`;
        season_row.append(FG_td);
      });
    })
    .catch((error) => console.log(error));
  console.log(id);
}
