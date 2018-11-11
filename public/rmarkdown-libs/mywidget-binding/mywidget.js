HTMLWidgets.widget({

  name: 'mywidget',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(opts) {
        var people = document.createElement("INPUT");
        var hours = document.createElement("INPUT");
        var result = document.createTextNode("hello");
        var people_head = document.createTextNode("Number of people");
        var hours_head = document.createTextNode("Number of hours");


        var linebreak = document.createElement("br");

        people.value = 1;
        hours.value = 1;

        people.setAttribute("type", "number");
        people.setAttribute("min", 0);
        
        hours.setAttribute("type", "number");
        hours.setAttribute("min", 0);
        
        var update_total = function(){
    	    result.nodeValue = "£" + people.value * hours.value * opts.hourly;
            return(false);
        };
        update_total();
        
        people.oninput = update_total;
        hours.oninput = update_total;
        el.appendChild(result);
        el.appendChild(linebreak);
        
        el.appendChild(people_head);
        el.appendChild(people);

        el.appendChild(hours_head);

        el.appendChild(hours);
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});