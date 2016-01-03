Author: Huyen Nguyen

Description: Data visualization for WPI graduation report

How to start a Python server at port 3000:
$ python -m SimpleHTTPServer 3000 &

After this, you might want to close the open port, here's how: 
1. Find out the process ID (PID) which is occupying the port number (e.g., 5955) you would like to free
sudo lsof -i :5955
2. Kill the process which is currently using the port using its PID
sudo kill -9 PID
(from stackoverflow: http://stackoverflow.com/questions/12397175/how-do-i-close-an-open-port-from-the-terminal-on-the-mac)

