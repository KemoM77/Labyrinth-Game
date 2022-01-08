const ROOM_SIZE = 75;
const PLAYER_SIZE = 30;
const TRASURE_SIZE = 20;
const NUM_OF_ROOMS = 50;
let  gmSt = new gamestate();
let plyrArr = [];
let tresArr = [];
const types = ["corner","line","T"];
const rotations = [0,-90,-180,-270];
let boardGUIMatx  = [[],[],[],[],[],[],[]];
let moveableRoomGUI = new Room();
let arrowArr = Array.from(document.querySelectorAll('[alt="arrow"]'))
let startButton = document.querySelector("#strtGm");
let boardGUI =  document.querySelector('#board');
let boardArr = null;
let possibleTypes = []
document.querySelector("#numPList").addEventListener("input",function(){

document.querySelector("#numTList").innerHTML = ` <option value="2">2</option>`
for(let i = 1 ; i <= (24/parseInt( document.querySelector("#numPList").value)) ;i++ )
{
    
if (i != 2)
   {
    let tempOpt = document.createElement("option");
   tempOpt.value  = i;
   tempOpt.innerHTML = `${i}`
   document.querySelector("#numTList").appendChild(tempOpt);

   }
}

});


if(localStorage.savedGameState == null)
    {
        document.querySelector("#noSave").innerHTML = "NO SAVED GAME";
    }

function gamestate(){
    this.boardState = new boardState();
    this.NumberOfPlayer = null;
    this.NumberOfTreasure = null ;
    this.timeToMoveRoom = true
    this.playerTurnInd = -1;
    this.PlayersState = new PlayersState();
}

function boardState()
{
    this.moveableRoom = new Room;

   this.board=  [
    [new Room,new Room ,new Room,new Room ,new Room ,new Room, new Room ],
    [new Room,new Room ,new Room,new Room ,new Room ,new Room, new Room ],
    [new Room,new Room ,new Room,new Room ,new Room ,new Room, new Room ],
    [new Room,new Room ,new Room,new Room ,new Room ,new Room, new Room ],
    [new Room,new Room ,new Room,new Room ,new Room ,new Room, new Room ],
    [new Room,new Room ,new Room,new Room ,new Room ,new Room, new Room ],
    [new Room,new Room ,new Room,new Room ,new Room ,new Room, new Room ],];
}

function Room(){
    this.hasPlayer =false ;
    this.playerInd = new Array;
    this.hasTreasure = false ;
    this.treasureInd =null;
    this.type = null;
    this.coordinates = new coordinates (null,null);
    this.rotation = null;
    this.openLeft= null;
    this.openRight= null;
    this.openUp= null;
    this.openDown= null;
    this.highlighted = false;
}

function coordinates(x,y)
{
    this.x = x;
    this.y = y;
}

function PlayersState()
{
    this.players = [];
}

function Player ()
{
    this.Treasures = [];
    this.roomIndI = null ;
    this.roomIndJ  = null;
    this.OrigIndI = null ;
    this.OrigIndJ  = null;
}


const fixedRooms = [
    {type:"corner" ,rotation:0},
    {type:"T" ,rotation:0},
    {type:"T" ,rotation:0},
    {type:"corner" ,rotation:-270},
    {type:"T" ,rotation:-90},
    {type:"T" ,rotation:-90},
    {type:"T" ,rotation:0},
    {type:"T" ,rotation:-270},
    {type:"T" ,rotation:-90},
    {type:"T" ,rotation:-180},
    {type:"T" ,rotation:-270},
    {type:"T" ,rotation:-270},
    {type:"corner" ,rotation:-90},
    {type:"T" ,rotation:-180},
    {type:"T" ,rotation:-180},
    {type:"corner" ,rotation:-180}
]

window.onbeforeunload = function(event)
{
    return confirm("Confirm refresh");
};



startButton.addEventListener("click",function(){
    localStorage.clear;
    gmSt = new gamestate();
    document.querySelector("#buttonS").play();
    document.querySelector("#StartMenu").hidden = true;
    document.querySelector("#Instrct").hidden = false;
    gmSt.NumberOfPlayer = parseInt( document.querySelector("#numPList").value);
    gmSt.NumberOfTreasure = parseInt(document.querySelector("#numTList").value) * gmSt.NumberOfPlayer;
    document.querySelector("#noSave").innerHTML = " "
    setGame();
})



document.querySelector("#underStood").addEventListener("click" , function(){
    document.querySelector("#Instrct").hidden = true;
    document.querySelector("#buttonS").play();
    boardGUI.hidden = false;
    init();
    for (let index = 0; index < gmSt.NumberOfPlayer; index++) {
        document.querySelector(`#p${index+1}`).hidden = false;  
     }
     document.querySelector("#menu").hidden = false;
     document.querySelector("#soundM").play();

})



document.querySelector("#load").addEventListener("click",function(){
    document.querySelector("#buttonS").play();
    if( !(localStorage.savedGameState == null))
    {
   // console.log(localStorage.savedGameState);
     document.querySelector("#StartMenu").hidden = true;
     document.querySelector("#menu").hidden = false;
    boardGUI.hidden = false;
    gmSt = JSON.parse( localStorage.getItem("savedGameState"))
    setGame();
    for (let index = 0; index < gmSt.NumberOfPlayer; index++) {
        document.querySelector(`#p${index+1}`).hidden = false;  
     }
     draw();
     setBoxInfo();
     document.querySelector(`#p${gmSt.playerTurnInd +1}`).classList.add("myTurn")
    document.querySelector("#soundM").play();
    document.querySelector("#soundON").hidden = false;
    document.querySelector("#soundOFF").hidden = true;


    }

    else{
        document.querySelector("#noSave").innerHTML = "NO SAVED GAME"
    }
})

document.querySelector("#save").addEventListener("click", Save)

function  Save (){ 
    localStorage.savedGameState = JSON.stringify(gmSt);
    document.querySelector("#saveS").play();

    document.querySelector("#save").classList.add("saved")
    setTimeout(function(){ document.querySelector("#save").classList.remove("saved")},1000)

}




document.querySelector("#restart").addEventListener("click",restart);

function restart (){
    document.querySelector("#buttonS").play();
    if( !confirm("Are you sure That you want to restart the game ? "))
            return;

    for (let index = 0; index < 4; index++) {
       document.querySelector(`#p${index+1}`).hidden = true;  
       document.querySelector(`#p${index +1}`).classList.remove("saved")
       document.querySelector(`#p${index +1}`).classList.remove("myTurn")
    }
    if(localStorage.savedGameState == null)
    {
        document.querySelector("#noSave").innerHTML = "NO SAVED GAME";
    }
    document.querySelector("#winnerPanel").hidden = true;
    document.querySelector("#menu").hidden = true;
    boardGUI.hidden = true;
    document.querySelector("#StartMenu").hidden = false;
    gmSt = new gamestate();


    boardGUI.innerHTML = `<img onclick="slideColsUp(event,1)" alt="arrow" src="./icons/arrow.png" class="arrup" ondrop="drop(event)" id="ar1" >
        <img onclick="slideColsUp(event,3)" alt="arrow" src="./icons/arrow.png" class="arrup" ondrop="drop(event)" id="ar2">
        <img onclick="slideColsUp(event,5)" alt="arrow" src="./icons/arrow.png" class="arrup" ondrop="drop(event)" id="ar3">
        <img onclick="slideColsDown(event,1)" alt="arrow" src="./icons/arrow.png" class="arrdn" ondrop="drop(event)" id="ar4">
        <img onclick="slideColsDown(event,3)" alt="arrow" src="./icons/arrow.png" class="arrdn" ondrop="drop(event)" id="ar5">
        <img onclick="slideColsDown(event,5)" alt="arrow" src="./icons/arrow.png" class="arrdn" ondrop="drop(event)" id="ar6">
        <img onclick="slideRowsRight(event,1)"  alt="arrow" src="./icons/arrow.png" class="arrL"  ondrop="drop(event)" id="ar7">
        <img  onclick="slideRowsRight(event,3)" alt="arrow" src="./icons/arrow.png" class="arrL"  ondrop="drop(event)" id="ar8">
        <img onclick=" slideRowsRight(event,5)" alt="arrow" src="./icons/arrow.png" class="arrL"  ondrop="drop(event)" id="ar9">
        <img onclick="slideRowsLeft(event,1)" alt="arrow" src="./icons/arrow.png" class="arrR"  ondrop="drop(event)" id="ar10">
        <img onclick="slideRowsLeft(event,3)" alt="arrow" src="./icons/arrow.png" class="arrR"  ondrop="drop(event)" id="ar11">
        <img onclick=" slideRowsLeft(event,5)" alt="arrow" src="./icons/arrow.png" class="arrR"  ondrop="drop(event)" id="ar12">`
     


}

