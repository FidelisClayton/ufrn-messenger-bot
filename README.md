[![Coverage Status](https://coveralls.io/repos/github/FidelisClayton/ufrn-messenger-bot/badge.svg?branch=master)](https://coveralls.io/github/FidelisClayton/ufrn-messenger-bot?branch=master)
[![Build Status](https://travis-ci.org/FidelisClayton/ufrn-messenger-bot.svg?branch=master)](https://travis-ci.org/FidelisClayton/ufrn-messenger-bot)
# ufrn-messenger-bot
A Facebook Messenger Bot to consult UFRN bus stops and universitary restaurant

### Folder structure
#### App
We have a source folder called `app`, which contain all of our app Javascript code and assets.

| Folder      | Description                              |
|-------------|------------------------------------------|
| Components  | Messenger API templates                  |
| Handlers    | Switchs to handle the incoming messages  |
| Helpers     | Useful functions                         |
| Messages    | Functions to send messages               |

### Development
First of all you will need to set 2 enviroment variables:

| Variable            | Description             |
|---------------------|-------------------------|
| MESSENGER_TOKEN     | The messenger api token |
| API_AI_CLIENT_TOKEN | The api.ai client token |

So, install the project dependencies:
```sh
npm install
```
And at last but not least start the server:
```sh
npm start
```
