function reload(){
    location.reload();
}
function refresh() {
    var d = new Date();
    var s = d.getSeconds();
    if (s === 0 || s === 30) {
      setTimeout(reload, 5);
    }
  }