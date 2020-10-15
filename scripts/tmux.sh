#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
SESSION=template-app

function start() {
  if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo "Session $SESSION already exists. Attaching..."
    sleep 1
    tmux -2 attach -t $SESSION
    exit 0;
  fi

  echo "Starting docker-compose"
  export MANUALRUN=1
  ./stack up

  echo "Creating tmux session $SESSION..."

  # get the size of the window and create a session at that size
  local screensize=$(stty size)
  local width=$(echo -n "$screensize" | awk '{print $2}')
  local height=$(echo -n "$screensize" | awk '{print $1}')
  tmux -2 new-session -d -s $SESSION -x "$width" -y "$(($height - 1))"

  # the right hand col with a 50% vertical split
  tmux split-window -h -d
  tmux select-pane -t 1
  tmux split-window -v -d
  tmux select-pane -t 0
  tmux split-window -v -d

  tmux send-keys -t 0 './stack run frontend' C-m
  tmux send-keys -t 1 './stack run api' C-m
  
  tmux -2 attach-session -t $SESSION
}

function stop() {
  echo "Stopping tmux session $SESSION..."
  tmux kill-session -t $SESSION
  echo "Removing docker containers"
  docker rm -f $(docker ps -aq)
}

command="$@"

if [ -z "$command" ]; then
  command="start"
fi

eval "$command"