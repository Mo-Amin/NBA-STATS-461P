const form = document.querySelector("form");
let statsRow = document.getElementById("statsRow");
form.addEventListener('submit', (event) => {
    event.preventDefault();

    removeChildren(statsRow);
    
    const players = document.querySelectorAll('input[type=text]');
    const statElements = document.getElementsByClassName('stats');



    let playerData = [];

    players.forEach(async(player) => {
        let formedName = player.value.split(" ");
        formedName = formedName.join('_');

        await getData(formedName, playerData).then(() =>{
            console.log("player data added") 
        })

    })
   
})

async function getData(playerName, playerArray){
    
    await fetch(`https://www.balldontlie.io/api/v1/players?search=${playerName}`)
    .then(response => response.json())
    .then(data => { 
        fetch(`https://www.balldontlie.io/api/v1/season_averages?season=2021&player_ids[]=${data.data[0].id}`)
        .then(response => response.json())
        .then(data => {

            let colElement = document.createElement('div');

            colElement.className = "player col-md-4";
            let list = document.createElement('ul');

            let ppg = document.createElement('li');
            ppg.innerHTML = "PPG: " + data.data[0].pts;

            let ast = document.createElement('li');
            ast.innerHTML = "ASSISTS: " + data.data[0].ast;

            let rbg = document.createElement('li');
            rbg.innerHTML = "REBOUNDS: " + data.data[0].reb;

            let threePt = document.createElement('li');
            threePt.innerHTML = "THREE POINTERS: " + data.data[0].fg3m;

            list.appendChild(ppg);
            list.appendChild(ast);
            list.appendChild(rbg);
            list.appendChild(threePt);
            colElement.appendChild(list);
            statsRow.appendChild(colElement);
            
        })
    });

    
}

let removeChildren = (parent) => {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


