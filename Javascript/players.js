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

function handleOptionSelection(event) {
  //console.log(val);
  console.log(this.value);

  if (this.value !== "None") {
    let urlPlayerStats = `https://data.nba.net/data/10s/prod/v1/2021/players/${id}_profile.json`;
    fetch(urlPlayerStats)
      .then((response) => response.json())
      .then((data) => {
        let playerSeasonStats = data.league.standard.stats.regularSeason.season;

        let seasons = [];
        let seasonStats = [];
        //We have fetched stats and now want to look through the various seasons
        //and display the chosen stat as a graph
        playerSeasonStats.forEach((element) => {
          seasons.push(String(element.seasonYear));
          seasonStats.push(parseFloat(element.total[this.value]));
          console.log(
            String(element.seasonYear),
            parseFloat(element.total[this.value])
          );
          console.log(seasonStats);
          console.log(seasons);
        });
        //Not existent in html file
        let StatChart_Check = document.getElementById("StatChart") === null;
        let StatChart = null;
        if (!StatChart_Check) {
          StatChart = document.getElementById("StatChart");
          StatChart.remove();
        }
        StatChart = document.createElement("canvas");
        StatChart.setAttribute("id", "StatChart");

        document.querySelector("#Graphs").append(StatChart);

        //console.log(StatChart_Check);
        //let StatChart = document.getElementById("StatChart");

        //https://www.chartjs.org/docs/2.8.0/general/fonts.html
        Chart.defaults.global.defaultFontColor = "white";
        Chart.defaults.global.defaultFontSize = 16;
        Chart.defaults.global.defaultFontStyle = "bold";

        let chart = new Chart(StatChart, {
          type: "bar",
          data: {
            labels: seasons,
            datasets: [
              {
                label: this.value,
                data: seasonStats,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
              },
            ],
          },
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
        /*
        if (!StatChart_Check) {
          chart.StatChart.canvas.removeEventListener(
            "wheel",
            chart._wheelHandler
          );
        }
        */
      })
      .catch((error) => console.log(error));
  } else {
    let StatChart_Check = document.getElementById("StatChart") === null;
    if (!StatChart_Check) {
      StatChart = document.getElementById("StatChart");
      StatChart.remove();
    }
  }
}
//When we click on player card we want to show player profile
function handleClick(event) {
  //id = event.path[1].id;

  let graph = document.querySelector("#Graph_option");
  //console.log(graph.value);
  graph.addEventListener("input", handleOptionSelection);

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
      console.log(data.league.standard);
      data.league.standard.forEach((element) => {
        if (element.personId == id) {
          console.log(element.firstName);
          row.remove();

          let popup_title = document.querySelector(".modal-title");
          popup_title.textContent = `#${element.jersey} ${element.firstName} ${element.lastName}`;
          let popup_body = document.querySelector(".modal-body");
          let str = `<b>Country:</b> ${element.country}<br/><br/><b>DOB:</b> ${element.dateOfBirthUTC}<br/><br/><b>Position:</b> ${element.teamSitesOnly.posFull}<br/><br/><b>Height:</b> ${element.heightFeet}'${element.heightInches} (${element.heightMeters}m)<br/><br/><b>Weight:</b> ${element.weightPounds}lbs (${element.weightKilograms}kg)<br/><br/><b>HS/College/Pro:</b> ${element.collegeName}<br/><br/>`;
          str +=
            element.draft.pickNum === ""
              ? `<b>Draft:</b> Undrafted (<b>Debuted:</b> ${element.nbaDebutYear})<br/><br/>`
              : `<b>Draft:</b> ${element.draft.seasonYear} <b>R:</b> ${element.draft.roundNum} <b>Pick</b> ${element.draft.pickNum}<br/><br/>`;
          str += `<b>Professional Experience:</b> ${element.yearsPro} years<br/><br/><b>Teams:</b><br/>`;

          element.teams.forEach((team) => {
            str += `<img src='https://cdn.nba.com/logos/nba/${team.teamId}/primary/D/logo.svg' width='50px'/> --> <b>${team.seasonStart} - ${team.seasonEnd} </b><br/>`;
          });

          popup_body.innerHTML = str;
          let info_section = document.querySelector("#player_info");

          let player_image = document.createElement("img");
          player_image.setAttribute("class", "PlayerProfilePic");

          player_image.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${element.personId}.png`;
          player_image.alt = `Picture of ${element.firstName} ${element.lastName} at Media day`;

          let team_image = document.createElement("img");
          team_image.setAttribute("class", "PlayerProfileTeamPic");
          team_image.src = `https://cdn.nba.com/logos/nba/${element.teamId}/primary/D/logo.svg`;
          team_image.alt = `Picture of the team ${element.firstName} ${element.lastName} is on`;
          //Just temporary use CSS instead
          //Just add classes for player images and team images
          if (window.screen.width < 600) {
            player_image.width = 130;
            player_image.height = 95;
            team_image.width = 75;
          } else {
            team_image.width = 150;
          }
          //info_section.append(player_image);
          document.querySelector("#btnModal").append(player_image);

          info_section.append(team_image);

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
