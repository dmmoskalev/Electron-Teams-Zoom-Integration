# usefull format function
overwrite() { echo -e "\r\033[1A\033[0K$@"; }

enlargesize(){

echo "args: ${1} ${2} ${3}"
eval $(xdotool search --onlyvisible --name "${1}" getwindowgeometry --shell)

echo "WINDOW=${WINDOW}"
echo $X
echo $Y
echo $WIDTH
echo $HEIGHT

let w=$WIDTH
let wmax=$2
let step=$3

while [ $(($wmax-$w)) -gt 0 ]
do
	xdotool search --onlyvisible --name "${1}" windowsize --sync $w $HEIGHT
	w=$(( $w + $step ))
	step=$(( $wmax/$w ))
	overwrite "WIDTH = ${w} STEP = ${step}"
done
}

enlargesize "Electron Meetings Example" 3000 30