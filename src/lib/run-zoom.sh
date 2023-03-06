#!/bin/bash


echo "Close all previously opened Google-Chrome windows ..."
res=$(xdotool search --name Google)
while [ ${#res} -gt 0 ]
do
	xdotool search --onlyvisible --name Chrome windowkill
	sleep 1
	res=$(xdotool search --name Google)
done
sleep 1
echo "Done"

URL=$1
if [[ $URL == *CLOSE* ]]
then
	xdotool search --onlyvisible --name "Electron Meetings Example" windowsize --sync 1380 2160
	xdotool search --onlyvisible --name "Electron Meetings Example" windowmove 1280 0
	sleep 1
	exit 0
fi

let SCREEN_WIDTH=3840
let SCREEN_HEIGHT=2160

let ELECTRON_WIDTH=280
let ELECTRON_HEIGHT=280
let ELECTRON_X_SHIFT=0
let ELECTRON_X_YSHIFT=0

let SIDE_PANEL_WIDTH=165
let WM_MARGINE=52




gws="${BROWSER_WIDTH_SCALED},${BROWSER_HEIGHT_SCALED}"

# run google-chrome in kiosk mode (full screen):
google-chrome --kiosk $URL >/dev/null 2>&1 --new-window &
echo "New Google-Chrome is running..."
P1=$!


ELECTRON_WIDTH=$(( $ELECTRON_WIDTH+$WM_MARGINE ))

# move control window to the left
xdotool search --onlyvisible --name "Electron Meetings Example" windowsize --sync $ELECTRON_WIDTH $ELECTRON_HEIGHT
xdotool search --onlyvisible --name "Electron Meetings Example" windowmove $ELECTRON_X_SHIFT $ELECTRON_X_YSHIFT
sleep 1
# stick control window above the browser
wmctrl -r Meetings -b add,above

wait $P1