document.querySelector("#soundON").addEventListener("click",function (){
    document.querySelector("#soundON").hidden = true;
    document.querySelector("#soundOFF").hidden = false;
    document.querySelector("#soundM").pause();


})

document.querySelector("#soundOFF").addEventListener("click",function (){
    document.querySelector("#soundON").hidden = false;
    document.querySelector("#soundOFF").hidden = true;
    document.querySelector("#soundM").play();

})


document.querySelector("#endWin").addEventListener("click",restart);



function rotate(e)
{
   
    e.preventDefault();
    gmSt.boardState.moveableRoom.rotation = gmSt.boardState.moveableRoom.rotation -90 ;
    let diff = 0
    document.querySelector("#rotateS").play();
    let  id  = setInterval (function()
    {
        if (diff == 90 )
             clearInterval(id);
        else    
         e.target.style.transform = `rotate(${-(parseInt(e.target.style.transform.replace(/\D+/g,''))) - 1}deg)`; diff++;
    } , 5)

    
            // setTimeout(function () {
            //     console.log(calcRotation360Deg(-(parseInt(e.target.style.transform.replace(/\D+/g,'')))));
            //     console.log (calcRotation360Deg (gmSt.boardState.moveableRoom.rotation));

            // }, 1000 )
            
            //e.target.style.transform = `rotate(${-(parseInt(e.target.style.transform.replace(/\D+/g,''))) - 90}deg)`;
            //draw();
}


////////////////////////////////////

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
      while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  


/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////









function setGame(){   
for(let i = 0 ; i < 13;++i)
{
    possibleTypes.push("line");
}
for(let i = 0 ; i < 15;++i)
{
    possibleTypes.push("corner");
}
for(let i = 0 ; i < 6;++i)
{
    possibleTypes.push("T");
}



for(let i = 0 ; i < 50 ; ++i )
{
     let tempImg = document.createElement('img');
     tempImg.classList.add("room")
    if(i == 49)
    {
        tempImg.classList.add("moveable");
        tempImg.addEventListener("contextmenu",rotate)
    }

    document.querySelector('#board').appendChild(tempImg);
}

for(let i = 0 ; i < gmSt.NumberOfPlayer ; ++i )
{
     const tempImg = document.createElement('img');
     tempImg.classList.add("plyr");
     tempImg.id = `pl${i+1}`
     tempImg.src = `./icons/pl${i+1}.png`
    document.querySelector('#board').appendChild(tempImg);
    //console.log(`player${i+1}`);
}
 plyrArr = Array.from( document.querySelectorAll('#board>img.plyr'));

 for(let i = 0 ; i < gmSt.NumberOfTreasure ; ++i )
 {
      let tempImg = document.createElement('img');
      tempImg.classList.add("tresr")
      tempImg.id = `tr${i+1}`
      tempImg.src = `./icons/tr${i+1}.png`
      tempImg.hidden = true;
     document.querySelector('#board').appendChild(tempImg);
    // console.log(`Treasure${i+1}`);
 }

 tresArr = Array.from( document.querySelectorAll('#board>img.tresr'));
 //shuffle(tresArr)




boardArr = Array.from( document.querySelectorAll('#board>img.room'));
let m = 0
for (let i = 0 ; i < 7 ; ++i)
{
    for(let j = 0 ; j < 7 ; ++j)
    {   
        boardArr[m].id =  `${i}${j}`
        boardGUIMatx[i][j] = boardArr[m]
        m++;
    }
}
moveableRoomGUI = boardArr[49] ;
}
////////////////////////////////////////////////////////////////////////////
/////////////

