## slack

[create bot](https://my.slack.com/services/new/bot)

 * name=nocode-slackbot
 * upload image

copy token and set the token in env files

invite @nocode-bot into channels

[bot config page](https://enterprise1701.slack.com/services/1207221801924)


## janitor

https://api.slack.com/apps/A016BET1M38/slash-commands?

## to upload files to janitor

Sometimes we need to upload file to the janitor - for example when importing roles or projects.

To do this we need to:

 * upload the `.json` file to operations
 * share the file with `@fc-bot`
   * click the share arrow
   * type `@fc-bot` into the name
 * get a `raw` link to the file
   * click the 3 dots
   * click `view raw`
   * copy the url in the browser
   * **IMPORTANT** remove the `https://files.slack.com/files-pri/` part of the URL - if that is not in the URL make sure you click the `raw` link

Then you can run the janitor command pointing at the file:

```
/fc project import T9RHS6GH1-F01914CKMD0/project.json
```
