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
	xdotool search --onlyvisible --name "Electron Meetings Example" windowsize --sync 1380 600
	xdotool search --onlyvisible --name "Electron Meetings Example" windowmove 1280 780
	sleep 1
	exit 0
fi

let SCREEN_WIDTH=3840
let SCREEN_HEIGHT=2160

let ELECTRON_WIDTH=280
let ELECTRON_HEIGHT=$SCREEN_HEIGHT
let ELECTRON_X_SHIFT=0

let SIDE_PANEL_WIDTH=165
let WM_MARGINE=52


let BROWSER_WIDTH=$SCREEN_WIDTH-$ELECTRON_WIDTH-$SIDE_PANEL_WIDTH
let BROWSER_HEIGHT=$SCREEN_HEIGHT

let BROWSER_WIDTH_SCALED=($SCREEN_WIDTH/2)*3/4
let BROWSER_HEIGHT_SCALED=$SCREEN_HEIGHT/2
let BROWSER_X_SHIFT=$ELECTRON_WIDTH+$SIDE_PANEL_WIDTH

let YSHIFT=0

gws="${BROWSER_WIDTH_SCALED},${BROWSER_HEIGHT_SCALED}"

# run new window with corresponded params like:
# google-chrome --window-size="1020,1080" "https://us05web.zoom.us/wc/89675141488/start" >/dev/null 2>&1 --new-window &
google-chrome --window-size=$gws $URL >/dev/null 2>&1 --new-window &
echo "New Google-Chrome is running..."
P1=$!

sleep 1
# set size to browser window
xdotool search --onlyvisible --name Google windowsize --sync $BROWSER_WIDTH $BROWSER_HEIGHT
# move browser window to the right corner
xdotool search --onlyvisible --name Google windowmove --sync $BROWSER_X_SHIFT $YSHIFT

echo "***** google window size *****"
xdotool search --onlyvisible --name Google getwindowgeometry --shell
eval $(xdotool search --onlyvisible --name Google getwindowgeometry --shell)

ELECTRON_WIDTH=$(( $ELECTRON_WIDTH+$WM_MARGINE ))

# move control window to the left
xdotool search --onlyvisible --name "Electron Meetings Example" windowmove $ELECTRON_X_SHIFT $YSHIFT
sleep 1
xdotool search --onlyvisible --name "Electron Meetings Example" windowsize --sync $ELECTRON_WIDTH $ELECTRON_HEIGHT
#sleep 1
echo "***** control window size *****"
xdotool search --onlyvisible --name "Electron Meetings Example" getwindowgeometry --shell



wait $P1