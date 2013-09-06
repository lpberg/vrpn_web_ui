require("Actions")
require("getScriptFilename")
vrjLua.appendToModelSearchPath(getScriptFilename())
vrjKernel.loadConfigFile(vrjLua.findInModelSearchPath([[json_vrpn.jconf]]))

function round(num, idp)
  local mult = 10^(idp or 0)
  return math.floor(num * mult + 0.5) / mult
end


addButtonFrameActions = function()
	for i = 0, 5, 1 do
		Actions.addFrameAction(function()
			local drawBtn = gadget.DigitalInterface("JSButton"..i)
			while true do
				if drawBtn.justPressed then
					print(i.." pressed")
				end
				Actions.waitForRedraw()
			end
		end)
	end
end

addAnalogFrameActions = function()
	for i = 0, 5, 1 do
		Actions.addFrameAction(function()
			local drawBtn = gadget.AnalogInterface("JSAnalog"..i)
			local first_data = drawBtn.data
			while true do
				if drawBtn.data ~= first_data then
					first_data = drawBtn.data
					print("Analog "..i.." reports: "..round(first_data*1000000,2))
				end
				Actions.waitForRedraw()
			end
		end)
	end
end

addButtonFrameActions()
addAnalogFrameActions()
