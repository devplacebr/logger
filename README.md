# README

Devplace Logger Helper

- Console log colorized
- Slack notifications (optional)
- Daily rotate log file (optional)

## Instalation

* ```yarn add @devplace/logger```

## USE

```javascript
import { logger } from '@devplace/logger'

logger.info("some string")
logger.info({foo: 'bar', type: 'some json object'})


// Error handling

try {
  throw new Error('throw new Braba');
} catch (error) {
    logger.error(error) // If slack configured, wil send a slack notification
}

```

## CONFIGURATION

Configure your env vars:

```bash
  process.env.APP_NAME = <your_app_name_string>  // default: 'CHANGE_ME'
  process.env.NODE_ENV = <your_app_stage_string>  // default: "development"

  process.env.LOCAL_LOG_ENABLED = 1  // default: 0 (disabled)
  process.env.LOCAL_LOG_LEVEL = "info"  // default: "info"

  process.env.SLACK_ENABLED = 0  // default: 1 (enabled)
  process.env.SLACK_LEVEL = "warn"  // default: "error"
  process.env.SLACK_URL = <your_slack_channel_url_string>  
```

## Logging

Logging levels in `winston` conform to the severity ordering specified by [RFC5424]: _severity of all levels is assumed to be numerically **ascending** from most important to least important._

``` js
const levels = { 
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
```
