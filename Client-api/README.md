docker run --net=host -d --name=log-dipatcher-1 -v /tmp/.X11-unix:/tmp/.X11-unix -v $HOME:$HOME  -v /data/:/data/ -w / -e DISPLAY=$DISPLAY --log-driver local --log-opt max-size=10m rishi19990/xconnected-logs-dispatcher:0.1 /data/static_server/ http://localhost:5000/api/v1/analytics/logs  --restart=always


