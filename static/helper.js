function setGridButtonListBehavior(grid) {
	grid.bind("mousedown", function(e) {
		e.metaKey = true;
	}).selectable({
		selecting: function() {
			 $(".ui-selecting", this ).each(function() {
				buttonNumber = $(this).attr("vrpn-button-number");
				$.post(
					'/button/' + buttonNumber, {
						state: true
					},
					function () {
						console.log("button "+buttonNumber+ " is down");
					}
				);
			 });
		 },
		 unselecting: function() {
			 $(".ui-unselecting", this ).each(function() {
				buttonNumber = $(this).attr("vrpn-button-number");
				$.post(
					'/button/' + buttonNumber, {
						state: false
					},
					function () {
						console.log("button "+buttonNumber+ " is up");
					}
				);
			 });
		 }
	});

}

function setToggleSwitchBehavior(switchElt, buttonNumber, state1, state2) {
	switchElt.buttonset();
	switchElt.change(function () {
		var buttonstatus = true;
		var button_state_string = "";
		var value = $(this).find(":checked").attr('data-vrpn-button-state');
		//first radio input has attribute data-vrpn-button-state with value true
		if (value == "true") {
			buttonstatus = true;
			button_state_string = state1;
		} else {
			buttonstatus = false;
			button_state_string = state2;
		}

		$.post(
			'/button/' + buttonNumber, {
				state: buttonstatus
			},
			function () {
				console.log("button toggle: " + buttonNumber + " has state " + button_state_string);
			}
		);
		return true;
	});

}

function makeToggleSwitch(num, label, first, second) {
	var buttonsetName = "radio" + label;
	$('<text>' + label + '</text>').appendTo("#radio_controls");

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
	// var buttonset_div = $(myItems.join("")).appendTo("#radio_controls");
	var buttonset_div = $(myItems.join(""));
	setToggleSwitchBehavior(buttonset_div, num, first, second);
	return buttonset_div;
}

function reportAnalog(analogChannel, val) {
	$.post(
		'/analog/' + analogChannel, {
			state: val
		},
		function () {
			console.log("report analog " + analogChannel + " = " + val);
		}
	);
}

function setAnalogFormBehavior(elt, inputVal, channel) {
	elt.click(function () {
		reportAnalog(channel, $(inputVal).val());
		return false; // don't do what you were going to do (don't submit the form)
	});
}

function setButtonBehavior(buttonElement, buttonNumber) {

	buttonElement.mousedown(function () {
		$.post(
			'/button/' + buttonNumber, {
				state: true
			},
			function () {
				console.log("button "+buttonNumber+ " is down");
			}
		);
		$(this).data("pressed", true);
	}).on('mouseup mouseleave', function () {
		if (!$(this).data("pressed")) {
			return;
		}
		$.post(
			'/button/' + buttonNumber, {
				state: false
			},
			function () {
				console.log("button "+buttonNumber+ " is up");
			}
		);
		$(this).data("pressed", false)
	});
	// Not worth my time right now to handle clicking, leaving, and coming back.
}

function makeButton(buttonLabel,buttonNumber) {
	button = $('<input data-vrpn-button="' + buttonNumber + '" name="button' + buttonNumber + '" type="button" value="' + buttonLabel + '">');
	setButtonBehavior(button, buttonNumber);
	return button;
}

function setAnalogSliderBehavior(label_div, slider_div, label, channel, min, max) {
	var min = min || 0;
	var max = max || 100;
	slider_div.slider({
		value: min,
		range: "min",
		min: min,
		max: max,
		step: 1,
		slide: function (event, ui) {
			label_div.html(label + ": " + ui.value);
			reportAnalog(channel, ui.value);
		}
	});
	//set initial value to be min on display
	label_div.html(label + ": " + min);

}

function makeAnalogSlider(label, analogChannel, min, max) {
	casing_div = $('<div id="' + label + 'casing"></div>');
	label_div = $('<div id="' + label + '" style="margin-bottom:10px"></div>').appendTo(casing_div);
	slider = $('<div id="' + label + analogChannel + '" style="margin-bottom:25px"></div>').appendTo(casing_div);
	setAnalogSliderBehavior(label_div, slider, label, analogChannel, min, max);
	return casing_div;
}

function makeAnalogFormInput(label, defaultVal, analogChannel) {
	casing_div = $('<div id="' + label + 'casing"></div>');
	input_field = $('<input id="' + label + '" type="text" value="' + defaultVal + '" style="display: inline-block;">').appendTo(casing_div);
	submit_button = $('<input id="' + label + 'Submit" type="submit" value="Update ' + label + '">').appendTo(casing_div);
	setAnalogFormBehavior(submit_button, input_field, analogChannel);
	return casing_div;
}

function findAndActivateButtons() {
	$('[data-vrpn-button]').each(
		function () {
			setButtonBehavior($(this), $(this).attr("data-vrpn-button"));
		}
	)
}