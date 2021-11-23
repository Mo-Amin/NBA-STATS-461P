
const stats = document.querySelector('#stats');
const attributes = document.querySelector('#attributes');

const numPlayers = 545;


//TODO: still need to grab player photo and the team that hey plays for 

let getPlayer = async () => { 
await fetch("https://data.nba.net/data/10s/prod/v1/2021/players.json")
.then(response => response.json())
.then(data => { 
    
    let indexNumber = 0;
    
    //while the current player is innactive
    while(!indexNumber) {
    let player = getRandomNumber(numPlayers);
    
        if(data.league.standard[player].isActive) {
            indexNumber = player
        }

    }


        //grab team name
        fetch(`https://data.nba.net/data/10s/prod/v1/2021/teams.json`)
        .then(response => response.json())
        .then(teamData => {
            teamData.league.standard.forEach(team => {
                if(team.teamId === data.league.standard[indexNumber].teamId)
                {
                    attributes.children[1].innerHTML = `Team: ${team.fullName}`; 
                }
            })
        })

    //player attributes
    attributes.children[0].innerHTML = `${data.league.standard[indexNumber].firstName} ${data.league.standard[indexNumber].lastName} `;
    attributes.children[2].innerHTML = `Height: ${data.league.standard[indexNumber].heightFeet}'${data.league.standard[indexNumber].heightInches} `;
    attributes.children[3].innerHTML = `Weight: ${data.league.standard[indexNumber].weightPounds}lbs`;
    attributes.children[4].innerHTML = `Position: ${data.league.standard[indexNumber].teamSitesOnly.posFull}`
    attributes.children[5].innerHTML = `Origin: ${data.league.standard[indexNumber].country}`
    

    const chosenPlayer = data.league.standard[indexNumber];
    const playerId = chosenPlayer.personId;

    //grab player photo
    const playerPhoto = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${playerId}.png`;
    let image = document.querySelector('#playerImage');
    image.src = playerPhoto;
    
    //grab chosen player profile
    fetch(`https://data.nba.net/data/10s/prod/v1/2021/players/${playerId}_profile.json`)
    .then(response => response.json())
    .then(data => {

    // STATS  
    const playerStats = data.league.standard.stats;
    const ppg = playerStats.latest.ppg;
    const ast = playerStats.latest.apg;
    const rbg = playerStats.latest.rpg;
    const min = playerStats.latest.mpg;

    stats.children[1].innerHTML = `PPG: ${ppg}`

    if(ppg != -1) {

    stats.children[2].innerHTML = `APG: ${ast}`
    stats.children[3].innerHTML = `RBG: ${rbg}`
    stats.children[4].innerHTML = `Min: ${min}`

    }
    else {
    stats.children[1].innerHTML = `PPG: 0`
    stats.children[2].innerHTML = `APG: 0`
    stats.children[3].innerHTML = `RBG: 0`
    stats.children[4].innerHTML = `Min: 0`

    }

    });
    
})};

//grab a random number for a random player
function getRandomNumber(numPlayers) {

    const randomPlayer = Math.floor(Math.random() * numPlayers);

    return randomPlayer;
    }

getPlayer();




//`https://data.nba.net/data/10s/prod/v1/2021/players/${playerId}_profile.json`