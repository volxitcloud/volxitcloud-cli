# VolxitCloud CLI

Command Line Interface for VolxitCloud.

VolxitCloud is a modern automated app deployment & web server manager.
  - Deploy apps in your own space
  - Secure your services over HTTPS for FREE
  - Scale in seconds
  - Focus on your apps! Not the bells and whistles just to run your apps!

Fore more information see Volxit.com

Always refer to the documentation bundled in CLI as it is the most updated one. You can view the help by `volxitcloud --help` or `volxitcloud deploy --help` or etc.

## Getting started

This guide assumes that you have started VolxitCloud on a linux server and setup your DNS (see [VolxitCloud Setup](https://volxitcloud.com/docs/get-started.html#volxitcloud-setup)).

You can use this CLI tool to perform initial VolxitCloud server setup, and to deploy your apps.

Before anything, install the CLI tool using npm:
```
npm install -g volxitcloud
```

### Usage

You can use the CLI by typing `volxitcloud` in your console.

The CLI has several commands, if invoked without a command it display the usage summary:
```
Usage: volxitcloud [options] [command]

CLI tool for VolxitCloud. See Volxit.com for more details.

Options:
  -V, --version                output the version number
  -h, --help                   output usage information

Commands:
  serversetup|setup [options]  Performs necessary actions to prepare VolxitCloud on your server.
  login [options]              Login to a VolxitCloud machine. You can be logged in to multiple machines simultaneously.
  list|ls                      List all VolxitCloud machines currently logged in.
  logout [options]             Logout from a VolxitCloud machine and clear auth info.
  deploy [options]             Deploy your app to a specific VolxitCloud machine. You'll be prompted for missing parameters.
  api [options]                Call a generic API on a specific VolxitCloud machine. Use carefully only if you really know what you are doing!
```

## Commands

Almost all commands require some data to work. Data for commands can be provided from different sources:
- Enviroment variables: using variables names specified in command help (note that variable must be exported, or you have to define it inline before the cli command, eg: `ENV_VAR=value volxitcloud command`);
- Configuration file: JSON or YAML, specifing the file name with an option or its environment variable (usually `-c, --configFile` and `VOLXITCLOUD_CONFIG_FILE`), command options names define the keys of the configuration file;
- Command options: using command options flags directly on the command line;
- Input prompt: for those data that is not provided from other sources, but needed for the command to work, you'll be prompted to input them during command execution.

If the same data is provided from different sources, the priority order reflects the above list (the following ones overwrite the previous ones), except for input prompt that is used only if that data is not provided from others sources.

View help for a command to know more details to that command, by running:
```
volxitcloud [command] --help
```

### Server Setup

The very first thing you need to do is to setup your VolxitCloud server. You can either do this by visiting `HTTP://IP_ADDRESS_OF_SERVER:3000` in your browser, or the recommended way which is the command line tool.  
Simply run:
```
volxitcloud serversetup
```

Follow the steps as instructed: enter IP address of server and the root domain to be used with this VolxitCloud instance. If you don't know what VolxitCloud root domain is, please visit Volxit.com for documentation. This is a very crucial step.  
After that, you'll be asked to change your VolxitCloud server password, and to enter your email address. This should be a valid email address as it will be used in your SSL certificates.  
After HTTPS is enabled, you'll be asked to enter a name for this VolxitCloud machine, to store auth credential locally. And... Your are done! Go to Deploy section below to read more about app deployment.

For automation purposes, you can provide necessary data before to be prompted for them, for example using a config file like:
```json
{
  "volxitcloudIP": "123.123.123.123",
  "volxitcloudPassword": "volxit21",
  "volxitcloudRootDomain": "root.domain.com",
  "newPassword": "rAnDoMpAsSwOrD",
  "certificateEmail": "email@gmail.com",
  "volxitcloudName": "my-machine-123-123-123-123"
}
```
And then running:
```
volxitcloud serversetup -c /path/to/config.json
```
*Note*: you can also use either YAML or JSON.

### Login

*If you've done the "Server Setup" process through the command line, you can skip "Login" step because your auth credential are automatically stored in the last step of setup.*

This command does login to your VolxitCloud server and store your auth credential locally.  
It is recommended that at this point you have already set up HTTPS. Login over insecure, plain HTTP is not recommended.

To login to your VolxitCloud server, simply run the following command and answer the questions:
```
volxitcloud login
```

If operation finishes successfully, you will be prompted with a success message.

*Note*: you can be logged in to several VolxitCloud servers at the same time; this is particularly useful if you have separate staging and production servers.

For automation purposes, you can provide necessary data before to be prompted for them, for example using a config file like:
```json
{
  "volxitcloudUrl": "volxit.root.domain.com",
  "volxitcloudPassword": "volxit21",
  "volxitcloudName": "testing-1"
}
```
And then running:
```
volxitcloud login -c /path/to/config.json 
```
*Note*: you can also use either YAML or JSON.

### Deploy

Use this command to deploy your application. Deploy via volxitcloud CLI supports 4 deployments methods: volxit-definition file, Dockerfile, tar file, and image name (see [Volxit Definition File](https://volxitcloud.com/docs/volxit-definition-file.html) for more info).

Simply run the following command and answers questions:
```
volxitcloud deploy
```

You will then see your application being uploaded, after that, your application getting built.

*Note*: based on your deployment method, the build process could take multiple minutes, please be patient!

For automation purposes, you can provide necessary data before to be prompted for them, for example directly on the command line by running:
```
volxitcloud deploy -n machine-name -a app-name -b branchName
```
*Note*: you must be logged in to "machine-name".

This can be useful if you want to integrate to CI/CD pipelines.

See command help to know more details and deployments methods.

### List

Use this command to see a list of VolxitCloud machines you are currently logged in to.  
Run the following command:
```
volxitcloud list
```

### Logout

Use this command to logout from a VolxitCloud machine and clear auth info.  
Run the following command and choose a VolxitCloud machine:
```
volxitcloud logout
```

### API

Use this command to call a generic API on a VolxitCloud machine, specifying API path, method (GET or POST), and data. There is no official document for the API commands at this point as it is subject to change at any point. But you can use [ApiManager.ts](https://github.com/volxitcloud/volxitcloud-cli/blob/master/src/api/ApiManager.ts) as a starting point. 

```
volxitcloud api
```

For automation purposes, you can provide necessary data before to be prompted for them, for example using a config file like:
```json
{
  "volxitcloudName": "server-1",
  "path": "/user/apps/appDefinitions/unusedImages",
  "method": "GET",
  "data": {
    "mostRecentLimit": "3"
  }
}
```
And then running (using environment variable for config file value):
```
VOLXITCLOUD_CONFIG_FILE='/path/to/config.json' volxitcloud api -o output.json
```

*Note*: use carefully only if you really know what you are doing!
