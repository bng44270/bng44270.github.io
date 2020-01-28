/*
Required jquery

Installation Steps:

1)  Add tag to <head> of your page.
      <script type="text/javascript" src="https://bng44270.github.io/f6a914479e3c99351d8d43a603f84124/fundraiser-thermometer.js"></script>

2) Add a the following tag on your page.  This tag will contain the thermometer.  (you can change the "id" value)
      <div id="mythermometer"></div>

3) Add the following tag to the bottom of your page
      <script type="text/javascript">
        $(document).ready(function() {
          setupThermometer("mythermometer",150,400,"FF0000",39);
        });
      </script>
        
This will populate the <div> created with the id of mythermometer with a thermometer colored red (FF0000) 
with a width of 150 pixels and a height of 400 pixels.  The current state of the thermometer is 39%.
*/
function setupThermometer(thdivid, thwid, thht, thcol, thper) {
  if (!(thdivid)||!(thwid)||!(thht)||!(thcol)||!(thper)) {
    $('#' + thdivid).html('Error:  setupThermometer("div-id",width,height,"hex-color",percent)');
  }
  else {
    $('#' + thdivid).append('<div id="thermempty" style="border-color:#000000; border-style: solid; border-left-width: 5px; border-top-width: 5px; border-right-width: 5px; border-bottom-width: 0px;"></div><div id="thermfull" style="border-color:#000000; border-style: solid; border-left-width: 5px; border-right-width: 5px; border-top-width: 0px; border-bottom-width: 0px;"></div><div id="thermbottom" style="border-color:#000000; border-style: solid; border-left-width: 5px; border-right-width: 5px; border-bottom-width: 5px; border-top-width: 0px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;"></div><div id="thermlbl" style="font-size:4vw;font-weight:bold;text-align:center;"></div>');


    var doneht = (parseInt(thht) - 50) * (thper / 100);
    var leftht = (parseInt(thht) - 50) * ((100 - thper) / 100);

    $('#' + thdivid).height(parseInt(thht));
    $('#' + thdivid).width(parseInt(thwid));
    $('#thermempty').width(parseInt(thwid));
    $('#thermempty').height(leftht);
    $('#thermfull').width(parseInt(thwid));
    $('#thermfull').height(doneht);
    $('#thermbottom').width(parseInt(thwid));
    $('#thermbottom').height(50);
    $('#thermlbl').width(parseInt(thwid));
    $('#thermlbl').height(50);
    $('#thermlbl').html(thper + '%');

    $('#thermempty').css('background-color','#ffffff');
    $('#thermfull').css('background-color','#' + thcol);
    $('#thermbottom').css('background-color','#' + thcol);
  }
}
