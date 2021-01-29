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
clearInterval(5)
for (var y = 0; y <= 100; y++) {clearInterval(y)}
setInterval(function() {
  socket.emit('movement', pressed);
  if (typeof listen == 'undefined' ) {
    listen = false;
    toggleshoot = false;
    playercheck = Object.keys(players).length;
    updateStats();
  };
  if (playercheck !== Object.keys(players).length) { playercheck = Object.keys(players).length, updateStats()}
}, 1000 / 60);
document.children[0].style.background = '#c0c0c0'