function setBoxInfo(){

    for(let i = 0 ; i < gmSt.NumberOfPlayer ; i++)
    {
       document.querySelector(`#pn${i+1}`).innerHTML = `${gmSt.PlayersState.players[i].Treasures.length}`
       if(gmSt.PlayersState.players[i].Treasures.length > 0 ){
         document.querySelector(`#pc${i+1}`).innerHTML = `<img class="currentCards" src="./icons/tr${gmSt.PlayersState.players[i].Treasures[gmSt.PlayersState.players[i].Treasures.length-1]+1}.png" > `
        }
        else 
        {
            document.querySelector(`#pc${i+1}`).innerHTML = "None, Back to your Place to win.";
        }
  
    }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////

function checkTreasure()
{    
    for(let i = 0 ; i < gmSt.NumberOfPlayer ; i++)
    {
        let temoloc = new coordinates(gmSt.PlayersState.players[i].roomIndI,gmSt.PlayersState.players[i].roomIndJ)
        if(gmSt.boardState.board[temoloc.x][temoloc.y].hasTreasure &&  gmSt.PlayersState.players[i].Treasures[gmSt.PlayersState.players[i].Treasures.length - 1] === gmSt.boardState.board[temoloc.x][temoloc.y].treasureInd )
        {  // console.log(`${i+1}found  treasure `);
            tresArr[gmSt.boardState.board[temoloc.x][temoloc.y].treasureInd].hidden = true;
            gmSt.PlayersState.players[i].Treasures.pop();
            gmSt.boardState.board[temoloc.x][temoloc.y].hasTreasure = false;
            gmSt.boardState.board[temoloc.x][temoloc.y].treasureInd = null;
            document.querySelector("#getTres").play();
          
        }
    }

    setBoxInfo();
    checkWinner();

}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function init ()
{
    //boardGUI.hidden = false;

    // for(let i = 0 ; i < gmSt.NumberOfPlayer ; i++)
    // {
    //     let tempPlayer = new
    // }

  



    let tresIndcs =  []
    for( let t = 0 ; t < 7 ; ++t)
    {
        for ( let t2 = 0 ; t2 < 7 ; ++t2)
            if( !(t == 6 && t2 == 0) && !(t == 6 && t2 == 6) && !(t == 0 && t2 == 0) && !(t == 0 && t2 == 6) )
             tresIndcs.push(`${t}${t2}`);
    }  

    shuffle(tresIndcs);
    shuffle(tresIndcs);

    let f = 0;
    let p = 0;
    let pl = 0 ;
    let tr = 0;
    shuffle(possibleTypes)
    for (let i = 0 ; i < 7 ; i++)
    {
        for (let j = 0 ; j < 7 ; j++)
        {
            if((tresIndcs.slice(0,gmSt.NumberOfTreasure).includes([i,j].join(""))) && tr < gmSt.NumberOfTreasure)
            {
                gmSt.boardState.board[i][j].hasTreasure = true;
                gmSt.boardState.board[i][j].treasureInd = tr ;
                tr++;
            }

            gmSt.boardState.board[i][j].coordinates = new coordinates(ROOM_SIZE*i , ROOM_SIZE * j );
            if (i % 2 == 0 && j % 2 ==0 ){
                //Fixed in state 
                gmSt.boardState.board[i][j].type = fixedRooms[f].type;
                gmSt.boardState.board[i][j].rotation = fixedRooms[f].rotation;
                if(( (i == 0 && j == 0) ||  (i == 0 && j == 6) ||  (i == 6 && j == 0) ||  (i == 6 && j == 6) )  && pl < gmSt.NumberOfPlayer)
                {

                    gmSt.boardState.board[i][j].hasPlayer = true;
                    gmSt.boardState.board[i][j].playerInd.push(pl);
                    gmSt.PlayersState.players.push(new Player());
                    gmSt.PlayersState.players[pl].roomIndI = i;
                    gmSt.PlayersState.players[pl].roomIndJ = j;
                    gmSt.PlayersState.players[pl].OrigIndI = i;
                    gmSt.PlayersState.players[pl].OrigIndJ = j;
                   

                    pl++;
                }
              
                f++;
               }

            else 
            {
                let rangRotation  = rotations[(Math.floor( Math.random() * rotations.length))]
                gmSt.boardState.board[i][j].type = possibleTypes[p];
                gmSt.boardState.board[i][j].rotation = rangRotation;
                p++;
            }  
        }
    }

    let rangRotation  = rotations[(Math.floor( Math.random() * rotations.length))]
    gmSt.boardState.moveableRoom.type = possibleTypes[p];
    gmSt.boardState.moveableRoom.rotation = rangRotation;
    gmSt.boardState.moveableRoom.coordinates = new coordinates(-ROOM_SIZE , -ROOM_SIZE );
    let trs = 0;
////////////
   
let treasesIndcs = []
 for(let i = 0 ; i < gmSt.NumberOfTreasure ; i ++)
{
    treasesIndcs.push(i)
}
shuffle(treasesIndcs);
shuffle(treasesIndcs)

while(trs < gmSt.NumberOfTreasure)
{
    for(let k  = 0 ; k < gmSt.NumberOfPlayer ;k++ ){
        gmSt.PlayersState.players[k].Treasures.push(treasesIndcs[trs]);
        trs++;
     }
}



    //////////
    setOpenings();
nextPlayer();
setBoxInfo();

    draw();
     ;

}


/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


function draw ()
{
    for (let i = 0 ; i < 7 ; i++)
    {
        for (let j = 0 ; j < 7 ; j++)
        {
                boardGUIMatx[i][j].src = `./icons/${gmSt.boardState.board[i][j].type}.png`;
                boardGUIMatx[i][j].style.transform = `rotate(${gmSt.boardState.board[i][j].rotation}deg)`;
                boardGUIMatx[i][j].style.left =  `${gmSt.boardState.board[i][j].coordinates.y}px`;
                boardGUIMatx[i][j].style.top =  `${gmSt.boardState.board[i][j].coordinates.x}px`;

                if (gmSt.boardState.board[i][j].hasPlayer)
                {
                     gmSt.boardState.board[i][j].playerInd.forEach ( a => {
                                if ( a == 0 || a  == 2 )
                                {
                                    plyrArr[a].style.top = `${3+(19* a) + gmSt.boardState.board[i][j].coordinates.x }px`
                                    plyrArr[a].style.left = `${3 + gmSt.boardState.board[i][j].coordinates.y }px`
                                }
                                else{

                                    if ( a == 1) {
                                        plyrArr[a].style.top = `${ 3 + gmSt.boardState.board[i][j].coordinates.x }px`

                                    }
                                    else {plyrArr[a].style.top = `${ 40+gmSt.boardState.board[i][j].coordinates.x }px` }

                                    plyrArr[a].style.left = `${44 + gmSt.boardState.board[i][j].coordinates.y }px`
                                }

                            
                    });
                }

                if (gmSt.boardState.board[i][j].hasTreasure)
                {
                    tresArr[gmSt.boardState.board[i][j].treasureInd].style.top = `${(TRASURE_SIZE +10 ) + gmSt.boardState.board[i][j].coordinates.x }px`
                    tresArr[gmSt.boardState.board[i][j].treasureInd].style.left = `${(TRASURE_SIZE +10 ) + gmSt.boardState.board[i][j].coordinates.y }px`
                    tresArr[gmSt.boardState.board[i][j].treasureInd].hidden = false;
                }

        }   
    }

    if (gmSt.boardState.moveableRoom.hasTreasure)
    {
        tresArr[gmSt.boardState.moveableRoom.treasureInd].style.top = `${(TRASURE_SIZE +10 ) + gmSt.boardState.moveableRoom.coordinates.x }px`
        tresArr[gmSt.boardState.moveableRoom.treasureInd].style.left = `${(TRASURE_SIZE +10 ) + gmSt.boardState.moveableRoom.coordinates.y }px`
    }

    moveableRoomGUI.src = `./icons/${gmSt.boardState.moveableRoom.type}.png`;
    moveableRoomGUI.style.top = `${gmSt.boardState.moveableRoom.coordinates.x}px`
    moveableRoomGUI.style.left =  `${gmSt.boardState.moveableRoom.coordinates.y}px`;
    moveableRoomGUI.style.transform = `rotate(${gmSt.boardState.moveableRoom.rotation}deg)`;

} 

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////

function slideRowsRight(e,r) {

    if (!gmSt.timeToMoveRoom)
        return;


let tempRoom = new Room;
document.querySelector("#slide").play();


 let classAnimRoom ;
  let classAnimTreas;
if(e.target.id  === "ar7")
{
    classAnimRoom = "moveToFirstRowRight";
    classAnimTreas = "moveToFirstRowRightTreas";
}

if(e.target.id  === "ar8")
{
    classAnimRoom = "moveToSecondRowRight";
    classAnimTreas = "moveToSecondRowRightTreas";
}


if(e.target.id  === "ar9")
{
    classAnimRoom = "moveToThirdRowRight";
    classAnimTreas = "moveToThirdRowRightTreas";
}




if(gmSt.boardState.moveableRoom.hasTreasure)
{
 tresArr[gmSt.boardState.moveableRoom.treasureInd].classList.add(classAnimTreas)
}

if(gmSt.boardState.board[r][6].hasPlayer)
{
    gmSt.boardState.board[r][6].playerInd.forEach(a => {
        plyrArr[a].classList.add(classAnimTreas);
    } )
 //plyrArr[gmSt.boardState.board[r][6].playerInd[0]].classList.add(classAnimTreas)
}


  tempRoom.type = gmSt.boardState.board[r][6].type;
  tempRoom.rotation = gmSt.boardState.board[r][6].rotation;
  tempRoom.hasTreasure = gmSt.boardState.board[r][6].hasTreasure;
  tempRoom.treasureInd = gmSt.boardState.board[r][6].treasureInd;
  tempRoom.coordinates =  gmSt.boardState.board[r][6].coordinates
  if(gmSt.boardState.board[r][6].hasPlayer)
  {
    tempRoom.hasPlayer =true;
    tempRoom.playerInd = gmSt.boardState.board[r][6].playerInd.slice();
    gmSt.boardState.board[r][6].hasPlayer = false;
    gmSt.boardState.board[r][6].playerInd = [];
    
  }
 

    for(let j = 6 ; j > 0 ; j--)
    {
        gmSt.boardState.board[r][j].type = gmSt.boardState.board[r][j-1].type;      
        gmSt.boardState.board[r][j].hasTreasure = gmSt.boardState.board[r][j-1].hasTreasure;
        gmSt.boardState.board[r][j].hasPlayer = gmSt.boardState.board[r][j-1].hasPlayer;
        gmSt.boardState.board[r][j].treasureInd = gmSt.boardState.board[r ][j-1].treasureInd;
        gmSt.boardState.board[r][j].playerInd = gmSt.boardState.board[r ][j-1].playerInd.slice();
        gmSt.boardState.board[r][j].rotation = gmSt.boardState.board[r][j-1].rotation;
    }

    gmSt.boardState.board[r][0].type = gmSt.boardState.moveableRoom.type
    gmSt.boardState.board[r][0].hasTreasure =  gmSt.boardState.moveableRoom.hasTreasure;
    gmSt.boardState.board[r][0].hasPlayer = tempRoom.hasPlayer;
    gmSt.boardState.board[r][0].treasureInd =  gmSt.boardState.moveableRoom.treasureInd;;
    gmSt.boardState.board[r][0].playerInd =  tempRoom.playerInd.slice();
    gmSt.boardState.board[r][0].rotation =  gmSt.boardState.moveableRoom.rotation;
  
    /////////
    gmSt.boardState.moveableRoom.coordinates.x =tempRoom.coordinates.x;
    gmSt.boardState.moveableRoom.coordinates.y =tempRoom.coordinates.y+75;
    gmSt.boardState.moveableRoom.type = tempRoom.type;
    gmSt.boardState.moveableRoom.rotation =tempRoom.rotation;
    gmSt.boardState.moveableRoom.hasTreasure =tempRoom.hasTreasure;
    gmSt.boardState.moveableRoom.treasureInd = tempRoom.treasureInd;
    gmSt.boardState.moveableRoom.hasPlayer= false ;

   gmSt.timeToMoveRoom = false;

    for(let i = 0 ; i < 7 ;++i)
    {
        for(let j = 0 ;j < 7 ;j++)
        {
            if(gmSt.boardState.board[i][j].hasPlayer)
            {
                for(let k  = 0 ; k < gmSt.boardState.board[i][j].playerInd.length ; k++)
                {
                    gmSt.PlayersState.players[gmSt.boardState.board[i][j].playerInd[k]].roomIndI = i;
                    gmSt.PlayersState.players[gmSt.boardState.board[i][j].playerInd[k]].roomIndJ = j;
                }
            }
        }
    }

    
   //////////////////////Try to animate 

    moveableRoomGUI.classList.replace("moveable",classAnimRoom);
   


    let diff = 0 ;
 
    let ddd = setInterval(function (){slideAnimation(r)},9);
 
     function slideAnimation(i)
    {
             if( diff == 75)
              { 
                 clearInterval(ddd)
              }
 
          else{
              for(let j = 0 ; j < 7 ; j++)
                      {
          boardGUIMatx[i][j].style.left = (parseFloat( boardGUIMatx[i][j].style.left) +1) + "px";

          if (gmSt.boardState.board[i][j].hasPlayer )
          {
            gmSt.boardState.board[i][j].playerInd.forEach(a => {
                plyrArr[a].style.left = `${parseFloat(plyrArr[a].style.left) +1  }px`
            } )

             // plyrArr[gmSt.boardState.board[i][j].playerInd[0]].style.left = `${parseFloat(plyrArr[gmSt.boardState.board[i][j].playerInd[0]].style.left +1)}px`
 
          }
          
    

          if (gmSt.boardState.board[i][j].hasTreasure)
          {
              tresArr[gmSt.boardState.board[i][j].treasureInd].style.left = `${parseFloat(tresArr[gmSt.boardState.board[i][j].treasureInd].style.left) +1  }px`
          }

        
 
    }

    if( gmSt.boardState.moveableRoom.hasPlayer)
         {
            gmSt.boardState.moveableRoom.playerInd.forEach(a => {
                plyrArr[a].style.left = `${parseFloat(plyrArr[a].style.left) +1  }px`
            } )

           // plyrArr[gmSt.boardState.moveableRoom.playerInd[0]].style.left = `${parseFloat(plyrArr[gmSt.boardState.moveableRoom.playerInd[0]].style.left +1)}px`

      }
    if (gmSt.boardState.moveableRoom.hasTreasure)
    {
        tresArr[gmSt.boardState.moveableRoom.treasureInd].style.left = `${parseFloat(tresArr[gmSt.boardState.moveableRoom.treasureInd].style.left) +1  }px`
    }
         diff++;
        }
  }
    
 ///////////////////////////////////////////////
 
 
    setTimeout( function(){moveableRoomGUI.classList.replace(classAnimRoom,"moveable");draw(); setOpenings(); 
    tresArr.forEach(a => a.classList.remove(classAnimTreas))
        plyrArr.forEach(a => a.classList.remove(classAnimTreas))   
        checkTreasure();  
            movingPlayers();
         }, 900 );
          

 }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function slideRowsLeft(e,r) {

    if (!gmSt.timeToMoveRoom)
        return;

        document.querySelector("#save").removeEventListener("click", Save)
        document.querySelector("#restart").removeEventListener("click",restart);
        
let tempRoom = new Room;
document.querySelector("#slide").play();

let classAnimRoom;
let classAnimTreas;

if(e.target.id  === "ar10")
{
    classAnimRoom = "moveToFirstRowLeft";
    classAnimTreas = "moveToFirstRowLeftTreas";
}

if(e.target.id  === "ar11")
{
    classAnimRoom = "moveToSecondRowLeft";
    classAnimTreas = "moveToSecondRowLeftTreas";
}


if(e.target.id  === "ar12")
{
    classAnimRoom = "moveToThirdRowLeft";
    classAnimTreas = "moveToThirdRowLeftTreas";
}



if(gmSt.boardState.moveableRoom.hasTreasure)
{
 tresArr[gmSt.boardState.moveableRoom.treasureInd].classList.add(classAnimTreas)
}

if(gmSt.boardState.board[r][0].hasPlayer)
{
    gmSt.boardState.board[r][0].playerInd.forEach(a => {
        plyrArr[a].classList.add(classAnimTreas);
    } )

 


 //plyrArr[gmSt.boardState.board[r][0].playerInd[0]].classList.add(classAnimTreas)
}


  tempRoom.type = gmSt.boardState.board[r][0].type;
  tempRoom.rotation = gmSt.boardState.board[r][0].rotation;
  tempRoom.hasTreasure = gmSt.boardState.board[r][0].hasTreasure;
  tempRoom.treasureInd = gmSt.boardState.board[r][0].treasureInd;
  tempRoom.coordinates =  gmSt.boardState.board[r][0].coordinates
  if(gmSt.boardState.board[r][0].hasPlayer)
  {
    tempRoom.hasPlayer =true;
    tempRoom.playerInd = gmSt.boardState.board[r][0].playerInd.slice();
    gmSt.boardState.board[r][0].hasPlayer = false;
    gmSt.boardState.board[r][0].playerInd = [];
    
  }
 

    for(let j = 0 ; j  <6 ; j++)
    {
        gmSt.boardState.board[r][j].type = gmSt.boardState.board[r][j+1].type;      
        gmSt.boardState.board[r][j].hasTreasure = gmSt.boardState.board[r][j+1].hasTreasure;
        gmSt.boardState.board[r][j].hasPlayer = gmSt.boardState.board[r][j+1].hasPlayer;
        gmSt.boardState.board[r][j].treasureInd = gmSt.boardState.board[r][j+1].treasureInd;
        gmSt.boardState.board[r][j].playerInd = gmSt.boardState.board[r][j+1].playerInd.slice();
        gmSt.boardState.board[r][j].rotation = gmSt.boardState.board[r][j+1].rotation;
    }

    gmSt.boardState.board[r][6].type = gmSt.boardState.moveableRoom.type
    gmSt.boardState.board[r][6].hasTreasure =  gmSt.boardState.moveableRoom.hasTreasure;
    gmSt.boardState.board[r][6].hasPlayer = tempRoom.hasPlayer;
    gmSt.boardState.board[r][6].treasureInd =  gmSt.boardState.moveableRoom.treasureInd;;
    gmSt.boardState.board[r][6].playerInd =  tempRoom.playerInd.slice();
    gmSt.boardState.board[r][6].rotation =  gmSt.boardState.moveableRoom.rotation;
  
    /////////
    gmSt.boardState.moveableRoom.coordinates.x =tempRoom.coordinates.x;
    gmSt.boardState.moveableRoom.coordinates.y =tempRoom.coordinates.y-75;
    gmSt.boardState.moveableRoom.type = tempRoom.type;
    gmSt.boardState.moveableRoom.rotation =tempRoom.rotation;
    gmSt.boardState.moveableRoom.hasTreasure =tempRoom.hasTreasure;
    gmSt.boardState.moveableRoom.treasureInd = tempRoom.treasureInd;
    gmSt.boardState.moveableRoom.hasPlayer= false ;

  gmSt.timeToMoveRoom = false;

    for(let i = 0 ; i < 7 ;++i)
    {
        for(let j = 0 ;j < 7 ;j++)
        {
            if(gmSt.boardState.board[i][j].hasPlayer)
            {
                for(let k  = 0 ; k < gmSt.boardState.board[i][j].playerInd.length ; k++)
                {
                    gmSt.PlayersState.players[gmSt.boardState.board[i][j].playerInd[k]].roomIndI = i;
                    gmSt.PlayersState.players[gmSt.boardState.board[i][j].playerInd[k]].roomIndJ = j;
                }
            }
        }
    }

    
   //////////////////////Try to animate 

    moveableRoomGUI.classList.replace("moveable",classAnimRoom);
   


    let diff = 0 ;
 
    let ddd = setInterval(function (){slideAnimation(r)},9);
 
     function slideAnimation(i)
    {
             if( diff == 75)
              { 
                 clearInterval(ddd)
              }
 
          else{
              for(let j = 0 ; j < 7 ; j++)
                      {
          boardGUIMatx[i][j].style.left = (parseFloat( boardGUIMatx[i][j].style.left) -1) + "px";

          if (gmSt.boardState.board[i][j].hasPlayer )
          {
            gmSt.boardState.board[i][j].playerInd.forEach(a => {
                plyrArr[a].style.left = `${parseFloat(plyrArr[a].style.left) -1  }px`
            } )
             // plyrArr[gmSt.boardState.board[i][j].playerInd[0]].style.left = `${parseFloat(plyrArr[gmSt.boardState.board[i][j].playerInd[0]].style.left -1)}px`
 
          }
          
          if (gmSt.boardState.board[i][j].hasTreasure)
          {
              tresArr[gmSt.boardState.board[i][j].treasureInd].style.left = `${parseFloat(tresArr[gmSt.boardState.board[i][j].treasureInd].style.left) -1  }px`
          }

        
 
    }

    if( gmSt.boardState.moveableRoom.hasPlayer)
         {
            gmSt.boardState.moveableRoom.playerInd.forEach(a => {
                plyrArr[a].style.left = `${parseFloat(plyrArr[a].style.left) -1  }px`
            } )

           // plyrArr[gmSt.boardState.moveableRoom.playerInd[0]].style.left = `${parseFloat(plyrArr[gmSt.boardState.moveableRoom.playerInd[0]].style.left -1)}px`

      }


    if (gmSt.boardState.moveableRoom.hasTreasure)
    {
        tresArr[gmSt.boardState.moveableRoom.treasureInd].style.left = `${parseFloat(tresArr[gmSt.boardState.moveableRoom.treasureInd].style.left) -1  }px`
    }
         diff++;
        }
  }
    
 
 
 /////////
    setTimeout( function(){moveableRoomGUI.classList.replace(classAnimRoom,"moveable");draw(); setOpenings();
    tresArr.forEach(a => a.classList.remove(classAnimTreas))
    plyrArr.forEach(a => a.classList.remove(classAnimTreas))

    checkTreasure()
                  movingPlayers()
         }, 900 );

 }

 ///////////////////////////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function slideColsDown(e,c) {

    if (!gmSt.timeToMoveRoom)
        return;



     
let tempRoom = new Room;
document.querySelector("#slide").play();

let classAnimRoom;
let classAnimTreas;

if(e.target.id === "ar4")
{
    classAnimRoom = "moveToFirstColDown"
    classAnimTreas = "moveToFirstColDownTreas"
}

if(e.target.id === "ar5")
{
    classAnimRoom = "moveToSecondColDown"
    classAnimTreas = "moveToSecondColDownTreas"
}
if(e.target.id === "ar6")
{
    classAnimRoom = "moveToThirdColDown"
    classAnimTreas = "moveToThirdColDownTreas"
}
document.querySelector("#save").removeEventListener("click", Save)
document.querySelector("#restart").removeEventListener("click",restart);
   


if(gmSt.boardState.moveableRoom.hasTreasure)
{
 tresArr[gmSt.boardState.moveableRoom.treasureInd].classList.add(classAnimTreas)
}

if(gmSt.boardState.board[6][c].hasPlayer)
{
    gmSt.boardState.board[6][c].playerInd.forEach(a => {
        plyrArr[a].classList.add(classAnimTreas);
    } )
 //plyrArr[gmSt.boardState.board[6][c].playerInd[0]].classList.add(classAnimTreas)
}


  tempRoom.type = gmSt.boardState.board[6][c].type;
  tempRoom.rotation = gmSt.boardState.board[6][c].rotation;
  tempRoom.hasTreasure = gmSt.boardState.board[6][c].hasTreasure;
  tempRoom.treasureInd = gmSt.boardState.board[6][c].treasureInd;
  tempRoom.coordinates =  gmSt.boardState.board[6][c].coordinates
  if(gmSt.boardState.board[6][c].hasPlayer)
  {
    tempRoom.hasPlayer =true;
    tempRoom.playerInd = gmSt.boardState.board[6][c].playerInd.slice();
    gmSt.boardState.board[6][c].hasPlayer = false;
    gmSt.boardState.board[6][c].playerInd = [];
    
  }
 

    for(let i = 6 ; i > 0 ; i--)
    {
        gmSt.boardState.board[i][c].type = gmSt.boardState.board[i-1][c].type;      
        gmSt.boardState.board[i][c].hasTreasure = gmSt.boardState.board[i-1][c].hasTreasure;
        gmSt.boardState.board[i][c].hasPlayer = gmSt.boardState.board[i-1][c].hasPlayer;
        gmSt.boardState.board[i][c].treasureInd = gmSt.boardState.board[i-1][c].treasureInd;
        gmSt.boardState.board[i][c].playerInd = gmSt.boardState.board[i-1][c].playerInd.slice();
        gmSt.boardState.board[i][c].rotation = gmSt.boardState.board[i-1][c].rotation;
    }

    gmSt.boardState.board[0][c].type = gmSt.boardState.moveableRoom.type
    gmSt.boardState.board[0][c].hasTreasure =  gmSt.boardState.moveableRoom.hasTreasure;
    gmSt.boardState.board[0][c].hasPlayer = tempRoom.hasPlayer;
    gmSt.boardState.board[0][c].treasureInd =  gmSt.boardState.moveableRoom.treasureInd;;
    gmSt.boardState.board[0][c].playerInd =  tempRoom.playerInd.slice();
    gmSt.boardState.board[0][c].rotation =  gmSt.boardState.moveableRoom.rotation;
  
    /////////
    gmSt.boardState.moveableRoom.coordinates.x =tempRoom.coordinates.x+75;
    gmSt.boardState.moveableRoom.coordinates.y =tempRoom.coordinates.y;
    gmSt.boardState.moveableRoom.type = tempRoom.type;
    gmSt.boardState.moveableRoom.rotation =tempRoom.rotation;
    gmSt.boardState.moveableRoom.hasTreasure =tempRoom.hasTreasure;
    gmSt.boardState.moveableRoom.treasureInd = tempRoom.treasureInd;
    gmSt.boardState.moveableRoom.hasPlayer= false ;

   gmSt.timeToMoveRoom = false;

    for(let i = 0 ; i < 7 ;++i)
    {
        for(let j = 0 ;j < 7 ;j++)
        {
            if(gmSt.boardState.board[i][j].hasPlayer)
            {
                for(let k  = 0 ; k < gmSt.boardState.board[i][j].playerInd.length ; k++)
                {
                    gmSt.PlayersState.players[gmSt.boardState.board[i][j].playerInd[k]].roomIndI = i;
                    gmSt.PlayersState.players[gmSt.boardState.board[i][j].playerInd[k]].roomIndJ = j;
                }
            }
        }
    }

    
   //////////////////////Try to animate 

    moveableRoomGUI.classList.replace("moveable",classAnimRoom);
   


    let diff = 0 ;
 
    let ddd = setInterval(function (){slideAnimation(c)},9);
 
     function slideAnimation(j)
    {
             if( diff == 75)
              { 
                 clearInterval(ddd)
              }
 
          else{
              for(let i = 0 ; i < 7 ; i++)
                      {

          boardGUIMatx[i][j].style.top = (parseFloat( boardGUIMatx[i][j].style.top) +1) + "px";


           if (gmSt.boardState.board[i][j].hasPlayer )
           {
            gmSt.boardState.board[i][j].playerInd.forEach(a => {
                plyrArr[a].style.top = `${parseFloat(plyrArr[a].style.top) +1  }px`
            } ) 
           }
          
           

          if (gmSt.boardState.board[i][j].hasTreasure)
          {
              tresArr[gmSt.boardState.board[i][j].treasureInd].style.top = `${parseFloat(tresArr[gmSt.boardState.board[i][j].treasureInd].style.top) +1  }px`
          }

        
 
    }

    if( gmSt.boardState.moveableRoom.hasPlayer)
         {
            gmSt.boardState.moveableRoom.playerInd.forEach(a => {
                plyrArr[a].style.top = `${parseFloat(plyrArr[a].style.top) +1  }px`
            } )
            //plyrArr[gmSt.boardState.moveableRoom.playerInd[0]].style.top = `${parseFloat(plyrArr[gmSt.boardState.moveableRoom.playerInd[0]].style.top +1)}px`

      }
    if (gmSt.boardState.moveableRoom.hasTreasure)
    {
        tresArr[gmSt.boardState.moveableRoom.treasureInd].style.top = `${parseFloat(tresArr[gmSt.boardState.moveableRoom.treasureInd].style.top) +1  }px`
    }
         diff++;
        }
  }
    
 
 
 /////////
    setTimeout( function(){moveableRoomGUI.classList.replace(classAnimRoom,"moveable");draw(); setOpenings(); 
    tresArr.forEach(a => a.classList.remove(classAnimTreas))
    plyrArr.forEach(a => a.classList.remove(classAnimTreas))
    checkTreasure()
               movingPlayers()
         }, 900 );

 }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function slideColsUp(e,j) 
{
    if (!gmSt.timeToMoveRoom)
        return;

 let classAnimRoom ;
 let classAnimTreas;
 document.querySelector("#slide").play();

if(e.target.id == "ar3")
{
     classAnimRoom = "moveToThirdColUp"
     classAnimTreas = "moveToThirdColUpTreas"
}

if(e.target.id == "ar2")
{
     classAnimRoom = "moveToSecondColUp"
     classAnimTreas = "moveToSecondColUpTreas"
}

if(e.target.id == "ar1")
{
     classAnimRoom = "moveToFirstColUp"
     classAnimTreas = "moveToFirstColUpTreas"
}

document.querySelector("#save").removeEventListener("click", Save)
document.querySelector("#restart").removeEventListener("click",restart);
   



let tempRoom = new Room;

if(gmSt.boardState.moveableRoom.hasTreasure)
{
 tresArr[gmSt.boardState.moveableRoom.treasureInd].classList.add(classAnimTreas)
}

if(gmSt.boardState.board[0][j].hasPlayer){
 
    gmSt.boardState.board[0][j].playerInd.forEach(a => {
        plyrArr[a].classList.add(classAnimTreas);
    } )

    //plyrArr[gmSt.boardState.board[0][j].playerInd[0]].classList.add(classAnimTreas)
}


  tempRoom.type = gmSt.boardState.board[0][j].type;
  tempRoom.rotation = gmSt.boardState.board[0][j].rotation;
  tempRoom.hasTreasure = gmSt.boardState.board[0][j].hasTreasure;
  tempRoom.treasureInd = gmSt.boardState.board[0][j].treasureInd;
  tempRoom.coordinates =  gmSt.boardState.board[0][j].coordinates
  if(gmSt.boardState.board[0][j].hasPlayer)
  {
    tempRoom.hasPlayer =true;
    tempRoom.playerInd = gmSt.boardState.board[0][j].playerInd.slice();
    gmSt.boardState.board[0][j].hasPlayer = false;
    gmSt.boardState.board[0][j].playerInd = [];
    
  }
 

    for(let i = 0 ; i  <6 ; i++)
    {
        gmSt.boardState.board[i][j].type = gmSt.boardState.board[i+1][j].type;      
        gmSt.boardState.board[i][j].hasTreasure = gmSt.boardState.board[i+1][j].hasTreasure;
        gmSt.boardState.board[i][j].hasPlayer = gmSt.boardState.board[i+1][j].hasPlayer;
        gmSt.boardState.board[i][j].treasureInd = gmSt.boardState.board[i+1][j].treasureInd;
        gmSt.boardState.board[i][j].playerInd = gmSt.boardState.board[i+1][j].playerInd.slice();
        gmSt.boardState.board[i][j].rotation = gmSt.boardState.board[i+1][j].rotation;
    }

    gmSt.boardState.board[6][j].type = gmSt.boardState.moveableRoom.type
    gmSt.boardState.board[6][j].hasTreasure =  gmSt.boardState.moveableRoom.hasTreasure;
    gmSt.boardState.board[6][j].hasPlayer = tempRoom.hasPlayer;
    gmSt.boardState.board[6][j].treasureInd =  gmSt.boardState.moveableRoom.treasureInd;;
    gmSt.boardState.board[6][j].playerInd =  tempRoom.playerInd.slice();
    gmSt.boardState.board[6][j].rotation =  gmSt.boardState.moveableRoom.rotation;
  
    /////////
    gmSt.boardState.moveableRoom.coordinates.x =tempRoom.coordinates.x-75;
    gmSt.boardState.moveableRoom.coordinates.y =tempRoom.coordinates.y;
    gmSt.boardState.moveableRoom.type = tempRoom.type;
    gmSt.boardState.moveableRoom.rotation =tempRoom.rotation;
    gmSt.boardState.moveableRoom.hasTreasure =tempRoom.hasTreasure;
    gmSt.boardState.moveableRoom.treasureInd = tempRoom.treasureInd;
    gmSt.boardState.moveableRoom.hasPlayer= false ;

   gmSt.timeToMoveRoom = false;

    for(let i = 0 ; i < 7 ;++i)
    {
        for(let c = 0 ;c < 7 ;c++)
        {
            if(gmSt.boardState.board[i][c].hasPlayer)
            {
                for(let k  = 0 ; k < gmSt.boardState.board[i][c].playerInd.length ; k++)
                {
                    gmSt.PlayersState.players[gmSt.boardState.board[i][c].playerInd[k]].roomIndI = i;
                    gmSt.PlayersState.players[gmSt.boardState.board[i][c].playerInd[k]].roomIndJ = c;
                }
            }
        }
    }

    
   //////////////////////Try to animate 

    moveableRoomGUI.classList.replace("moveable",classAnimRoom);
   


    let diff = 0 ;
 
    let ddd = setInterval(function (){slideAnimation(j)},9);
 
     function slideAnimation(j)
    {
             if( diff == 75)
              { 
                 clearInterval(ddd)
              }
 
          else{
              for(let i = 0 ; i < 7 ; i++)
                      {
          boardGUIMatx[i][j].style.top = (parseFloat( boardGUIMatx[i][j].style.top) -1) + "px";
        //   if (gmSt.boardState.board[i][j].hasPlayer )
        //   {
        //       plyrArr[gmSt.boardState.board[i][j].playerInd[0]].style.top = `${parseFloat(plyrArr[gmSt.boardState.board[i][j].playerInd[0]].style.top -1)}px`
 
        //   }
          if (gmSt.boardState.board[i][j].hasPlayer)
          { 
            gmSt.boardState.board[i][j].playerInd.forEach(a => {
                plyrArr[a].style.top = `${parseFloat(plyrArr[a].style.top) -1  }px`
            } )
          }

          if (gmSt.boardState.board[i][j].hasTreasure)
          {
              tresArr[gmSt.boardState.board[i][j].treasureInd].style.top = `${parseFloat(tresArr[gmSt.boardState.board[i][j].treasureInd].style.top) -1  }px`
          }

        
 
    }

    if( gmSt.boardState.moveableRoom.hasPlayer)
         {
            gmSt.boardState.moveableRoom.playerInd.forEach(a => {
                plyrArr[a].style.top = `${parseFloat(plyrArr[a].style.top) -1  }px`
            } )

         //   plyrArr[gmSt.boardState.moveableRoom.playerInd[0]].style.top = `${parseFloat(plyrArr[gmSt.boardState.moveableRoom.playerInd[0]].style.top -1)}px`

      }


    if (gmSt.boardState.moveableRoom.hasTreasure)
    {
        tresArr[gmSt.boardState.moveableRoom.treasureInd].style.top = `${parseFloat(tresArr[gmSt.boardState.moveableRoom.treasureInd].style.top) -1  }px`
    }


         diff++;
 }
  }
    
 
 
 /////////
    setTimeout( function(){moveableRoomGUI.classList.replace(classAnimRoom,"moveable");draw(); setOpenings(); 
    tresArr.forEach(a => a.classList.remove(classAnimTreas))
    plyrArr.forEach(a => a.classList.remove(classAnimTreas))
  
    checkTreasure()
            movingPlayers()
           
         }, 900 );

 }
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////



