jason-o-toole 1.0  A play on "JSON Object Tool", jason-o-toole is a stick to help you poke at json objects

Copyright (c) 2010 Francois Lafortune  (quickredfox.at)
Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php 

Usage:
<pre>
 // JSON data
 var jsonObject = {"Am":"stram","gram":["pike","pike"],"colegram":"true"}

 // Build an array fo dot notation for all members of object to be validated against jsonPath()
 JSONoToole.notations(jsonObject) // returns ["$.Am" ,"$.Am.gram","$.Am.gram[0]","$.Am.gram[1]","$.Am.gram.colegram"];

 // Or grab all the values from a json Object, regardless of their access path
 JSONoToole.values(jsonObject)

 // Combo of previous methods, meatn as a sort of object inspector...
 JSONoToole.interesting(jsonObject)

 // Renders the object in a nicely style HTML view... 
 JSONoToole.html(jsonObject)
</pre> 
![screenshot](http://github.com/quickredfox/jason-o-toole/raw/master/screenshot.png "Screenshot")

