# Jobsity Node Chat Challenge

**All required features and bonus were implemented.**

## Running

### Requirements

- Docker (tested on v19.03.12)
- Docker Compose (tested on version 1.26.0)
- Node (tested on v12.14.0)
- NPM (tested on v6.13.4)

The application was developed and tested on Ubuntu 18.04.

### Installation

To simplify the installation process, open your console on ./chat-solution-starter then run:

```
# the following command will take a while - grab a coffee

npm run up-infrastructure

# if you had problems running the command above, try "npm run up-infrastructure-sudo"
# I needed sudo permission on Ubuntu

# now you'll need to open a new console to run the following command
# it will take a while too. I hope you have saved some coffee.

npm run install-and-start-projects
```

### Credentials

The installation process creates a few user for you.
If everything went well, they should be available.

| Username | Password |
| --- | ---|
| user1 | pass1 |
| user2 | pass2 |
| user3 | pass3 |
| user4 | pass4 |

## Quick Notes

### Chat Server

Express and Socket.IO server.

I usa a service locator to manage dependencies.

I organized the code in layers. Application, infrastructure, domain (modules), UI.

### Chat Client

React.JS project. I was not worried about practices in this project. I was favoring time over quality.

### Chat Bot

It basically consumes a Work Queue to process commands and send the response to another queue. Multiples instances could be started if the load increases.

I structured the project to support multiple commands - but only one is implemented.

Contains some tests.

The project is more about infrastructure, so I did not care to organize it in many layers.

There is not a service locator in this project - it would not bring considerable benefits. The instantiation of all required components is done in the entry file.