///////////
function calcRotation360Deg(r)
{
        while( r <= -360 )
        {
            r+=360;
        }
        return r;
}


//////////////////
function setOpenings() {

    for(let i = 0 ; i < 7 ; i ++)
    {
        for(let j = 0 ; j < 7 ; j ++)
        {

            
                if(gmSt.boardState.board[i][j].type === "line")
                {

                   if ( calcRotation360Deg(gmSt.boardState.board[i][j].rotation) == 0 ||calcRotation360Deg(gmSt.boardState.board[i][j].rotation) == -180 )
                    {
                        gmSt.boardState.board[i][j].openLeft =true;
                        gmSt.boardState.board[i][j].openRight = true;
                        gmSt.boardState.board[i][j].openDown = false;
                        gmSt.boardState.board[i][j].openUp = false;
                    }
                    else{
                        gmSt.boardState.board[i][j].openLeft = false;
                        gmSt.boardState.board[i][j].openRight = false;
                        gmSt.boardState.board[i][j].openDown = true;
                        gmSt.boardState.board[i][j].openUp = true;
                    }
                }
                if (gmSt.boardState.board[i][j].type === "T") {

                    if ( calcRotation360Deg(gmSt.boardState.board[i][j].rotation) == 0 )
                    {
                        gmSt.boardState.board[i][j].openLeft = true;
                        gmSt.boardState.board[i][j].openRight = true;
                        gmSt.boardState.board[i][j].openDown = true;
                        gmSt.boardState.board[i][j].openUp = false;
                    }
                    if(calcRotation360Deg(gmSt.boardState.board[i][j].rotation) == -90)
                    {
                        gmSt.boardState.board[i][j].openLeft = false;
                        gmSt.boardState.board[i][j].openRight = true;
                        gmSt.boardState.board[i][j].openDown = true;
                        gmSt.boardState.board[i][j].openUp = true;
                    }
                    if(calcRotation360Deg(gmSt.boardState.board[i][j].rotation) == -180)
                    {
                        gmSt.boardState.board[i][j].openLeft = true;
                        gmSt.boardState.board[i][j].openRight = true;
                        gmSt.boardState.board[i][j].openDown = false;
                        gmSt.boardState.board[i][j].openUp = true;
                    }

                    if(calcRotation360Deg(gmSt.boardState.board[i][j].rotation) == -270)
                    {
                        gmSt.boardState.board[i][j].openLeft = true;
                        gmSt.boardState.board[i][j].openRight = false;
                        gmSt.boardState.board[i][j].openDown = true;
                        gmSt.boardState.board[i][j].openUp = true;
                    }

                }

                if (gmSt.boardState.board[i][j].type === "corner") {

                    if ( calcRotation360Deg(gmSt.boardState.board[i][j].rotation) == 0 )
                    {
                        gmSt.boardState.board[i][j].openLeft = false;
                        gmSt.boardState.board[i][j].openRight = true;
                        gmSt.boardState.board[i][j].openDown = true;
                        gmSt.boardState.board[i][j].openUp = false;
                    }
                    if(calcRotation360Deg(gmSt.boardState.board[i][j].rotation) == -90)
                    {
                        gmSt.boardState.board[i][j].openLeft = false;
                        gmSt.boardState.board[i][j].openRight = true;
                        gmSt.boardState.board[i][j].openDown = false;
                        gmSt.boardState.board[i][j].openUp = true;
                    }
                    if(calcRotation360Deg(gmSt.boardState.board[i][j].rotation) == -180)
                    {
                        gmSt.boardState.board[i][j].openLeft = true;
                        gmSt.boardState.board[i][j].openRight = false;
                        gmSt.boardState.board[i][j].openDown = false;
                        gmSt.boardState.board[i][j].openUp = true;
                    }

                    if(calcRotation360Deg(gmSt.boardState.board[i][j].rotation) == -270)
                    {
                        gmSt.boardState.board[i][j].openLeft = true;
                        gmSt.boardState.board[i][j].openRight = false;
                        gmSt.boardState.board[i][j].openDown = true;
                        gmSt.boardState.board[i][j].openUp = false;
                    }

                }

            if(i === 0 )
                gmSt.boardState.board[i][j].openUp = false;

           if(i === 6 )
                gmSt.boardState.board[i][j].openDown = false;

            if(j == 0 )
                gmSt.boardState.board[i][j].openLeft = false;

           if(j == 6 )
                gmSt.boardState.board[i][j].openRight = false;

        }
    }
    
}


