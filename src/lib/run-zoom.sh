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
	xdotool search --onlyvisible --name "Electron Meetings Example" windowsize 1280 2160
	sleep 1
	exit 0
fi

let SIDE_PANEL_WIDTH=24

let BROWSER_WIDTH=(3840/2)*3/4
let BROWSER_HEIGHT=2160/2
let BROWSER_X_SHIFT=3840/4

let ELECTRON_X_SHIFT=140
let ELECTRON_HEIGHT=2160
let ELECTRON_WIDTH=BROWSER_X_SHIFT-ELECTRON_X_SHIFT+SIDE_PANEL_WIDTH

let YSHIFT=0
gws="${BROWSER_WIDTH},${BROWSER_HEIGHT}"

echo $gws


# run new window with corresponded params
#google-chrome --window-size="1020,1080" "https://us05web.zoom.us/wc/89675141488/start" >/dev/null 2>&1 --new-window &
google-chrome --window-size=$gws $URL >/dev/null 2>&1 --new-window &
echo "New Google-Chrome is running..."
P1=$!

# move window to the right corner
sleep 1
xdotool search --onlyvisible --name Google windowmove $BROWSER_X_SHIFT $YSHIFT

sleep 1
echo "***** google window size *****"
xdotool search --onlyvisible --name Google getwindowgeometry --shell

# move control window to the left
xdotool search --onlyvisible --name "Electron Meetings Example" windowmove $ELECTRON_X_SHIFT $YSHIFT
sleep 1
xdotool search --onlyvisible --name "Electron Meetings Example" windowsize $ELECTRON_WIDTH $ELECTRON_HEIGHT
sleep 1
echo "***** control window size *****"
xdotool search --onlyvisible --name "Electron Meetings Example" getwindowgeometry --shell



wait $P1