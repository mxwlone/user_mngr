The Vagrantfile creates a virtual box vm with 256mb memory.<br>
The vm has a mysql server installed which listens on port 3306 and provides a database as well as the user setup required for the app.<br>
When changing the config.local.mysql settings in ../config/index.js, the database access to this vm will most likely not work.

**Installation**
Open terminal in this directory and run
`vagrant up`