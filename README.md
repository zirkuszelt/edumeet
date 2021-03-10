# edumeet frontend for embedding

Modified Edumeet frontend with
- reduced UI
- extended Control bar
- autoJoin

It was built to be used within an matrix widget for our Element & Edumeet based video conferencing system.

![Screenshot](screenshot.png)


## how to use
- build frontend `cd app && npm install && npm run build`
- serve `app/build` via nginx
- use external edumeet server in `serverHostname` @ `config/config.js`
- embed it with a link like:
`https://example.com/ROOM?autoJoin=true&displayName=test&locale=en`

The ansible for our setup can be found here: https://github.com/zirkuszelt/ansible