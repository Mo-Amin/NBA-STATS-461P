//Mohamed-Amin Cheaito 2021

//Player Container
let container = document.querySelector(".Player_container");
//Row of players
let row = document.querySelector(".row");

//Player ID
let id = null;
//Check if user only writes one space
let onespace = false;

//These are used to uncapitalize names and check
let firstNameCheck = "";
let lastNameCheck = "";

let userinput = document.querySelector("#userinput");
let urlNBA = `https://data.nba.net/data/10s/prod/v1/2021/players.json`;

let table = document.querySelector("#table");
table.style.display = "none";
let player_prof = document.querySelector("#player_profile");
player_prof.style.display = "none";

let search = document.querySelector(".form-group");

//Colors for graph in player profile
let backgroundColors = [
  "rgba(54, 162, 235, 0.8)",
  "rgba(255, 206, 86, 0.8)",
  "rgba(255, 99, 132, 0.8)",
  "rgba(75, 192, 192, 0.8)",
  "rgba(153, 102, 255, 0.8)",
  "rgba(255, 159, 64, 0.8)",
  "rgba(199, 199, 199, 0.8)",
  "rgba(83, 102, 255, 0.8)",
  "rgba(40, 159, 64, 0.8)",
  "rgba(210, 199, 199, 0.8)",
  "rgba(78, 52, 199, 0.8)",
  "rgba(54, 162, 235, 0.8)",
  "rgba(255, 206, 86, 0.8)",
  "rgba(255, 99, 132, 0.8)",
  "rgba(75, 192, 192, 0.8)",
  "rgba(153, 102, 255, 0.8)",
  "rgba(255, 159, 64, 0.8)",
  "rgba(199, 199, 199, 0.8)",
  "rgba(83, 102, 255, 0.8)",
  "rgba(40, 159, 64, 0.8)",
  "rgba(210, 199, 199, 0.8)",
  "rgba(78, 52, 199, 0.8)",
];

let borderColors = [
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(255, 99, 132, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(159, 159, 159, 1)",
  "rgba(83, 102, 255, 1)",
  "rgba(40, 159, 64, 1)",
  "rgba(210, 199, 199, 1)",
  "rgba(78, 52, 199, 1)",
];

userinput.addEventListener("input", handleinput);

//Search input for a specific player
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
  //Don't allow just a space for last name
  if (lastNameCheck == " ") lastNameCheck = "";

  fetchprofile(urlNBA);
}

