var pressed = {
  up: false,
  down: false,
  left:false,
  right:false,
  shift:false,
  space:false,
  toggleshoot: false
}
document.addEventListener('keydown', function(event) {
  if (listen) {console.log(event.keyCode)}
  switch (event.keyCode) {
    //case 65: // A
    case 65: // A
      pressed.left = true;
      break;
    //case 87: // W
    case 87: // W
      pressed.up = true;
      break;
    case 68: // D
      pressed.right = true;
      break;
    case 83: // S
      pressed.down = true;
      break;  
    case 16: // Shift
      pressed.shift = true;
      break; 
    case 32: // Space
      pressed.space = true;
      break;
    case 81: // Q
      toggleshoot = (toggleshoot) ? (false) : (true);
      pressed.space = toggleshoot;
      break;
	case 220: // ^
      listen = (listen) ? (false) : (true);
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      pressed.left = false;
      break;
    case 87: // W
      pressed.up = false;
      break;
    case 68: // D
      pressed.right = false;
      break;
    case 83: // S
      pressed.down = false;
      break;
    case 16: // Shift
      pressed.shift = false;
      break;     
    case 32: // Space
      if (toggleshoot == false) {pressed.space = false};
      break;      
  }
});


function removePlayer(id){
  for (var i = badGuys.length - 1; i >= 0; i--) {
    if(badGuys[i].id==id){
      delete players[id];
      scene.remove( badGuys[i].badGuy );
      sceneInterface.remove( badGuys[i].badGuy );
      badGuys.splice( badGuys.indexOf( badGuys[i] ), 1 );
      //
    }
  };
  return;
}

function removeShoot(id){
  for (var i = shootObjects.length - 1; i >= 0; i--) {
    if(shootObjects[i].id==id){

      boom = new explosionObject( shootObjects[i].myBox.position.x, shootObjects[i].myBox.position.z, shootObjects[i].myBox.position.y, shootObjects[i].myBox.rotation.y, shootObjects[i].id );
      explosionObjects.push(boom);

      sceneInterface.remove( shootObjects[i].myBox );
      scene.remove( shootObjects[i].myBox );
      shootObjects.splice( shootObjects.indexOf( shootObjects[i] ), 1 );

      
    }
  };
  return;
}

  function shootObject( posX, posZ, posY, angle, rotation, id ) {

        //if (id < 100){var material = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide } );};
        var material = new THREE.MeshLambertMaterial( { ambient: 0xc3ff00, side: THREE.DoubleSide } );
        //var material = new THREE.MeshLambertMaterial( { ambient: 0xc3ff00, side: THREE.DoubleSide } );
        //var material = new THREE.MeshLambertMaterial( { ambient: 0xFFFFFF, side: THREE.DoubleSide } );

        this.myBox = new THREE.Mesh( new THREE.BoxGeometry( 5, 5, 5 ), material );
    this.myBox.position.set( posX, posY-4, posZ );
    sceneInterface.add( this.myBox );

    this.playerShootRadius = 30;

    this.myBox.rotation.y = rotation;
    this.tirAngle = angle % 360 ;
    this.tirPos = [posX,posZ];
    this.tirPosInit = [posX,posZ];
    //this.myBox.position.y = posY-4;

    this.working = 1;

    this.id = id;

  }

function gunObjectInit(){
  if (typeof gun !== 'undefined' ) {sceneInterface.remove(gun)};
  gun = new THREE.Object3D();
  var material = new THREE.MeshLambertMaterial( { ambient: (badGuys.length == 0) ? (0x00FF00) : (0xFF0000), side: THREE.DoubleSide } );
  var box;
  box = new THREE.Mesh( new THREE.BoxGeometry( 10, 10, 20 ), material );
  box.position.set( 0, 0, 0 );
  gun.add( box );
  sceneInterface.add( gun );
}

