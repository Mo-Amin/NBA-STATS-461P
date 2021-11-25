const form = document.querySelector("form");
let statsRow = document.getElementById("statsRow");

const chartContainer = document.querySelector(".chart-container");

form.addEventListener('submit', (event) => {
    event.preventDefault();

    removeChildren(statsRow);

    let playerStats = [];
    
    const players = document.querySelectorAll('input[type=text]');

    players.forEach((player) => {

        let nameObj = {}; 
        let trimmedName = player.value.trim()
        let formedName = trimmedName.split(" ");

        nameObj.firstName = formedName[0];
        nameObj.lastName = formedName[1];

        getData(nameObj, playerStats);

    })

    //!THIS IS NOT IDEAL BECAUSE WE REQUEST RESPONSE TIME MAY VARY... FIND ALTERNATIVE
    setTimeout(() => {createChart(playerStats)}, 2000);
    
    //createChart(playerStats);

    //THIS WAS FOR ADDING A 'vs' BETWEEN THE PLAYER CARDS, MAYBE DO LATER?
    // let vsCol = document.createElement('div');
    // vsCol.className="col-xl-4 order-xl-2";
    // let vs = document.createElement('h2');
    // vs.textContent = "VS";
    // vsCol.appendChild(vs);
    // statsRow.append(vsCol);
   
})


async function getData(playerName, playerStats) {
   await fetch("https://data.nba.net/data/10s/prod/v1/2021/players.json")
  .then((response) => response.json())
  .then((data) =>
    data.league.standard.forEach((player) => {
        if(player.firstName.toLowerCase() == playerName.firstName.toLowerCase() && player.lastName.toLowerCase() == playerName.lastName.toLowerCase()) {
            const playerId = player.personId;
            const playerPhoto = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${playerId}.png`;
            
            fetch(`https://data.nba.net/data/10s/prod/v1/2021/players/${playerId}_profile.json`)
            .then(response => response.json())
            .then(data => {
                let stats = data.league.standard.stats.latest;

                let colElement = document.createElement('div');
                colElement.className = "player col-md-3";
                colElement.style.marginBottom=0;


                let card = document.createElement('div');
                card.className = "card";
                card.style.margin="0";

                //create img element and add player photo
                let pic = document.createElement('img');
                pic.src= playerPhoto;

                let name = document.createElement('h5');
                name.className = "card-title";
                name.innerHTML= `${player.firstName} ${player.lastName}`;
                card.appendChild(pic);
                card.appendChild(name);
                colElement.appendChild(card);
                statsRow.append(colElement)


                //add stats to argument arrays being passed by reference for chart
                if(playerStats.length === 0)
                {
                  let playerOneStats = {};
                  playerOneStats.name = player.firstName + ' ' + player.lastName;
                  playerOneStats.stats = [];
                  playerOneStats.stats.push(parseFloat(stats.ppg));
                  playerOneStats.stats.push(parseFloat(stats.apg));
                  playerOneStats.stats.push(parseFloat(stats.rpg));
                  playerOneStats.stats.push(parseFloat(stats.mpg));
                  playerStats.push(playerOneStats)
                
                }

                else {
                  let playerTwoStats = {};
                  playerTwoStats.name = player.firstName + ' ' + player.lastName;
                  playerTwoStats.stats = [];
                  playerTwoStats.stats.push(parseFloat(stats.ppg));
                  playerTwoStats.stats.push(parseFloat(stats.apg));
                  playerTwoStats.stats.push(parseFloat(stats.rpg));
                  playerTwoStats.stats.push(parseFloat(stats.mpg));
                  playerStats.push(playerTwoStats);
                }
                //stats

                let list = document.createElement('ul');
                list.className = "list-group"

                let ppg = document.createElement('li');
                ppg.innerHTML = "PPG: " + stats.ppg;

                let ast = document.createElement('li');
                ast.innerHTML = "ASSISTS: " + stats.apg;

                let rbg = document.createElement('li');
                rbg.innerHTML = "REBOUNDS: " + stats.rpg;

                let threePt = document.createElement('li');
                threePt.innerHTML = "MINUTES PER GAME: " + stats.mpg;

                list.append(ppg);
                list.append(ast);
                list.append(rbg);
                list.append(threePt);

                card.append(list);
                colElement.append(card)
                statsRow.appendChild(colElement);

            })
            .catch(e => console.log())

        }
    })
  )
}

let removeChildren = (parent) => {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

let createChart = (playerStats) => {
          console.log(playerStats);
          //chart configuration
          const labels = [
            'PPG',
            'AST',
            'RPG',
            'MIN',
          ];
          const data = {
            labels: labels,
            datasets: [{
              label: playerStats[0].name,
              backgroundColor: 'rgb(153, 204, 255)',
              borderColor: 'rgb(255, 99, 132)',
              data: playerStats[0].stats.map(stat => stat),
              
            },
            {
                label: playerStats[1].name,
                backgroundColor: 'rgb(255, 255, 153)',
                borderColor: 'rgb(255, 99, 132)',
                data: playerStats[1].stats.map(stat => stat),
                
              },
              
            ]
          };
    
        const config = {
            type: 'bar',
            data: data,
            options: {}
          };
  
      const myChart = new Chart(
          document.getElementById('myChart'),
          config
        );
        chartContainer.style.display = "block";

}