//Fetch all the players or a specific player
let fetchprofile = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.league.standard);
      //Remove whatever existed within rows before. Will be replaced by our searched results
      row.remove();
      //We will be adding result to a newly added row div element
      row = document.createElement("div");
      row.setAttribute("class", "row mt-2 g-3");
      container.append(row);

      //We want to check when both search input and names from api match
      firstNameCheck = firstNameCheck.toLowerCase();
      lastNameCheck = lastNameCheck.toLowerCase();

      //Go through the array that holds all of the players
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
          //Create a row of each player card and append it to row.
          let row_of_cards = document.createElement("div");

          row_of_cards.setAttribute("class", "col-6 col-md-6 col-lg-4");
          row.append(row_of_cards);

          //Create a card for each player that will be appended to the row_of_card element
          let card = document.createElement("div");
          card.setAttribute("class", "card");
          card.setAttribute("id", element.personId);
          //Event should occur when user clicks on card

          row_of_cards.append(card);

          //Player image appended to card
          let img = document.createElement("img");
          img.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${element.personId}.png`;
          img.alt = `Media day picture of ${element.firstName} ${element.lastName}`;
          img.cookie = "cross-site-cookie=bar; SameSite=None Secure";
          card.append(img);

          //Add a body to each card and append each players name to their
          //specific card
          let body = document.createElement("div");
          body.setAttribute("class", "card-body");
          row_of_cards.append(body);
          let player_name = document.createElement("h3");
          player_name.setAttribute("class", "card-title");
          player_name.textContent = element.firstName + " " + element.lastName;
          body.append(player_name);
        }
      });
      //Event MUST occur when user clicks on card, should take user to player's profile.
      let player_card = document.querySelectorAll(".card");

      for (let i = 0; i < player_card.length; ++i) {
        player_card[i].addEventListener("click", handleClick);
      }
    })
    .catch((error) => console.log(error));
};
//Must call this once in order to display all of the characters
//and when we add input to search bar it will call this function and filter out the players.
fetchprofile(urlNBA);

//The choice user picks based on options given in player profile,
//Make sure we handle it and add appropriate graph based on what user chose.
function handleOptionSelection(event) {
  //console.log(val);
  console.log(this.value);

  //Make sure user chose something
  if (this.value !== "None") {
    let urlPlayerStats = `https://data.nba.net/data/10s/prod/v1/2021/players/${id}_profile.json`;
    fetch(urlPlayerStats)
      .then((response) => response.json())
      .then((data) => {
        let playerSeasonStats = data.league.standard.stats.regularSeason.season;

        //These will be the data inputted within graph.
        let seasons = []; //Season number we are intrested in
        let seasonStats = []; //The stat for the specific season

        //We have fetched stats and now want to look through the various seasons
        //and display the chosen stat as a graph
        playerSeasonStats.forEach((element) => {
          //Push into season array, make sure it is converted to string
          seasons.push(String(element.seasonYear));
          ///Push into seasonStats array, make sure it is converted to float
          seasonStats.push(parseFloat(element.total[this.value]));
        });
        //Check if it is Not existent in html file
        let StatChart_Check = document.getElementById("StatChart") === null;
        let StatChart = null;
        //If it already exists then we must remove statChart element.
        if (!StatChart_Check) {
          StatChart = document.getElementById("StatChart");
          StatChart.remove();
        }
        //Recreate the statchart canvas element
        StatChart = document.createElement("canvas");
        StatChart.setAttribute("id", "StatChart");

        //Append it to graph section
        document.querySelector("#Graphs").append(StatChart);

        //https://www.chartjs.org/docs/2.8.0/general/fonts.html
        //Add various fonts, color and fontweight to graph
        Chart.defaults.global.defaultFontColor = "white";
        Chart.defaults.global.defaultFontSize = 16;
        Chart.defaults.global.defaultFontStyle = "bold";

        //Create Bar chart
        let chart = new Chart(StatChart, {
          type: "bar",
          data: {
            labels: seasons, //Season years
            datasets: [
              {
                label: this.value, //Stat user chose to graph
                data: seasonStats, //Stats for season years
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
              },
            ],
          },
          //Make sure graph data starts at 0, has a title, doesn't have a legend and font color is white
          options: {
            //https://www.chartjs.org/docs/2.8.0/
            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
            title: { display: true, text: `${this.value}` },
            legend: {
              display: false,

              label: {
                fontColor: "white",
              },
            },
          },
        });
        //http://jsfiddle.net/jyougo/sv2n4zdh/2/
        console.log(StatChart_Check);
      })
      .catch((error) => console.log(error));
  }
  //If user chose "No option selected" then remove graph and make sure nothing is displayed
  else {
    let StatChart_Check = document.getElementById("StatChart") === null;
    if (!StatChart_Check) {
      StatChart = document.getElementById("StatChart");
      StatChart.remove();
    }
  }
}
//When we click on player card we want to show player profile
function handleClick(event) {
  //When user choses what stat to graph make sure we call
  //handleOptionSelection function so we can graph the specific
  //stat for each season
  let graph = document.querySelector("#Graph_option");
  graph.addEventListener("input", handleOptionSelection);

  //Get player ID so we can access/find information for that player
  id = this.id;
  //We have entered player profile, so hide/remove the search bar, and player cards
  //and now we must only display the information for the player chosen.
  table.style.display = "block";
  search.style.display = "none";
  player_prof.style.display = "flex";
  row.remove();

  let urlPlayerStats = `https://data.nba.net/data/10s/prod/v1/2021/players/${id}_profile.json`;
  fetch(urlNBA)
    .then((response) => response.json())
    .then((data) => {
      //Find player and start displaying his Information
      console.log(data.league.standard);
      data.league.standard.forEach((element) => {
        if (element.personId == id) {
          console.log(element.firstName);

          //Add players name as the title of the popup (popup should be existent within html)
          let popup_title = document.querySelector(".modal-title");
          popup_title.textContent = `#${element.jersey} ${element.firstName} ${element.lastName}`;

          //Add player information to the body of popup
          let popup_body = document.querySelector(".modal-body");
          let str = `<b>Country:</b> ${element.country}<br/><br/><b>DOB (YYYY-MM-DD):</b> ${element.dateOfBirthUTC}<br/><br/><b>Position:</b> ${element.teamSitesOnly.posFull}<br/><br/><b>Height:</b> ${element.heightFeet}'${element.heightInches} (${element.heightMeters}m)<br/><br/><b>Weight:</b> ${element.weightPounds}lbs (${element.weightKilograms}kg)<br/><br/><b>HS/College/Pro:</b> ${element.collegeName}<br/><br/>`;
          str +=
            element.draft.pickNum === ""
              ? `<b>Draft:</b> Undrafted (<b>Debuted:</b> ${element.nbaDebutYear})<br/><br/>`
              : `<b>Draft:</b> ${element.draft.seasonYear} <b>R:</b> ${element.draft.roundNum} <b>Pick</b> ${element.draft.pickNum}<br/><br/>`;
          str += `<b>Professional Experience (Years):</b> ${element.yearsPro}<br/><br/><b>Teams:</b><br/>`;

          element.teams.forEach((team) => {
            str += `<img src='https://cdn.nba.com/logos/nba/${team.teamId}/primary/D/logo.svg' alt='${element.firstName} ${element.lastName} Team from ${team.seasonStart} to ${team.seasonEnd}' width='50px'/> --> <b>${team.seasonStart} - ${team.seasonEnd} </b><br/>`;
          });

          popup_body.innerHTML = str;

          //Player profile header
          let info_section = document.querySelector("#player_info");

          //Image of player
          let player_image = document.createElement("img");
          player_image.setAttribute("class", "PlayerProfilePic");
          player_image.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${element.personId}.png`;
          player_image.alt = `Picture of ${element.firstName} ${element.lastName} at Media day`;

          //Image of team that player plays for
          let team_image = document.createElement("img");
          team_image.setAttribute("class", "PlayerProfileTeamPic");
          if (element.teamId === "") {
            element.teamId = element.teams[element.teams.length - 1].teamId;
          }
          team_image.src = `https://cdn.nba.com/logos/nba/${element.teamId}/primary/D/logo.svg`;
          team_image.alt = `Picture of the team ${element.firstName} ${element.lastName} is on`;

          //Add the player image as a btn that allows the popup to occur.
          document.querySelector("#btnModal").append(player_image);

          //Add team image to the player information header
          info_section.append(team_image);

          //Add quick and visible information about player to the header.
          //These are on top of the page onto the side of the images, exist in popup
          //but are just there to not have to dig through popup for important info about player
          let profile_information = document.createElement("div");
          profile_information.setAttribute("id", "Player_Profile_info");
          info_section.append(profile_information);

          let h1 = document.createElement("h1");
          h1.setAttribute("id", "Player_Profile_Name");

          h1.textContent = `${element.firstName} ${element.lastName}`;
          profile_information.append(h1);

          let h3 = document.createElement("h3");
          h3.setAttribute("class", "Player_Profile_Desc");
          h3.textContent = `#${element.jersey} | ${element.teamSitesOnly.posFull} | ${element.heightFeet}'${element.heightInches} `;
          profile_information.append(h3);

          let h5 = document.createElement("h5");
          h5.setAttribute("class", "Player_Profile_Extra");
          h5.setAttribute("id", "Player_Profile_Country");
          h5.textContent = `Country: ${element.country}`;
          profile_information.append(h5);

          let h4 = document.createElement("h4");
          h4.setAttribute("class", "Player_Profile_Extra");
          h4.setAttribute("id", "Player_collegeBigScreen");

          if (element.draft.roundNum === "")
            h4.textContent = `College/HS: ${element.collegeName} | Draft: Undrafted`;
          else
            h4.textContent = `College/HS: ${element.collegeName} | Draft: ${element.draft.seasonYear} R:${element.draft.roundNum} Pick ${element.draft.pickNum}`;

          profile_information.append(h4);
          h4 = document.createElement("h4");
          h4.setAttribute("class", "Player_Profile_Extra");
          h4.setAttribute("id", "Player_draft");

          if (element.draft.roundNum === "")
            h4.textContent = `Draft: Undrafted`;
          else
            h4.textContent = `Draft: ${element.draft.seasonYear} R:${element.draft.roundNum} Pick ${element.draft.pickNum}`;
          profile_information.append(h4);
        }
      });
      //Now we want to display the data for each season within the table
      return fetch(urlPlayerStats);
    })
    .then((response) => response.json())
    .then((data) => {
      let playerSeasonStats = data.league.standard.stats.regularSeason.season;
      console.log("STATS", data.league.standard.stats.regularSeason.season);
      //We have fetched stats and now want to look through the various seasons
      //and add the data within the specific season into the table
      playerSeasonStats.forEach((element) => {
        console.log(element.seasonYear);
        //Append a row for the specific season
        let Tablerows = document.querySelector("#tableRows");
        let season_row = document.createElement("tr");
        Tablerows.append(season_row);

        //Add the data values for the season within the table.

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
