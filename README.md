# Addition Finanacial Backbase Frontend Peformance Testing

This is a working project using Sitespeed.io with docker that sends performance testing metrics to a graphite database. The graphite database used with AFCU's Performance Testing project is composed in a docker-compose.yml file similar to the one found below.

```yml
version: '3'
services:
    grafana:
      image: grafana/grafana:9.2.0
      hostname: grafana
      depends_on:
        - graphite
      links:
        - graphite
      ports:
        - "3000:3000"
      environment:
        - GF_SECURITY_ADMIN_PASSWORD=hdeAga76VG6ga7plZ1
        - GF_SECURITY_ADMIN_USER=sitespeedio
        - GF_AUTH_ANONYMOUS_ENABLED=true
        - GF_USERS_ALLOW_SIGN_UP=false
        - GF_USERS_ALLOW_ORG_CREATE=false
        - GF_INSTALL_PLUGINS=grafana-piechart-panel
      volumes:
        - grafana:/var/lib/grafana
      restart: always
    graphite:
      image: sitespeedio/graphite:1.1.10-3
      hostname: graphite
      ports:
        - "2003:2003"
        - "8080:80"
      restart: always
      volumes:
        # In production you should configure/map these to your container
        # Make sure whisper and graphite.db/grafana.db lives outside your containerr
        # https://www.sitespeed.io/documentation/sitespeed.io/graphite/#graphite-for-production-important
        - whisper:/opt/graphite/storage/whisper
        # Download an empty graphite.db from https://github.com/sitespeedio/sitespeed.io/tree/main/docker/graphite
        # - /absolute/path/to/graphite/graphite.db:/opt/graphite/storage/graphite.db
        # 
        # And put the configuration files on your server, configure them as you need
        # Download from https://github.com/sitespeedio/docker-graphite-statsd/tree/main/conf/graphite
        # - /absolute/path/to/graphite/conf/storage-schemas.conf:/opt/graphite/conf/storage-schemas.conf
        # - /absolute/path/to/graphite/conf/storage-aggregation.conf:/opt/graphite/conf/storage-aggregation.conf
        # - /absolute/path/to/graphite/conf/carbon.conf:/opt/graphite/conf/carbon.conf
    grafana-setup:
      image: sitespeedio/grafana-bootstrap:24.5.0
      links:
        - grafana
      environment:
        - GF_PASSWORD=hdeAga76VG6ga7plZ1
        - GF_USER=sitespeedio
volumes:
    grafana:
    whisper:
```

You start the script ([**loop.bat**](https://github.com/nholdenafcu/sitespeed-performance/loop.bat)) on your server that runs forever but for each iteration, it runs git pull and update the scripts so that if you add new test scripts to test, they are automatically picked up. You can run multiple iterations of this project on the same server by pulling it multiple times into its own directory. Ensure that you have the resources to run every docker container.

You can check out the [official sitespeedio documentation at sitespeed's documentation site](https://www.sitespeed.io/documentation/sitespeed.io/continuously-run-your-tests/).

The [**loop.bat**](https://github.com/nholdenafcu/sitespeed-performance/loop.bat) is the start point. Run it. That script will git pull the repo for every iteration and run the script [**run.bat**](https://github.com/nholdenafcu/sitespeed-performance/run.bat).

Then [**run.bat**](https://github.com/nholdenafcu/sitespeed-performance/run.bat) will use the right configuration in [**/config/**](https://github.com/nholdenafcu/sitespeed-performance/config) and run the URLs/scripts that are configured. Our configuration files extends configuration files that only exits on the server where we hold secret information like username and passwords.

## Install
Run your tests on a Linux machine. You will need Docker and Git. You can follow [Dockers official documentation](https://docs.docker.com/desktop/install/windows-install/) or follow our instructions:

## Setup

Clone from the afcu sitespeed-performance repo.
```
git clone https://github.com/nholdenafcu/sitespeed-performance.git
```

On our server we have a configuration file that only exits on that server. It looks like this:

**/conf/secrets.json**
```json
{
  "graphite": {
    "host": "OUR_HOST",
    "auth": "THE_AUTH",
    "annotationScreenshot": true
  }
}
```

## Run

Go into the directory that where you cloned the directory: `cd dashboard.sitespeed.io`
And then start: `.\loop.bat`

Alternatively, you can simply double click and run the bat process.

## Stop your tests

Starting your test creates a file named **sitespeed.run** in your current folder. The script on the server will continue to run forever until you remove the control file:
`rm sitespeed.run`

The script will then stop when it has finished the current run(s).

## Add your own tests

Do you want to add a new test script? Navigate to [**tests**](https://github.com/nholdenafcu/sitespeed-performance/tests) and create your new *.js* file there.

The tests folder is intended for new test scripts that will be ran every loop. Inside the scripts folder you can see common modules imported by test scripts for the backbase project like [**login.js**](https://github.com/nholdenafcu/sitespeed-performance/scripts/login.js) and [**logout.js**](https://github.com/nholdenafcu/sitespeed-performance/scripts/logout.js).

These scripts can be run together to create dynamic user journeys and test scripts to performance test any website Addition Financial wishes to test.

All scripts in the scripts directory should follow a similar format. They should all be node.js modules that import the sitespeed contexts and commands objects as well as importing our runtime variables/object.

Most scripts start like this:

```js
module.exports = async function(context, commands, env)
```

The context and commands are extended from Sitespeed scripting and the env is the environment that we are testing in.

For more resources on creating performance testing scripts, you can follow [official sitespeedio documentation at sitespeed's documentation site](https://www.sitespeed.io/documentation/sitespeed.io/scripting/).
