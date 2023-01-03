#!/bin/bash
# Reboot the system
# Path: /etc/init.d/reboot.sh
echo "${1}"
var=$(sudo lsof -n -i :${1} | grep LISTEN)
echo "$var"
stringarray=($var)
pid=${stringarray[1]}
kill -9 $pid
echo "killed the process $pid"
