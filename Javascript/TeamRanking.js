let Category = document.querySelector("#Category_choice");
Category.addEventListener("input", handleCategorySelection);

let Table = document.querySelector("#TeamTables");

let TeamStatURL = `http://data.nba.net/data/10s/prod/v1/2021/team_stats_rankings.json`;
function handleCategorySelection() {
  let Teamarrays = [];

  console.log(this.value);

  if (this.value !== "None") {
    /*
    Table.innerHTML = `
      <table cellpadding="15" id="statTable">
          <!-- HEADING OF TABLE -->
          <thead>
            <tr id="header-row">
              <th>Ranking #</th>
              <th id="season_Column">Team</th>
              <th>Avg</th>
            </tr>
          </thead>
          <!-- FILL THE BODY OF TABLE WITH ROWS -->
          <tbody id="tableRows"></tbody>
        </table>
      `;
      */

    let TableData = document.querySelector("#tableRows");

    fetch(TeamStatURL)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.league.standard.regularSeason.teams);
        data.league.standard.regularSeason.teams.forEach((element) => {
          Teamarrays[element[this.value].rank - 1] = [
            element[this.value].avg,
            element.name + " " + element.nickname,
            element.teamId,
          ];
        });
        let count = 1;
        Teamarrays.forEach((element) => {
          TableData.innerHTML += `
          <tr>
                <td>${count}</td>
                <td>
                ${element[1]}
                <img
                src="https://cdn.nba.com/logos/nba/${element[2]}/primary/D/logo.svg"
                width="100"
                height="100"
                alt="${element[1]} Logo"
                
                />
                </td>
                <td>${element[0]}</td>
            </tr>`;
          ++count;
        });
        console.log(Teamarrays);
      })
      .catch((error) => console.log(error));
  }
}
