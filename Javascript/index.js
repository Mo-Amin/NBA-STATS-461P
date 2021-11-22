
const stats = document.querySelector('#stats');
const attributes = document.querySelector('#attributes');

const numPlayers = 545;




fetch("https://data.nba.net/data/10s/prod/v1/2021/players.json")
.then(response => response.json())
.then(data => { 
    
    let indexNumber = 0;
    //only look for players that are active
    while(!indexNumber) {
    let player = getRandomNumber(numPlayers);
    
        if(data.league.standard[player].isActive) {
            indexNumber = player
        }

    }

    //player attributes
    attributes.children[0].innerHTML = `${data.league.standard[indexNumber].firstName} ${data.league.standard[indexNumber].lastName} `;
    attributes.children[2].innerHTML = `Height: ${data.league.standard[indexNumber].heightFeet}'${data.league.standard[indexNumber].heightInches} `;
    attributes.children[3].innerHTML = `Weight: ${data.league.standard[indexNumber].weightPounds}lbs`;
    attributes.children[4].innerHTML = `Position: ${data.league.standard[indexNumber].pos}`
    attributes.children[5].innerHTML = `Origin: ${data.league.standard[indexNumber].country}`
    console.log(data);

    const chosenPlayer = data.league.standard[indexNumber];
    const playerId = chosenPlayer.personId;

    fetch(`https://data.nba.net/data/10s/prod/v1/2021/players/${playerId}_profile.json`)
    .then(response => response.json())
    .then(data => {

        console.log(data);


    // STATS //
        
    const playerStats = data.league.standard.stats;
    
    const ppg = playerStats.latest.ppg;
    const ast = playerStats.latest.apg;
    const rbg = playerStats.latest.rpg;
    const min = playerStats.latest.mpg;

    

    stats.children[1].innerHTML = `PPG: ${ppg}`
    stats.children[2].innerHTML = `APG: ${ast}`
    stats.children[3].innerHTML = `RBG: ${rbg}`
    stats.children[4].innerHTML = `Min: ${min}`



    });
    
});

//grab a random number for a random player
function getRandomNumber(numPlayers) {

    const randomPlayer = Math.floor(Math.random() * numPlayers);

    return randomPlayer;
    }




//`https://data.nba.net/data/10s/prod/v1/2021/players/${playerId}_profile.json`