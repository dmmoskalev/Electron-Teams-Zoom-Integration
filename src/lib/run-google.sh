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
# run google-chrome in kiosk mode (full screen):
google-chrome --kiosk $URL >/dev/null 2>&1 --new-window &
echo "New Google-Chrome is running..."
P1=$!
wait $P1
exit 0
