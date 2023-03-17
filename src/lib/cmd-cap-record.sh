# GStream panels for Record screen from MageWell Pro Capture
#
# Working cmd for recording only:
# gst-launch-1.0 -e -q v4l2src device=`mwcap-info -v 0:0` ! 'video/x-raw,width=1920,height=1080,framerate=30/1' ! videoconvert ! queue ! x264enc tune=zerolatency ! mux. alsasrc device=`mwcap-info -a 0:0` ! queue ! audioconvert ! audioresample ! qtmux name=mux ! filesink location=/home/booco/Videos/ttest.mp4
#
# Recording video&audio stream capture into single QuickTime mp4 file "ouhttps://gstreamer.freedesktop.org/documentation/tools/gst-launch.html#gstlaunch10tput.mp4" and open only video stream in the window:
#gst-launch-1.0 -e -q v4l2src device=`mwcap-info -v 0:0` ! 'video/x-raw,width=1920,height=1080,framerate=30/1' ! videoconvert ! tee name=t ! queue ! autovideosink t. ! queue ! x264enc 		# tune=zerolatency ! mux. alsasrc device=`mwcap-info -a 0:0` ! queue ! audioconvert ! audioresample ! qtmux name=mux ! filesink location=/home/booco/Videos/output.mp4
#
# Recording video&audio stream capture into single QuickTime mp4 file "output.mp4" and open video&audio stream window:
# gst-launch-1.0 -e -q v4l2src device=`mwcap-info -v 0:0` ! 'video/x-raw,width=1920,height=1080,framerate=30/1' ! videoconvert ! tee name=t ! queue ! autovideosink t. ! queue ! x264enc tune=zerolatency ! mux. alsasrc device=`mwcap-info -a 0:0` ! queue ! audioconvert ! tee name=a ! queue ! audioresample ! alsasink a. ! queue ! audioresample ! qtmux name=mux ! filesink location=/home/booco/Videos/output.mp4
#
# Working panel for only audio streaming
# gst-launch-1.0 alsasrc device=`mwcap-info -a 0:0` ! audioconvert ! audioresample ! pulsesink (also alsasink is good)
#

# Open window and Record capture Video and Audio stream from MageWell Pro Capture:
# (take a look at options:
# -q, --quiet, :: Output status information and property notifications
# -e, --eos-on-shutdown :: Force an EOS event on sources before shutting the pipeline down.
# This is useful to make sure muxers create readable files when a muxing pipeline is shut down forcefully via Control-C.)
gst-launch-1.0 -e -q v4l2src device=`mwcap-info -v 0:0` ! 'video/x-raw,width=1920,height=1080,framerate=30/1' ! videoconvert \
! tee name=t \
! queue ! autovideosink \
t. ! queue ! x264enc tune=zerolatency \
! mux. alsasrc device=`mwcap-info -a 0:0` ! queue ! audioconvert \
! tee name=a \
! queue ! audioresample ! alsasink \
a. ! queue ! audioresample ! qtmux name=mux ! filesink location=/home/booco/Videos/cap_record.mp4 &
P1=$!
echo "capture is recording..."

# rename the opened window to "ShowRoom"
# give the time to open the gst window properly
sleep 1
wmctrl -r gst-launch-1.0 -T "ShowRoom"
echo "the opened window renamed to ShowRoom"

wait $P1
exit 0
