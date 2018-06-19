# Setting up the environment, installing node
sudo apt-get update
sudo apt-get install -y build-essential python wget

#https://github.com/nodesource/distributionss
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

cd /vagrant
sudo yes "" | npm init
sudo npm install --no-bin-links
sudo npm install --save better-sqlite3
