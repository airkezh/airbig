#!/bin/bash
if [ $USER != "work" ]
then
	echo "work only"
##  exit 1
fi
rf=$(pwd)'/../'

stopService() {
	echo 'stop service'
	if [ -f $rf'server/config/pids' ]; then
		cat $rf'server/config/pids' | while read line; do
			#echo 'kill '$line ;
			kill $line
		done
		rm -r $rf'server/config/pids'
	fi
	
}

if [ $# -eq 0 ];then
	echo "you should pass args start|restart|stop|clear"
else
	case $1 in
		"clear")
			clearTmp
			;;
		"stop")
			stopService
			;;
		"start")
			startService
			;;
		"restart")
			stopService
			clearTmp
			startService
			;;
	esac
fi
