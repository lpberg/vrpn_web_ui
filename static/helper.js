function setToggleSwitchBehavior(switchElt, num, buttonsetName, first, second) {
    switchElt.buttonset();
	switchElt.change(function () {
        var buttonstatus = true;
        var console_string = "";
        var value = $(this).find(":checked").attr('data-vrpn-button-state');
        if (value == "true") {
            buttonstatus = true;
            console_string = first;
        } else {
            buttonstatus = false;
            console_string = second;
        }

        $.post(
            '/button/' + num, {
                state: buttonstatus
            },
            function () {
                console.log("Button Toggle: " + num + " - " + console_string);
            }
        );
		return true;
    });

}

function makeToggleSwitch(num,label,first,second) {
	var buttonsetName = "radio"+label;
	$('<text>'+label+'</text>').appendTo("#radio_controls");
	
	var myItems = [];
	myItems.push('<div id="');
	myItems.push(buttonsetName);
	myItems.push('">');
	myItems.push('<form>');
	myItems.push('<input type="radio" data-vrpn-button-state="true" name="radio" id="trueradio' + label + '"><label for="trueradio' + label + '">');
	myItems.push(first);
	myItems.push('</label>');
	myItems.push('<input type="radio" data-vrpn-button-state="false" name="radio" id="falseradio' + label + '" checked="checked"><label for="falseradio' + label + '">');
	myItems.push(second);
	myItems.push('</label>');
	myItems.push('</form>');
	myItems.push('</div>');
	var buttonset_div = $(myItems.join("")).appendTo("#radio_controls");
	setToggleSwitchBehavior(buttonset_div,num,buttonsetName,first,second);
}

function reportAnalog(num, val) {
	$.post(
		'/analog/' + num,
		{ state: val },
		function() { console.log("report analog " + num + " = " + val); }
	);
}
function setAnalogBehavior(elt,inputVal,channel) {
	$(elt).click(function() {
			reportAnalog(channel, $(inputVal).val());
			return false; // don't do what you were going to do (don't submit the form)
		});
}
function setButtonBehavior(elt, num) {

	elt.mousedown(function() {
		$.post(
			'/button/' + num,
			{ state: true },
			function() { console.log("down " + num); }
		);
		$(this).data("pressed", true);
	}).on('mouseup mouseleave', function() {
		if (!$(this).data("pressed")) {
			return;
		}
		$.post(
			'/button/' + num,
			{ state: false },
			function() { console.log("up " + num); }
		);
		$(this).data("pressed", false)
	});
	// Not worth my time right now to handle clicking, leaving, and coming back.
}

function makeButton(num,label) {
	setButtonBehavior($('<input data-vrpn-button="'+num+'" name="button' + num + '" type="button" value="' + label + '">').appendTo("#button_controls"), num);
}

function setAnalogSliderBehavior($label,$slider,label,channel,min,max) {
	var min = min || 0;
	var max = max || 100;
	$slider.slider(
	{
		value:min,
		range: "min",
		min: min,
		max: max,
		step: 1,
		slide: function( event, ui ) {
		  $label.html(label+": "+ui.value );
		  reportAnalog(channel,ui.value);
	}
	});
	$label.html(label+": "+min);

}

function makeAnalogSlider(label,channel,min,max) {
	$label = $('<div id="'+label+'" style="margin-bottom:10px"></div>').appendTo("#slider_controls");
	$slider = $('<div id="'+label+channel+'" style="margin-bottom:25px"></div>').appendTo("#slider_controls");
	setAnalogSliderBehavior($label,$slider,label,channel,min,max);

}

function makeAnalogInput(label,defaultVal,channel) {
	$input_field = $('<input id="'+label+'" type="text" value="' + defaultVal + '" style="display: inline-block;">').appendTo("#analog_controls");
	$submit_button = $('<input id="'+label+'Submit" type="submit" value="Update ' + label + '">').appendTo("#analog_controls");
	setAnalogBehavior($submit_button, $input_field, channel);
}

function findAndActivateButtons() {
	$('[data-vrpn-button]').each(
		function() {
			setButtonBehavior($(this), $(this).attr("data-vrpn-button"));
		}
	)
}
