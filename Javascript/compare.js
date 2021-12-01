const form = document.querySelector("form");
let statsRow = document.getElementById("statsRow");
let section = document.getElementById("compare");

const chartContainer = document.querySelector(".chart-container");

//chart configuration
const labels = [
  'PPG',
  'AST',
  'RPG',
  'MIN',
];
//'rgb(219, 78, 78)'
const data = {
  labels: labels,
  datasets: [{
    label: 'Player 1',
    backgroundColor: 'rgb(219, 78, 78)',
    borderColor: 'rgb(255,255,255)',
    color: 'rgb(255,255,255)',
    data: [1,2,3,4]
    
  },
  {
      label: 'Player 2',
      backgroundColor: 'rgb(0,0,0)',
      borderColor: 'rgb(255, 99, 132)',
      color: 'rgb(255,255,255,255)',
      data: [1,2,3,4],
      
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

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    chartContainer.style.display="none";
    removeChildren(statsRow);

    
    const players = document.querySelectorAll('input[type=text]');

    let playerNames = [];
    if(players[0].value && players[0].value) {
    players.forEach((player) => {

        let nameObj = {}; 

        let trimmedName = player.value.trim()
        let formedName = trimmedName.split(" ");

        nameObj.firstName = formedName[0];
        nameObj.lastName = formedName[1];
        playerNames.push(nameObj);
        
        removeData(myChart);
     
    })
    if((playerNames[0].firstName && playerNames[0].lastName) && (playerNames[1].firstName && playerNames[1].lastName))
    getData(playerNames, myChart);
    else {
      alert("Enter first and last names")
      section.style.height = "100vh"
    }
  }
  
  else alert("Enter names for two players");

})

async function getData(playerNames, chart) {
  await fetch("https://data.nba.net/data/10s/prod/v1/2021/players.json")
 .then((response) => response.json())
 .then((data) => { 
  let playerIds = [];
  let playerStats = [];

  console.log(playerNames)
   data.league.standard.forEach((player) => {
      

       if(player.firstName.toLowerCase() == playerNames[0].firstName.toLowerCase() && player.lastName.toLowerCase() == playerNames[0].lastName.toLowerCase()) {
       
          playerIds.push(player.personId)
        
           const playerPhoto = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player.personId}.png`;
           
           const profile = {name: `${player.firstName} ${player.lastName}`}
           profile.playerPhoto = playerPhoto;
           playerStats.push(profile)
           
       }
       else if(player.firstName.toLowerCase() == playerNames[1].firstName.toLowerCase() && player.lastName.toLowerCase() == playerNames[1].lastName.toLowerCase()) {
        
         playerIds.push(player.personId);

         const playerPhoto = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player.personId}.png`;
         
         const profile = {name: `${player.firstName} ${player.lastName}`}
         profile.playerPhoto = playerPhoto;
         playerStats.push(profile)
         
       }
      })
  
      if(playerIds[0] && playerIds[1]) {
           //retrieve first player profile
           fetch(`https://data.nba.net/data/10s/prod/v1/2021/players/${playerIds[0]}_profile.json`)
              .then(response => response.json())
              .then(data => {

               let stats = data.league.standard.stats.latest;
               playerStats[0].stats = [];
               playerStats[0].stats.push(parseFloat(stats.ppg))
               playerStats[0].stats.push(parseFloat(stats.apg))
               playerStats[0].stats.push(parseFloat(stats.rpg))
               playerStats[0].stats.push(parseFloat(stats.mpg)) 


            //retrieve second player profile
            fetch(`https://data.nba.net/data/10s/prod/v1/2021/players/${playerIds[1]}_profile.json`)
            .then(response => response.json())
            .then(data => {

              let stats = data.league.standard.stats.latest;
              playerStats[1].stats = [];
              playerStats[1].stats.push(parseFloat(stats.ppg))
              playerStats[1].stats.push(parseFloat(stats.apg))
              playerStats[1].stats.push(parseFloat(stats.rpg))
              playerStats[1].stats.push(parseFloat(stats.mpg)) 

              playerStats.forEach(profile => {
                let colElement = document.createElement('div');
                colElement.className = "player col-md-3";
                colElement.style.marginBottom=0;
  
  
                let card = document.createElement('div');
                card.className = "card";
                card.style.margin="0";
  
                //create img element and add player photo
                let pic = document.createElement('img');
                pic.src= profile.playerPhoto;
  
                let name = document.createElement('h5');
                name.className = "card-title";
                name.innerHTML= `${profile.name}`;
                card.appendChild(pic);
                card.appendChild(name);
                colElement.appendChild(card);
                statsRow.append(colElement)


                let list = document.createElement('ul');
                list.className = "list-group"

                let ppg = document.createElement('li');
                ppg.innerHTML = "PPG: " + profile.stats[0];

                let ast = document.createElement('li');
                ast.innerHTML = "ASSISTS: " + profile.stats[1];

                let rbg = document.createElement('li');
                rbg.innerHTML = "REBOUNDS: " + profile.stats[2];

                let threePt = document.createElement('li');
                threePt.innerHTML = "MINUTES PER GAME: " + profile.stats[3];

                list.append(ppg);
                list.append(ast);
                list.append(rbg);
                list.append(threePt);

                card.append(list);
                colElement.append(card)
                statsRow.appendChild(colElement);
              })


              //re-render chart
              section.style.height="auto";
              removeData(chart);
              addData(chart,playerStats[0],playerStats[1]);
              chartContainer.style.display = "block";
            })
            
              })
            .catch(e => console.log(e))
          
        }

        else {

          chartContainer.style.display = "none";
          alert("At least one of the players cannot be found, try again")
          
        }

   })
  
}

let removeChildren = (parent) => {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function addData(chart, playerOne, playerTwo) {
  //chart.data.labels.push(label);
  chart.data.datasets[0].label = playerOne.name;
  chart.data.datasets[0].data = playerOne.stats;
  chart.data.datasets[1].label = playerTwo.name;
  chart.data.datasets[1].data = playerTwo.stats;
  chart.update();
}

function removeData(chart) {
  chart.data.datasets.forEach((dataset) => {
      while(dataset.data[0])
      dataset.data.pop();
      //dataset.data.pop();
  });
  chart.update();
}