/////////////
/////////////////////////////////////

function highlightPossible(r)
{


    r.highlighted = true;
    boardGUIMatx[r.coordinates.x/ ROOM_SIZE][r.coordinates.y/ ROOM_SIZE].classList.add("highlighted");
    boardGUIMatx[r.coordinates.x/ ROOM_SIZE][r.coordinates.y/ ROOM_SIZE].addEventListener("click",movePlayer);

    
    if(r.openRight && gmSt.boardState.board[r.coordinates.x/ROOM_SIZE][r.coordinates.y/ROOM_SIZE +1].openLeft &&  !gmSt.boardState.board[r.coordinates.x/ROOM_SIZE][r.coordinates.y/ROOM_SIZE +1].highlighted)
    {
        highlightPossible(gmSt.boardState.board[r.coordinates.x/ROOM_SIZE][r.coordinates.y/ROOM_SIZE +1])
    }

    if(r.openLeft && gmSt.boardState.board[r.coordinates.x/ROOM_SIZE][r.coordinates.y/ROOM_SIZE - 1].openRight &&  !gmSt.boardState.board[r.coordinates.x/ROOM_SIZE][r.coordinates.y/ROOM_SIZE - 1].highlighted)
    {
        highlightPossible(gmSt.boardState.board[r.coordinates.x/ROOM_SIZE][r.coordinates.y/ROOM_SIZE -1])
    }

    if(r.openUp && gmSt.boardState.board[r.coordinates.x/ROOM_SIZE -1 ][r.coordinates.y/ROOM_SIZE].openDown &&  !gmSt.boardState.board[r.coordinates.x/ROOM_SIZE -1][r.coordinates.y/ROOM_SIZE ].highlighted)
    {
        highlightPossible(gmSt.boardState.board[r.coordinates.x/ROOM_SIZE - 1][r.coordinates.y/ROOM_SIZE ])
    }

    if(r.openDown && gmSt.boardState.board[r.coordinates.x/ROOM_SIZE +1 ][r.coordinates.y/ROOM_SIZE ].openUp &&  !gmSt.boardState.board[r.coordinates.x/ROOM_SIZE + 1][r.coordinates.y/ROOM_SIZE ].highlighted)
    {
        highlightPossible(gmSt.boardState.board[r.coordinates.x/ROOM_SIZE + 1][r.coordinates.y/ROOM_SIZE])
    }

}


