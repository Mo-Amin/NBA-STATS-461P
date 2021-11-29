let Category = document.querySelector("#Category_choice");
Category.addEventListener("input", handleCategorySelection);

let Table = document.querySelector("#TeamTables");

let TeamStatURL = `http://data.nba.net/data/10s/prod/v1/2021/team_stats_rankings.json`;

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
function handleCategorySelection() {
  let Teamarrays = [];

  console.log(this.value);

  if (this.value !== "None") {
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
        let names = [];
        let avgValues = [];
        console.log(data.league.standard.regularSeason.teams);
        data.league.standard.regularSeason.teams.forEach((element) => {
          /*
          Teamarrays[element[this.value].rank - 1] = [
            element[this.value].avg,
            element.name + " " + element.nickname,
            element.teamId,
          ];
          */
          Teamarrays.push([
            Number(element[this.value].avg),
            element.name + " " + element.nickname,
            element.teamId,
            element.nickname,
          ]);
        });
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        Teamarrays = Teamarrays.sort((a, b) => a[0] - b[0]);
        Teamarrays.reverse();

        Teamarrays.forEach((element) => {
          names.push(element[3]);
          avgValues.push(element[0]);
        });

        let count = 1;
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
        console.log(Teamarrays);
        console.log(names);
      })
      .catch((error) => console.log(error));
  } else {
    let CheckTable = document.querySelector("#statTable");
    if (CheckTable !== null) {
      CheckTable.remove();
    }
  }
}
