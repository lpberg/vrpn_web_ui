function setButtonBehaviorJqueryMobile(buttonElement, buttonNumber) {
	buttonElement.mousedown(function () {
		reportButton(buttonNumber, true);
		$(this).data("pressed", true)
	});
	buttonElement.on('mouseup mouseleave', function () {
		if (!$(this).data("pressed")) {
			return;
		}
		reportButton(buttonNumber, false);
		$(this).data("pressed", false)
	});
}

function makeButtonJqueryMobile(oArg) {
	var label = oArg.label;
	var buttonNumber = oArg.buttonNumber;
	var destination = oArg.destination;
	var myButton = $('<div data-role="fieldcontain" id="' + label + 
	'-container"><input id="' + label + '_button" type="submit" value = "' + 
	label + '"></div>');
	setButtonBehaviorJqueryMobile(myButton,buttonNumber);
	myButton.appendTo('#'+destination).trigger("create");
}

function setTextFormBehaviorJqueryMobile(elt, inputVal) {
	elt.click(function () {
		var newValue = inputVal.val();
		if (newValue) {
			reportText(newValue);
		}
		return false; // don't do what you were going to do (don't submit the form)
	});
}

function makeTextFormInputJqueryMobile(oArg) {
	var name = oArg.name;
	var label = oArg.label;
	var defaultValue = oArg.defaultValue || "";
	var destination = oArg.destination;
	var the_things = $('<div data-role="fieldcontain" id="' + name + '-container">' +
		'<label for="' + name + '">' + label + '</label>' +
		'<input type="text" name="' + label + '" id="' + name + '" value="Enter Text Here" />' +
		'<input id="' + label + '_submit" type="submit" value = "Update ' + label + '"></div>');
	the_things.appendTo("#" + destination).trigger("create");
	setTextFormBehaviorJqueryMobile($("#" + label + "_submit"), $("#" + name));

}

function makeAnalogSliderJqueryMobile(oArg) {
	var name = oArg.name;
	var label = oArg.label;
	var analogChannel = oArg.channel;
	var min_val = oArg.min;
	var max_val = oArg.max;
	var destination = oArg.destination;
	var the_things = $('<div data-role="fieldcontain" id="' + name + '-container"><label for="' + name + '">' + label + '</label>' +
		'<input type="range" name="' + name + '" id="' + name + '" value="' + min_val + '" min="' + min_val + '" max="' + max_val + '" data-highlight="true" /></div>');
	the_things.appendTo("#" + destination).trigger("create");
	setAnalogSliderBehaviorJqueryMobile($("#" + name), analogChannel);
}

function makeFlipSwitchJqueryMobile(oArg) {
	var name = oArg.name;
	var label = oArg.label;
	var buttonNumber = oArg.buttonNumber;
	var option1 = oArg.option1;
	var option2 = oArg.option2;
	var destination = oArg.destination;
	the_things = $('<div data-role="fieldcontain" id="' + name + '-container"><label for="flip-1">' + label + '</label><select name="' + name + '" id="' + name + '" data-role="slider">' +
		'<option value="true">' + option1 + '</option><option value="false">' + option2 + '</option></select></div>');
	the_things.appendTo("#" + destination).trigger("create");
	setFlipSwitchBehaviorJqueryMobile($("#" + name), buttonNumber, option1, option2)
}

function setAnalogSliderBehaviorJqueryMobile(slider_div, analogChannel) {
	slider_div.on('change', function (event) {
		reportAnalog(analogChannel, slider_div.val());
	})
}

function setFlipSwitchBehaviorJqueryMobile(switchElt, buttonNumber, state1, state2) {
	switchElt.change(function () {
		var buttonstatus = true;
		var button_state_string = "";
		var value = $(this).val();
		//first option input has attribute value with value true
		if (value == "true") {
			buttonstatus = false;
			button_state_string = state1;
		} else {
			buttonstatus = true;
			button_state_string = state2;
		}
		reportButton(buttonNumber, buttonstatus);
		return true;
	});
}

function setRadioButtonSetBehaviorJqueryMobile(element) {
	element.change(function () {
		var name = element.attr("vrpn-name")
		var checkedButton = 'input[vrpn-name="' + name + '"]:radio:checked'
		var allbuttons = 'input[vrpn-name="' + name + '"]'
		//shut off all buttons
		$(allbuttons).not(":checked").each(function () {
			var buttonNumber = $(this).attr("vrpn-button-number");
			reportButton(buttonNumber, false);
		})
		// only post true for button that is checked.
		var buttonNumber = $(checkedButton).attr("vrpn-button-number");
		reportButton(buttonNumber, true);
		return true;
	});
}

function makeRadioButtonListJqueryMobile(oArg) {
	var name = oArg.name;
	var label = oArg.label;
	var buttonList = oArg.buttonList;
	var destination = oArg.destination;
	var the_things = '<div data-role="fieldcontain" id="' + name + '-container">' +
		'<fieldset data-role="controlgroup" data-type="horizontal">' +
		'<legend>' + label + '</legend>'

	myItems = [];
	for (var i = 0; i < buttonList.length; i++) {
		myItems.push('<input type="radio" vrpn-name="');
		myItems.push(name);
		myItems.push('" name="radio-choice-'+label+'" id="radio-choice-');
		myItems.push(i);
		myItems.push('" vrpn-button-number="');
		myItems.push(buttonList[i][1]);
		myItems.push('" />');
		myItems.push('<label for="radio-choice-');
		myItems.push(i);
		myItems.push('">' + buttonList[i][0] + '</label>');
	}

	var final_str = the_things + myItems.join("") + '</fieldset></div>';
	radioSet = $(final_str);
	radioSet.appendTo("#" + destination).trigger("create");
	setRadioButtonSetBehaviorJqueryMobile($('[vrpn-name="' + name + '"]'));
}

function makeRadioButtonSets(oArg) {
	var setNames = oArg.setNames;
	var buttonNames = oArg.buttonNames;
	var startingButtonNumber = oArg.startingButtonNumber;
	var buttonNumber = startingButtonNumber;
	var destination = oArg.destination;
	var printToConsole = oArg.printToConsole || false;

	for (var i=0;i<setNames.length;i++){ 
		var listArray = setNames[i];
		var myButtonList = new Array();
		for (var j=0;j<buttonNames.length;j++){ 
			myButtonList[j] = [buttonNames[j],buttonNumber];
			listArray = listArray + " | "+buttonNames[j]+" "+buttonNumber;
			//console.log(myButtonList[j]);
			buttonNumber = buttonNumber + 1;
		}
		if (printToConsole) {
			console.log(listArray);
		}
		makeRadioButtonListJqueryMobile({
			name: "name"+setNames[i],
			label: setNames[i],
			buttonList: myButtonList,
			destination: destination,
		});
	}
	
}