
const numPlayers = 545;
const randomPlayer = Math.floor(Math.random() * numPlayers);
console.log(randomPlayer)



fetch("https://data.nba.net/data/10s/prod/v1/2021/players.json")
.then(response => response.json())
.then(data => { 
    const chosen = data.league.standard[randomPlayer];
    const playerId = chosen.personId;

    fetch(`https://data.nba.net/data/10s/prod/v1/2021/players/${playerId}_profile.json`)
    .then(response => response.json())
    .then(data => {

        console.log(data);
        
    const playerStats = data.league.standard.stats;

    const ppg = playerStats.ppg;
    const ast = playerStats.apg;
    const rbg = playerStats.rpg;
    const threept = playerStats.mpg;

    });
    
});





//`https://data.nba.net/data/10s/prod/v1/2021/players/${playerId}_profile.json`