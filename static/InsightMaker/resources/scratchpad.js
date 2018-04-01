"use strict";
var scratchpadClear;

/* (c) Kahn Academy */

function Scratchpad( elem ){
	var pen = 'M25.31,2.872l-3.384-2.127c-0.854-0.536-1.979-0.278-2.517,0.576l-1.334,2.123l6.474,4.066l1.335-2.122C26.42,4.533,26.164,3.407,25.31,2.872zM6.555,21.786l6.474,4.066L23.581,9.054l-6.477-4.067L6.555,21.786zM5.566,26.952l-0.143,3.819l3.379-1.787l3.14-1.658l-6.246-3.925L5.566,26.952z';
	var clear = 'M23.024,5.673c-1.744-1.694-3.625-3.051-5.168-3.236c-0.084-0.012-0.171-0.019-0.263-0.021H7.438c-0.162,0-0.322,0.063-0.436,0.18C6.889,2.71,6.822,2.87,6.822,3.033v25.75c0,0.162,0.063,0.317,0.18,0.435c0.117,0.116,0.271,0.179,0.436,0.179h18.364c0.162,0,0.317-0.062,0.434-0.179c0.117-0.117,0.182-0.272,0.182-0.435V11.648C26.382,9.659,24.824,7.49,23.024,5.673zM22.157,6.545c0.805,0.786,1.529,1.676,2.069,2.534c-0.468-0.185-0.959-0.322-1.42-0.431c-1.015-0.228-2.008-0.32-2.625-0.357c0.003-0.133,0.004-0.283,0.004-0.446c0-0.869-0.055-2.108-0.356-3.2c-0.003-0.01-0.005-0.02-0.009-0.03C20.584,5.119,21.416,5.788,22.157,6.545zM25.184,28.164H8.052V3.646h9.542v0.002c0.416-0.025,0.775,0.386,1.05,1.326c0.25,0.895,0.313,2.062,0.312,2.871c0.002,0.593-0.027,0.991-0.027,0.991l-0.049,0.652l0.656,0.007c0.003,0,1.516,0.018,3,0.355c1.426,0.308,2.541,0.922,2.645,1.617c0.004,0.062,0.005,0.124,0.004,0.182V28.164z';
	var erase = 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248';
	var undo = 'M12.981,9.073V6.817l-12.106,6.99l12.106,6.99v-2.422c3.285-0.002,9.052,0.28,9.052,2.269c0,2.78-6.023,4.263-6.023,4.263v2.132c0,0,13.53,0.463,13.53-9.823C29.54,9.134,17.952,8.831,12.981,9.073z';
	var accept = "M2.379,14.729 5.208,11.899 12.958,19.648 25.877,6.733 28.707,9.561 12.958,25.308";

	var mobilesafari = /AppleWebKit.*Mobile/.test(navigator.userAgent);
	var container = jQuery( elem );

	var pad = Raphael( container[0], container.width(), container.height() );
	
	function resize() {
		pad.setSize( container.width(), container.height() );
	};
	
	//console.log("--")
	
	//console.log(this);
	
	container.bind('resize',
    function()
    {
        resize();
    });

	$('body').bind('selectstart', function(e) {
		return false;
	});

	var palette = pad.set(), stroke = '#000000', colors = ["#000000", "#3f3f3f", "#7f7f7f", "#bfbfbf", "#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#00ffff", "#007fff", "#0000ff", "#7f00ff"];
	for(var i = 0; i < colors.length; i++){
		(function(color){
			var setcolor = function(e){
				stroke = color
				palette.animate({x: 7}, 100)
				this.animate({x: 15}, 100)
				penclick()
			};
			palette.push(pad.rect(7, 90 + i * 24, 24, 24).attr({
				fill: color,
				stroke: ''
				}).touchstart(setcolor).click(setcolor));
		})(colors[i])
	}
	palette[0].attr({x: 15});

	var selected = pad.rect(2, 2, 30, 30).attr({
		r: 5,
		stroke: '',
		fill: 'rgba(30, 157, 186, 0.5)'
	});

	var line_default = {
		'stroke-width': 2,
		'stroke-linecap': 'round',
		'stroke-linejoin': 'round'};

	var shapes = pad.set();
	var history = [[]];

	function saveState(){
		for(var i = 0, state = []; i < shapes.length; i++){
			if(!shapes[i].removed){
				if(shapes[i].type == 'path'){
					state.push({
						path: shapes[i].attr('path').toString(),
						stroke: shapes[i].attr('stroke'),
						type: 'path'
					});
				}
			}
		}
		history.push(state);
	}

	function loadState(state){
		shapes.remove();
		for(var i = 0; i < state.length; i++){
			if(state[i].type == 'path'){
				shapes.push(pad.path(state[i].path).attr(line_default).attr('stroke', state[i].stroke))
			}
		}
	}

	/*
	* Hi. I did this with VectorEdtor, so I guess I'll try to do the same here with scratchpad
	* If someone is there, reading this code, in the distant future, say, the year 2012 and you
	* are, as any sensible human would, be preparing for the mayan-predicted impending apocalypse,
	* (or not) it doesn't matter. You should totally email me at antimatter15@gmail.com because,
	* it's always an interesting feeling.
	*/

	var tools = pad.set();

	tools.push(pad.path(pen).scale(0.8).translate(0,0))
	tools.push(pad.path(erase).translate(0,30))
	tools.push(pad.path(undo).scale(0.7).translate(1,80))

	var tool = "draw";
	function penclick(){
		selected.animate({y: 2}, 100);
		tool = "draw";
	}
	pad.rect(2, 2, 30, 30)
		.attr({
			stroke: '',
			fill: 'black',
			'fill-opacity': 0
		})
		.click(penclick).touchstart(penclick);
	function eraseclick(){
		selected.animate({y: 2 + 30}, 100);
		tool = "erase";
	}
	pad.rect(2, 2+30, 30, 30)
		.attr({
			stroke: '',
			fill: 'black',
			'fill-opacity': 0
		})
		.click(eraseclick).touchstart(eraseclick);
	function undoclick(){
		loadState(history.pop())
	}
	pad.rect(2, 2+30*2, 30, 30)
		.attr({
			stroke: '',
			fill: 'black',
			'fill-opacity': 0
		})
		.click(undoclick).touchstart(undoclick);

	tools.attr({fill: '#000', stroke: 'none'});
	var path = null, pathstr = '';
	var eraser = null;

	function mousedown(X,Y,e){
		if(!X || !Y || !e) return;

		if(eraser){
			eraser.remove();
			eraser = null;
		}
		saveState();
		var startlen = shapes.length;

		if(X > 40){
			if(tool == 'draw'){
				startPen(X, Y)
			}else if(tool == 'erase'){
				eraser = pad.rect(X, Y, 0, 0).attr({"fill-opacity": 0.15,
				"stroke-opacity": 0.5,
				"fill": "#ff0000", //oh noes! its red and gonna asplodes!
				"stroke": "#ff0000"});
				eraser.sx = X;
				eraser.sy = Y;
			}
		}
		if(shapes.length == startlen){
			history.pop();
		}
	}

	function startPen(x, y){
		path = pad.path("M"+x+","+y).attr(line_default).attr({
			stroke: stroke
		});
		pathstr = path.attr('path');
		shapes.push(path);
	}

	function rectsIntersect(r1, r2) {
		return r2.x < (r1.x+r1.width) &&
			(r2.x+r2.width) > r1.x &&
			r2.y < (r1.y+r1.height) &&
			(r2.y+r2.height) > r1.y;
	}


	function smoothPath(str){
		var parts = str.toString().split("L");
		var start = parts[0].substr(1).split(',')
		var lastx = +start[0], lasty = +start[1];
		var np = parts[0];
		var lastdist = 0;
		for(var i = 1; i < parts.length; i++){
			var p = parts[i].split(',');
			var dist = (Math.pow(+p[0] - lastx,2) +Math.pow(+p[1] - lasty, 2));
			if(dist > 10 || dist < lastdist|| i == parts.length -1){
				np += "L"+parts[i];
				lasty = p[1];
				lastx = p[0];
			}
			lastdist = dist;
		}
		return np
	}

	function mouseup(){
		if(path){
			path.attr('path', smoothPath(pathstr));
		}
		path = null;
		if(tool == 'erase' && eraser){
			saveState();
			var ebox = eraser.getBBox();
			for(var i = 0; i < shapes.length; i++){
				if(rectsIntersect(ebox, shapes[i].getBBox())){
					shapes[i].remove();
				}
			}
			eraser.animate({'fill-opacity': 0}, 100, function(){
				eraser.remove();
				eraser = null;
			});
		}

	}

	function mousemove(X,Y){
			if(X <= 40) return;
			if(path && tool == 'draw'){
				pathstr += 'L'+X+','+Y
				path.attr('path', pathstr);
			}else if(tool == 'erase' && eraser){
				var x1 = Math.min(X, eraser.sx),
				y1 = Math.min(Y, eraser.sy),
				x2 = Math.max(X, eraser.sx),
				y2 = Math.max(Y, eraser.sy);
				eraser.attr({
					x: x1,
					y: y1,
					width: x2 - x1,
					height: y2 - y1
				});
			}
	}

	container.mousemove(function(e){
		var offset = jQuery( container ).offset();
		mousemove( e.pageX - offset.left, e.pageY - offset.top );
		e.preventDefault();
	});
	container.mousedown(function(e){
		var offset = jQuery( container ).offset();
		mousedown(e.pageX - offset.left, e.pageY - offset.top, e);
		e.preventDefault();

		$(document).one("mouseup", function(e){
			mouseup();
			e.preventDefault();
		});
	});

	container.bind('touchstart', function(e){
		var offset = jQuery( container ).offset();
		mousedown(e.originalEvent.touches[0].pageX - offset.left, e.originalEvent.touches[0].pageY - offset.top, e.originalEvent);
		e.preventDefault();
	});
	container.bind('touchmove', function(e){
		var offset = jQuery( container ).offset();
		mousemove(e.originalEvent.touches[0].pageX - offset.left, e.originalEvent.touches[0].pageY - offset.top)
		e.preventDefault();
	});
	container.bind('touchend', function(e){
		mouseup();
		e.preventDefault();
	});

	function clear() {
		shapes.remove();
	}
	
	scratchpadClear = function(){
		shapes.remove();
	};
}




