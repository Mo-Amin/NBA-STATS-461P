const form = document.querySelector("form");
let statsRow = document.getElementById("statsRow");
form.addEventListener('submit', (event) => {
    event.preventDefault();

    removeChildren(statsRow);
    
    const players = document.querySelectorAll('input[type=text]');

    let playerData = [];

    players.forEach((player) => {
        let trimmedName = player.value.trim()
        let formedName = trimmedName.split(" ");
        formedName = formedName.join('_');

        getData(formedName, playerData).then(() =>{
        console.log("player data added") 
        })

    })
   
})

async function getData(playerName, playerArray){
    
    await fetch(`https://www.balldontlie.io/api/v1/players?search=${playerName}`)
    .then(response => response.json())
    .then(data => { 
    
        let colElement = document.createElement('div');
        colElement.className = "player col-md-4";

        //create card
        let card = document.createElement('div');
        card.className = "card";
        card.style.width="18rem";
        card.style.margin="0";
        let name = document.createElement('h5');
        name.className = "card-title";
        name.innerHTML= `${data.data[0].first_name} ${data.data[0].last_name}`;
        card.appendChild(name);
        colElement.appendChild(card);
        
        
        
        fetch(`https://www.balldontlie.io/api/v1/season_averages?season=2021&player_ids[]=${data.data[0].id}`)
        .then(response => response.json())
        .then(data => {
            
            // let colElement = document.createElement('div');

            // colElement.className = "player col-md-4";
            let list = document.createElement('ul');
            list.className = "list-group"

            let ppg = document.createElement('li');
            ppg.innerHTML = "PPG: " + data.data[0].pts;

            let ast = document.createElement('li');
            ast.innerHTML = "ASSISTS: " + data.data[0].ast;

            let rbg = document.createElement('li');
            rbg.innerHTML = "REBOUNDS: " + data.data[0].reb;

            let threePt = document.createElement('li');
            threePt.innerHTML = "THREE POINTERS: " + data.data[0].fg3m;

            list.append(ppg);
            list.append(ast);
            list.append(rbg);
            list.append(threePt);
            
            card.append(list);
            colElement.append(card)
            statsRow.appendChild(colElement);
        
            
        })
    });

    
}

let removeChildren = (parent) => {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


