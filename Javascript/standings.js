const url =
  "https://data.nba.net/data/10s/prod/v1/current/standings_conference.json";

// let response = () => {return fetch(url).then(response => response.json())};
// response().then(data => console.log(data))

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    let east = data.league.standard.conference.east.map((team) => {
      let standings = {
        rank: team.confRank,
        win: team.win,
        loss: team.loss,
        streak: team.streak,
        name:
          team.teamSitesOnly.teamName + " " + team.teamSitesOnly.teamNickname,
      };

      return standings;
    });

    let west = data.league.standard.conference.west.map((team) => {
      let standings = {
        rank: team.confRank,
        win: team.win,
        loss: team.loss,
        streak: team.streak,
        name:
          team.teamSitesOnly.teamName + " " + team.teamSitesOnly.teamNickname,
      };

      return standings;
    });

    console.log(east);
    console.log(west);
  });
