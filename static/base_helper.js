//low level reporting function -- all widget events eventually call reportAnalog, reportText,  or reportButton to send to VRPN.

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

function reportText(text) {
	$.post(
		'/text/' + text, {
			data: text
		},
		function () {
			console.log("report text: " + text);
		}
	);
}

function reportButton(buttonNumber, buttonstatus) {
	$.post(
		'/button/' + buttonNumber, {
			state: buttonstatus
		},
		function () {
			console.log("Button " + buttonNumber + " has state " + buttonstatus);
		}
	);
}

//currently not in example template

function findAndActivateButtons() {
	$('[data-vrpn-button]').each(
		function () {
			setButtonBehavior($(this), $(this).attr("data-vrpn-button"));
		}
	)
}