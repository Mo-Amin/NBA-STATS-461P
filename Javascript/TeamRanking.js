//Mohamed-Amin Cheaito 2021

//options for what stat user wants to sort by
let Category = document.querySelector("#Category_choice");
Category.addEventListener("input", handleCategorySelection);

let Table = document.querySelector("#TeamTables");

let TeamStatURL = `http://data.nba.net/data/10s/prod/v1/2021/team_stats_rankings.json`;

//If user selected one of the options enter
function handleCategorySelection() {
  let Teamarrays = [];

  console.log(this.value);

  //Make sure they want to find a appropriate stat
  if (this.value !== "None") {
    //Add the header of the table.
    Table.innerHTML = `
      <table id="statTable">
          <!-- HEADING OF TABLE -->
          <thead>
            <tr id="header-row">
              <th>Ranking #</th>
              <th>Team</th>
              <th>Avg</th>
            </tr>
          </thead>
          <!-- FILL THE BODY OF TABLE WITH ROWS -->
          <tbody id="tableRows"></tbody>
        </table>
      `;

    let TableData = document.querySelector("#tableRows");

    fetch(TeamStatURL)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.league.standard.regularSeason.teams);
        //Go through the teams
        data.league.standard.regularSeason.teams.forEach((element) => {
          //An array of arrays, first element has value user looking for,
          //second element has name, and last element has teamId
          Teamarrays.push([
            Number(element[this.value].avg),
            element.name + " " + element.nickname,
            element.teamId,
          ]);
        });
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        //Sort the array based on the avg value
        Teamarrays = Teamarrays.sort((a, b) => b[0] - a[0]);
        //Teamarrays.reverse();

        //The rank
        let count = 1;
        //Go through array of arrays and add a row to the table for each team's
        //rank number, name/logo, and avg value of the specific stat chosen by user
        Teamarrays.forEach((element) => {
          TableData.innerHTML += `
          <tr>
                <td class = "RankNum">${count}</td>
                <td class="Teamimg">
                <img
                src="https://cdn.nba.com/logos/nba/${element[2]}/primary/D/logo.svg"
                width="150"
                height="150"
                alt="${element[1]} Logo"
                
                /> <br/>
                ${element[1]}
                </td>
                <td class="statValue">${element[0]}</td>
            </tr>`;
          ++count;
        });
      })
      .catch((error) => console.log(error));
  } else {
    //If user selected "No option selected" make sure there is no data displayed
    let CheckTable = document.querySelector("#statTable");
    if (CheckTable !== null) {
      CheckTable.remove();
    }
  }
}