function DishighlightPossible()
{

    for(let i  = 0 ; i < 7 ; i++)
    {
        for(let  j = 0 ; j < 7 ; j++)
        {
            if (gmSt.boardState.board[i][j].highlighted)
            {
                gmSt.boardState.board[i][j].highlighted = false;
                boardGUIMatx[i][j].classList.remove("highlighted");
                boardGUIMatx[i][j].removeEventListener("click",movePlayer);
                
            }
        }
    }
}

function movePlayer(e)
{
    let locationNew = new coordinates(parseInt(e.target.id[0]),parseInt( e.target.id[1]))
    let locationOld = new coordinates(gmSt.PlayersState.players[gmSt.playerTurnInd].roomIndI,gmSt.PlayersState.players[gmSt.playerTurnInd].roomIndJ);
      
   // console.log(gmSt.boardState.board[locationOld.x][locationOld.y]);////////////////////////
   // console.log(gmSt.boardState.board[locationNew.x][locationNew.y]);////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //TRY TO ANIMATE PLAYERS HERE////
    document.querySelector("#moveP").play();
    let style = document.createElement('style');
    style.type = 'text/css';
    style.id = "TempClass";
    style.innerHTML = `
    .movePlayerClass { 
            animation-name: movePlayerClass;
            animation-duration: 0.9s;
            animation-iteration-count: 1;
         }
         
         @keyframes movePlayerClass{
             
             100% {left: ${20+(ROOM_SIZE * locationNew.y)}px; top: ${20+(ROOM_SIZE * locationNew.x)}px;}
         }
    
    }`;

    document.getElementsByTagName('head')[0].appendChild(style);

    plyrArr[gmSt.playerTurnInd].classList.add("movePlayerClass")

    setTimeout(function(){
        plyrArr.forEach(a => a.classList.remove("movePlayerClass"))
       // console.log("removed");
        document.querySelector("#TempClass").remove();
   
   /////////////////////////////////////



    DishighlightPossible(gmSt.boardState.board[locationOld.x][locationOld.y]);

   // console.log(`changed position of player ${gmSt.playerTurnInd+1}`);
    gmSt.boardState.board[locationNew.x][locationNew.y].hasPlayer = true;
    gmSt.boardState.board[locationNew.x][locationNew.y].playerInd.push(gmSt.playerTurnInd);
  
    gmSt.PlayersState.players[gmSt.playerTurnInd].roomIndI = locationNew.x
    gmSt.PlayersState.players[gmSt.playerTurnInd].roomIndJ = locationNew.y

    const index = gmSt.boardState.board[locationOld.x][locationOld.y].playerInd.indexOf(gmSt.playerTurnInd);
    if (index > -1) {gmSt.boardState.board[locationOld.x][locationOld.y].playerInd.splice(index, 1);}
   

    if ( gmSt.boardState.board[locationOld.x][locationOld.y].playerInd.length  ==  0 )
    {   
        gmSt.boardState.board[locationOld.x][locationOld.y].hasPlayer = false;
        gmSt.boardState.board[locationOld.x][locationOld.y].playerInd= [];

    }
   
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        gmSt.timeToMoveRoom = true;
        document.querySelector("#save").addEventListener("click", Save)
        document.querySelector("#restart").addEventListener("click",restart);           
        draw();
        nextPlayer();
        checkTreasure()
    },900)


}

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function movingPlayers() {

    let playerLoc = new coordinates ( gmSt.PlayersState.players[gmSt.playerTurnInd].roomIndI,gmSt.PlayersState.players[gmSt.playerTurnInd].roomIndJ);
    highlightPossible(gmSt.boardState.board[playerLoc.x][playerLoc.y]);
    
}