(function($,window,undefined){
  
  // A jQuery object containing all non-window elements to which the resize
  // event is bound.
  var elems = $([]),
    
    // Extend $.resize if it already exists, otherwise create it.
    jq_resize = $.resize = $.extend( $.resize, {} ),
    
    timeout_id,
    
    // Reused strings.
    str_setTimeout = 'setTimeout',
    str_resize = 'resize',
    str_data = str_resize + '-special-event',
    str_delay = 'delay',
    str_throttle = 'throttleWindow';
  
  // Property: jQuery.resize.delay
  // 
  // The numeric interval (in milliseconds) at which the resize event polling
  // loop executes. Defaults to 250.
  
  jq_resize[ str_delay ] = 1000;
  
  // Property: jQuery.resize.throttleWindow
  // 
  // Throttle the native window object resize event to fire no more than once
  // every <jQuery.resize.delay> milliseconds. Defaults to true.
  // 
  // Because the window object has its own resize event, it doesn't need to be
  // provided by this plugin, and its execution can be left entirely up to the
  // browser. However, since certain browsers fire the resize event continuously
  // while others do not, enabling this will throttle the window resize event,
  // making event behavior consistent across all elements in all browsers.
  // 
  // While setting this property to false will disable window object resize
  // event throttling, please note that this property must be changed before any
  // window object resize event callbacks are bound.
  
  jq_resize[ str_throttle ] = true;

      
  $.event.special[ str_resize ] = {
    
    // Called only when the first 'resize' event callback is bound per element.
    setup: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will bind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var elem = $(this);
      
      // Add this element to the list of internal elements to monitor.
      elems = elems.add( elem );
      
      // Initialize data store on the element.
      $.data( this, str_data, { w: elem.width(), h: elem.height() } );
      
      // If this is the first element added, start the polling loop.
      if ( elems.length === 1 ) {
        loopy();
      }
    },
    
    // Called only when the last 'resize' event callback is unbound per element.
    teardown: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will unbind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var elem = $(this);
      
      // Remove this element from the list of internal elements to monitor.
      elems = elems.not( elem );
      
      // Remove any data stored on the element.
      elem.removeData( str_data );
      
      // If this is the last element removed, stop the polling loop.
      if ( !elems.length ) {
        clearTimeout( timeout_id );
      }
    },
    
    // Called every time a 'resize' event callback is bound per element (new in
    // jQuery 1.4).
    add: function( handleObj ) {
      // Since window has its own native 'resize' event, return false so that
      // jQuery doesn't modify the event object. Unless, of course, we're
      // throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var old_handler;
      
      // The new_handler function is executed every time the event is triggered.
      // This is used to update the internal element data store with the width
      // and height when the event is triggered manually, to avoid double-firing
      // of the event callback. See the "Double firing issue in jQuery 1.3.2"
      // comments above for more information.
      
      function new_handler( e, w, h ) {
        var elem = $(this),
          data = $.data( this, str_data );
        
        // If called from the polling loop, w and h will be passed in as
        // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
        // those values will need to be computed.
        data.w = w !== undefined ? w : elem.width();
        data.h = h !== undefined ? h : elem.height();
        
        old_handler.apply( this, arguments );
      };
      
      // This may seem a little complicated, but it normalizes the special event
      // .add method between jQuery 1.4/1.4.1 and 1.4.2+
      if ( $.isFunction( handleObj ) ) {
        // 1.4, 1.4.1
        old_handler = handleObj;
        return new_handler;
      } else {
        // 1.4.2+
        old_handler = handleObj.handler;
        handleObj.handler = new_handler;
      }
    }
    
  };
  
  function loopy() {
    
    // Start the polling loop, asynchronously.
    timeout_id = window[ str_setTimeout ](function(){
      
      // Iterate over all elements to which the 'resize' event is bound.
      elems.each(function(){
        var elem = $(this),
          width = elem.width(),
          height = elem.height(),
          data = $.data( this, str_data );
        
        // If element size has changed since the last time, update the element
        // data store and trigger the 'resize' event.
        if ( width !== data.w || height !== data.h ) {
          elem.trigger( str_resize, [ data.w = width, data.h = height ] );
        }
        
      });
      
      // Loop.
      loopy();
      
    }, jq_resize[ str_delay ] );
    
  };
  
})(jQuery,this);