$(document).ready( function(){
    $("#slides").slidesjs({
        width: '100%',
        height: 400,
        play: {
          active: true,
          auto: true,
          interval: 4000,
          swap: true,
          pauseOnHover: true,
          restartDelay: 2500
        }
      });
});