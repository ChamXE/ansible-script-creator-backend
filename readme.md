# Typescript Template for Node.js

Typescript starter template for Node.js

## Installation

Clone from git url

```bash
git clone https://github.com/tanand-tech/node-template-ts.git
```

## Service Templates

### Express API
src/api

Installation
```shell
# Dependencies
npm i cors express cookie-parser express-list-endpoints

# Dev Dependencies
npm i -D @types/cors @types/cookie-parser @types/express @types/express-list-endpoints
```

.env
```dotenv
LOG_REQUEST=true
```

### Influx
src/services/influx

Installation
```shell
# Dependencies
npm i @influxdata/influxdb-client
```

.env
```dotenv
INFLUX_LOG_LEVEL=info
```

### MQTT
src/services/mqtt

Installation
```shell
# Dependencies
npm i mqtt mqtt-match
```

.env
```dotenv
MQTT_LOG_LEVEL=info
```

### Postgresql
src/services/postgres

Installation
```shell
# Dependencies
npm i pg

# Dev Dependencies
npm i -D @types/pg
```

.env
```dotenv
POSTGRES_LOG_LEVEL=info
```

### Redis
src/services/redis

Installation
```shell
# Dependencies
npm i ioredis

# Dev Dependencies
npm i -D @types/ioredis
```

.env
```dotenv
REDIS_LOG_LEVEL=info
```

### Telegram
src/services/telegram

src/api/components/telegram

Installation
```shell
# Dependencies
npm i node-telegram-bot-api

# Dev Dependencies
npm i -D @types/node-telegram-bot-api
```

.env
```dotenv
TELEGRAM_LOG_LEVEL=info
```

### Providers
src/providers

Installation
```shell
# Dependencies
npm i axios
```
