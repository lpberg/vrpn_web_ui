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
	/// Not worth my time right now to handle clicking, leaving, and coming back.
}

function makeButton(num,label) {
	setButtonBehavior($('<input name="button' + num + '" type="button" value="' + label + '">').appendTo("#button_controls"), num);
}

function makeAnalogInput(label,defaultVal,channel) {
	$input_field = $('<input id="'+label+'" type="text" value="' + defaultVal + '">').appendTo("#analog_controls");
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
