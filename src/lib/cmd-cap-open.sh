# GStream panels for Record screen from MageWell Pro Capture
#
# Working cmd for recording only:
# gst-launch-1.0 -e v4l2src device=`mwcap-info -v 0:0` ! 'video/x-raw,width=1920,height=1080,framerate=30/1' ! videoconvert ! queue ! x264enc tune=zerolatency ! mux. alsasrc device=`mwcap-info -a 0:0` ! queue ! audioconvert ! audioresample ! qtmux name=mux ! filesink location=/home/booco/Videos/ttest.mp4
#
# Recording video&audio stream capture into single QuickTime mp4 file "output.mp4" and open only video stream in the window:
#gst-launch-1.0 -e v4l2src device=`mwcap-info -v 0:0` ! 'video/x-raw,width=1920,height=1080,framerate=30/1' ! videoconvert ! tee name=t ! queue ! autovideosink t. ! queue ! x264enc 		# tune=zerolatency ! mux. alsasrc device=`mwcap-info -a 0:0` ! queue ! audioconvert ! audioresample ! qtmux name=mux ! filesink location=/home/booco/Videos/output.mp4
#
# Recording video&audio stream capture into single QuickTime mp4 file "output.mp4" and open video&audio stream window:
# gst-launch-1.0 -e v4l2src device=`mwcap-info -v 0:0` ! 'video/x-raw,width=1920,height=1080,framerate=30/1' ! videoconvert ! tee name=t ! queue ! autovideosink t. ! queue ! x264enc tune=zerolatency ! mux. alsasrc device=`mwcap-info -a 0:0` ! queue ! audioconvert ! tee name=a ! queue ! audioresample ! alsasink a. ! queue ! audioresample ! qtmux name=mux ! filesink location=/home/booco/Videos/output.mp4
#
# Working panel for only audio streaming
# gst-launch-1.0 alsasrc device=`mwcap-info -a 0:0` ! audioconvert ! audioresample ! pulsesink (also alsasink is good)
#

# Open window and run capture Video and Audio stream from MageWell Pro Capture:
# (take a look at Output status information and property notifications -q, --quiet)
gst-launch-1.0 -e -q v4l2src device=`mwcap-info -v 0:0` ! 'video/x-raw,width=1920,height=1080,framerate=30/1'\
! videoconvert ! queue ! autovideosink \
alsasrc device=`mwcap-info -a 0:0` ! audioconvert ! audioresample ! pulsesink &
P1=$!
echo "capture is running..."

# rename opened window to "ShowRoom"
# give the time to open the gst window properly
sleep 1
# wmctrl -r gst-launch-1.0 -N "ShowRoom"

echo "window renamed to ShowRoom"

wait $P1 $P2
exit 0