function badGuy(posX, posZ, rotation, id){

  if (socket.id==id) {return};

  this.badGuy = new THREE.Object3D();
  this.id=id;
  this.pos=[posX,posZ,rotation];

  var material = new THREE.MeshLambertMaterial( { ambient: 0xFF00FF, side: THREE.DoubleSide } );

  head = new THREE.Mesh( new THREE.BoxGeometry( 8, 10, 8 ), material );
  head.position.set( 0, 8, 0 );
  this.badGuy.add( head );

  body = new THREE.Mesh( new THREE.BoxGeometry( 12, 18, 12 ), material );
  body.position.set( 0, -6, 0 );
  this.badGuy.add( body );

  jambe = new THREE.Mesh( new THREE.BoxGeometry( 5, 20, 5 ), material );
  jambe.position.set( 0, -25, -3.8 );
  this.badGuy.add( jambe );
  jambe = new THREE.Mesh( new THREE.BoxGeometry( 5, 20, 5 ), material );
  jambe.position.set( 0, -25, 3.8 );
  this.badGuy.add( jambe );

  this.badGuy.position.set( posX, 0, posZ );
  this.badGuy.rotation.y = rotation/360*(Math.PI*2);

  sceneInterface.add( this.badGuy );
}

function explosionObject( posX, posZ, posY, rotation, id ) {
  var material = new THREE.MeshLambertMaterial( { ambient: 0xc3ff00, side: THREE.DoubleSide } );
  this.rotation = Math.round(rotation*60);
  this.myRadius = 0;
  this.myBox = [];
  this.posX=posX;
  this.posY=posY;
  this.posZ=posZ;
  particuleCount = 8;
  for (var i = particuleCount - 1; i >= 0; i--) {
    var mySize = Math.random(5)+1;
    this.myBox[i] = new THREE.Mesh( new THREE.BoxGeometry( mySize, mySize, mySize ), material );
    this.myBox[i].position.set( posX, posY, posZ );
    this.myBox[i].rotation.y = rotation;
    sceneInterface.add( this.myBox[i] );
  };
  this.working = 1;
  this.mySpeed = 4;
}

function explosionObjectUpdate(){
  for (var i = 0; i <= explosionObjects.length - 1; i++) {
    var myPoint = [explosionObjects[i].posX, explosionObjects[i].posZ];
    var myBoxNumb = 0;
    explosionObjects[i].myBox[myBoxNumb].position.y = explosionObjects[i].myBox[myBoxNumb].position.y + explosionObjects[i].mySpeed / 2 ;
    var myBoxNumb = 1;
    explosionObjects[i].myBox[myBoxNumb].position.y = explosionObjects[i].myBox[myBoxNumb].position.y - explosionObjects[i].mySpeed;
    var myBoxNumb = 2;
    var tempPoint = pointFromPointAngleRadius(myPoint, explosionObjects[i].rotation, explosionObjects[i].myBox[1].position.y);
    explosionObjects[i].myBox[myBoxNumb].position.x = tempPoint[0];
    explosionObjects[i].myBox[myBoxNumb].position.z = tempPoint[1];
    explosionObjects[i].myBox[myBoxNumb].position.y = explosionObjects[i].myBox[myBoxNumb].position.y - 0.5;
    var myBoxNumb = 3;
    var tempPoint = pointFromPointAngleRadius(myPoint, explosionObjects[i].rotation-180, explosionObjects[i].myBox[1].position.y);
    explosionObjects[i].myBox[myBoxNumb].position.x = tempPoint[0];
    explosionObjects[i].myBox[myBoxNumb].position.z = tempPoint[1];
    explosionObjects[i].myBox[myBoxNumb].position.y = explosionObjects[i].myBox[myBoxNumb].position.y - 0.5;
    var myBoxNumb = 4;
    var tempPoint = pointFromPointAngleRadius(myPoint, explosionObjects[i].rotation+90, explosionObjects[i].myBox[1].position.y);
    explosionObjects[i].myBox[myBoxNumb].position.x = tempPoint[0];
    explosionObjects[i].myBox[myBoxNumb].position.z = tempPoint[1];
    explosionObjects[i].myBox[myBoxNumb].position.y = explosionObjects[i].myBox[myBoxNumb].position.y - 0.5;
    var myBoxNumb = 5;
    var tempPoint = pointFromPointAngleRadius(myPoint, explosionObjects[i].rotation-90, explosionObjects[i].myBox[1].position.y);
    explosionObjects[i].myBox[myBoxNumb].position.x = tempPoint[0];
    explosionObjects[i].myBox[myBoxNumb].position.z = tempPoint[1];
    explosionObjects[i].myBox[myBoxNumb].position.y = explosionObjects[i].myBox[myBoxNumb].position.y - 0.5;
    var myBoxNumb = 6;
    explosionObjects[i].myBox[myBoxNumb].position.y = explosionObjects[i].myBox[myBoxNumb].position.y + explosionObjects[i].mySpeed / 3 ;
    var tempPoint = pointFromPointAngleRadius(myPoint, explosionObjects[i].rotation+45, explosionObjects[i].myBox[1].position.y);
    explosionObjects[i].myBox[myBoxNumb].position.x = tempPoint[0];
    explosionObjects[i].myBox[myBoxNumb].position.z = tempPoint[1];
    explosionObjects[i].myBox[myBoxNumb].position.y = explosionObjects[i].myBox[myBoxNumb].position.y - 0.5;
    var myBoxNumb = 7;
    explosionObjects[i].myBox[myBoxNumb].position.y = explosionObjects[i].myBox[myBoxNumb].position.y + explosionObjects[i].mySpeed / 3 ;
    var tempPoint = pointFromPointAngleRadius(myPoint, 90+explosionObjects[i].rotation+45, explosionObjects[i].myBox[1].position.y);
    explosionObjects[i].myBox[myBoxNumb].position.x = tempPoint[0];
    explosionObjects[i].myBox[myBoxNumb].position.z = tempPoint[1];
    explosionObjects[i].myBox[myBoxNumb].position.y = explosionObjects[i].myBox[myBoxNumb].position.y - 0.5;
    if (explosionObjects[i].myBox[1].position.y < -50) {
      for (var j = explosionObjects[i].myBox.length - 1; j >= 0; j--) {
        sceneInterface.remove( explosionObjects[i].myBox[j] );
        scene.remove( explosionObjects[i].myBox[j] );
      }
      explosionObjects[i].working = 0;
    };
  };
  var purge = 0;
  for (var i = 0; i <= explosionObjects.length - 1; i++) {
    if (explosionObjects[i].working == 1) {
      purge++;
    };
  }
  if (purge == 0) {explosionObjects = [];};
}


