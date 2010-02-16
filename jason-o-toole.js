/* jason-o-toole 1.0  
 *
 * Copyright (c) 2010 Francois Lafortune  (quickredfox.at)
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php 
 *
 * Usage:
 *
 * // JSON data
 * var jsonObject = {"Am":"stram","gram":["pike","pike"],"colegram":"true"}
 * 
 * // Build an array fo dot notation for all members of object to be validated against jsonPath()
 * JSONoToole.notations(jsonObject) // returns ["$.Am" ,"$.Am.gram","$.Am.gram[0]","$.Am.gram[1]","$.Am.gram.colegram"];
 * 
 * // Or grab all the values from a json Object, regardless of their access path
 * JSONoToole.values(jsonObject) // returns ["stram","pike","pike","true"];
 * 
 * // Combo of previous methods, meatn as a sort of object inspector...
 * JSONoToole.interesting(jsonObject)
 * 
 * // Renders the object in a nicely style HTML view... 
 * JSONoToole.html(jsonObject)
 *  
*/

// Play on "JSON Object Tool"
var JSONoToole = new
function JSONoToole() {
    // PRIVATE SCOPE
    var _recurseTypes = function _recurseTypes(object, callbacks) {
        if (isA(object)) for (var i = 0, item; item = object[i++];) callbacks.array.apply(item, [i, item]);
        else if (isO(object)) for (var prop in object) callbacks.object.apply(object[prop], [prop, object[prop]]);
        else if (isX(object)) callbacks.other.apply(object, [object]);
    }
    ,
    noop = function() {}
    ,
	// not tested x-browser will fail
    isA = function(obj) {
		if(obj === null) return false;
        return (obj instanceof Array);
    }
	// not tested x-browser will fail
    ,isO = function(obj) {
		if(obj === null) return false;
        return ((typeof obj == 'object') && !isA(obj));
    }
	// not tested x-browser will fail
    ,isX = function(obj) {
        return (!isO(obj) && !isA(obj))
    },
	escapeHTML = function(str){
	    var result = "";
		str = str ? str : '';
	    for(var i = 0; i < str.length; i++){
	        if(str.charAt(i) == "&" 
	              && str.length-i-1 >= 4 
	              && str.substr(i, 4) != "&amp;"){
	            result = result + "&amp;";
	        } else if(str.charAt(i)== "<"){
	            result = result + "&lt;";
	        } else if(str.charAt(i)== ">"){
	            result = result + "&gt;";
	        } else {
	            result = result + str.charAt(i);
	        }
	    }
	    return result;
	};
    /*
	 inspectee: object to get notation from
	 refO: object with one required empty array attribute: {value:[]} as reference to store notations into
	 dotNotation: internal, dont use
	*/
    var toNotation = function toNotation(inspectee, refO, notation) {
        var notation = notation || '$';
        _recurseTypes(inspectee, {
            array: function(index, item) {
                refO.value.push(notation + '[' + (index - 1) + ']');
                toNotation(item, refO, notation + '[' + (index - 1) + ']');
            },
            object: function(key, item) {
				if((/[\s\n\r]/gm).test(key)){
					notation = notation + ('["' + key +'"]');
				}else{
					notation = notation + ('.' + key);		
				}
                refO.value.push(notation);
                toNotation(item, refO, notation);
            },
            other: noop
        });
    };
    /*
	 inspectee: object to get values from
	 refO: object with one required empty array attribute: {value:[]} as reference to store values into
	*/
    var toValues = function toValues(inspectee, refO) {
        _recurseTypes(inspectee, {
            array: function(index, item) {
                toValues(item, refO);
            },
            object: function(key, item) {
                toValues(item, refO);
            },
            other: function(string) {
                refO.value.push(string);
            }
        })
    };
    /* 
		inspectee: object to pretty htmlize
	 	refO: object with one required empty string attribute: {value:''} as reference to store html into
	*/
    var toHTML = function toHTML(inspectee, refO,notation) {
		var notation = notation || '$'; 
		if(!refO.notation) refO.notation = [];
        var anA = isA(inspectee);
        var anO = isO(inspectee);
        refO.value += anO ? '<ol start="0" class="array-items">': anA ? '<dl class="object-properties">': '';
        _recurseTypes(inspectee, {
            array: function(index, item) {
				var title = notation + '[' + (index - 1) + ']';
                refO.notation.push(title);
                var itemClass = (isO(item) ? 'object' : isA(item) ? 'array' : 'string');
                refO.value += '<li title="'+title+'" class="array-item ' + itemClass + '-item">';
				toHTML(item, refO,title);
                refO.value += '</li>';
            },
            object: function(key, item) {
                var itemClass = (isO(item) ? 'object' : isA(item) ? 'array' : 'string');
				if((/[\s\n\r\@\%\-\.]/gm).test(key)){
					title = notation + ("['"+ key +"']");
				}else{
					title = notation + ('.' + key);		
				}
				refO.notation.push(title);
                refO.value += '<dt title="'+title+'" class="property-name ' + itemClass + '-property-name"><span class="property-type">'+itemClass+':</span>' 
						   + key + '</dt><dd class="property-value ' + itemClass + '-property-value">';
                toHTML(item, refO, title);
                refO.value += '</dd>';
            },
            other: function(string) {
				if((string === null || typeof string == 'undefined')) refO.value += '<code class="null">null</code>';
                else refO.value += '<code class="string">' + escapeHTML(string.toString()) + '</code>';
            }
        });
        refO.value += anO ? '</ol>': anA ? '</dl>': '';
    };

    // PUBLIC SCOPE
    this.notation = function getDotNotations(object) {
        // WARNING, THIS METHOD IS PROCESSOR INTENSIVE
        var ref = {
            key: 'notations',
            value: []
        };
        toNotation(object, ref)
        return ref;
    };
    this.values = function getValues(object) {
        // WARNING, THIS METHOD IS PROCESSOR INTENSIVE		
        var ref = {
            key: 'values',
            value: []
        };
        toValues(object, ref)
        return ref;
    };
    this.html = function prettyHTML(object) {
        var ref = {
            key: 'html',
            value: ''
        };
        toHTML(object, ref);
		ref.value = "<div class=\"jason-otoole-html-output\">"+ref.value+"</div>";
        return ref;
    };
    this.interesting = function(object) {
        // WARNING, THIS METHOD IS VERY VERY PROCESSOR INTENSIVE
        var o = {
            object: object
        };
        var vals = this.values(o.object);
        var dots = this.notation(o.object);
        o[vals.key] = vals.value;
        o[dots.key] = dots.value;
        return o;
    };
    this.recurseTypes = _recurseTypes;
}