function nextPlayer()
{
    if(gmSt.playerTurnInd === -1 )
       { 
           gmSt.playerTurnInd++;
           document.querySelector(`#p${gmSt.playerTurnInd +1}`).classList.add("myTurn")
          // plyrArr[gmSt.playerTurnInd].classList.add("myTurnP")
            
            return
    
    }
    document.querySelector(`#p${gmSt.playerTurnInd +1}`).classList.remove("myTurn")
  //  plyrArr[gmSt.playerTurnInd].classList.remove("myTurnP")


   if( gmSt.playerTurnInd == gmSt.NumberOfPlayer - 1)
   {
    gmSt.playerTurnInd = 0;
   }
   else
   {
    gmSt.playerTurnInd ++;
   }

   document.querySelector(`#p${gmSt.playerTurnInd +1}`).classList.add("myTurn")
   //plyrArr[gmSt.playerTurnInd].classList.add("myTurnP")

}

function checkWinner()
{
  
    for (let i = 0; i < gmSt.NumberOfPlayer; i++) {
            
        if( gmSt.PlayersState.players[i].Treasures.length === 0  &&  gmSt.PlayersState.players[i].OrigIndI ===gmSt.PlayersState.players[i].roomIndI &&gmSt.PlayersState.players[i].OrigIndJ ===gmSt.PlayersState.players[i].roomIndJ )
        {

                boardGUI.hidden = true;
                document.querySelector("#winner").innerHTML = `Congaratulations player ${i+1}  <img src="./icons/pl${i+1}.png" height="33px" width="33px" > <br>You are the The first and only Survival.`
                document.querySelector("#winnerPanel").hidden = false;
                document.querySelector(`#p${i +1}`).classList.add("saved")
                document.querySelector(`#menu`).hidden = true;
                document.querySelector("#winS").play();


        }


    }


} 