clearInterval(5)
for (var y = 0; y <= 100; y++) {clearInterval(y)}
setInterval(function() {
  socket.emit('movement', pressed);
  if (typeof listen == 'undefined' ) {
    listen = false;
    toggleshoot = false;
    playercheck = Object.keys(players).length;
	alivebadGuys = badGuys.length
    updateStats();
    gunObjectInit();
    Object.keys(badGuys2add).forEach(function(key) {
    if (key!=socket.id) {
     // console.log(badGuys2add[key]);
        removePlayer(key);
        temp = new badGuy(badGuys2add[key].x, badGuys2add[key].y, badGuys2add[key].angle, key);
        badGuys.push(temp);
    };
  });
  };
  if (playercheck !== Object.keys(players).length || alivebadGuys !== badGuys.length) { playercheck = Object.keys(players).length, alivebadGuys = badGuys.length, gunObjectInit(), updateStats()}
}, 1000 / 60);

function updateStats(){

  //console.log(players);

  var arr=[];
  var i=0;
  Object.keys(players).sort().forEach(function(key) {
    arr[i]= players[key];i=i+1;
  });
  arr.sort(function (a, b) {
      return a.score - b.score;
  });
  str="";
  for (var i = arr.length - 1; i >= 0; i--) {
    c=" ";
    if(arr[i].nick==="guest") {name=arr[i].id} else {name=arr[i].nick};    
    if (arr[i].id==socket.id) {name="You";};
    if (i==arr.length - 1) {c=" 👑"};
    str=str+name+c+": "+arr[i].score+"<br>";
  };

  //console.log(arr);
  $('#stats').html(str);
  $('#stats').show();


};

getPseudo();

socket._callbacks.$kill.pop();
socket.on('kill', function(data) {  
  
  updateStats();
  console.log(data);
  killed=data[0];
  if(players[killed].nick==="guest") {name1=players[killed].id} else {name1=players[killed].nick};
  killer=data[1];
  if(players[killer].nick==="guest") {name2=players[killer].id} else {name2=players[killer].nick};

  if (killed!=socket.id) {
    removePlayer(killed);
  };

  if (killed==socket.id) {
    $('#me').html(name2+'<br> killed u.')
    $('canvas').hide();
    return
  };

  if (killer==socket.id) {
    $('#me').html('u killed <br>'+name1+'.')
    return
  };

  $('#me').html(name1+'<br> was killed by <br>'+name2+'.')

});
