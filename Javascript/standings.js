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

    const eastList = document.querySelector('.east');
    for(let i = 0; i < east.length; i++)
    {
      let team = document.createElement('tr');
      
      team.className = "team";

     
      let rank = document.createElement('td');
      let name = document.createElement('td');
      let win = document.createElement('td');
      let loss = document.createElement('td');
      let streak = document.createElement('td');

      rank.textContent = `${east[i].rank}`;
      name.textContent = `${east[i].name}`;
      win.textContent = `${east[i].win}`;
      loss.textContent = `${east[i].loss}`;
      streak.textContent = `${east[i].streak}`;

      team.append(rank,name,win, loss, streak);
      eastList.append(team);
    }

    const westList = document.querySelector('.west');
    for(let i = 0; i < west.length; i++)
    {
      let team = document.createElement('tr');
      
      team.className = "team";

     
      let rank = document.createElement('td');
      let name = document.createElement('td');
      let win = document.createElement('td');
      let loss = document.createElement('td');
      let streak = document.createElement('td');

      rank.textContent = `${west[i].rank}`;
      name.textContent = `${west[i].name}`;
      win.textContent = `${west[i].win}`;
      loss.textContent = `${west[i].loss}`;
      streak.textContent = `${west[i].streak}`;

      team.append(rank,name,win, loss, streak);
      westList.append(team);
    }

    console.log(eastList)

  });
