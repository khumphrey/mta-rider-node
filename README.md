# rail-rider-node

This is an app that provides NYCT information as JSON data.

## Resources

This is currently hosted at https://immense-journey-06214.herokuapp.com

### Stop Data

`/stops`

Will return all stops. If an array of ids are sent in as query strings, then the stops will be filtered by the ids.

`/stop?ids=[635]` or `/stops?ids=[101,103,110]`

An alternate to looking up a single stop is `/stops/:id` (e.g. `/stops/110`)

### Status

`/status`

Will return all statuses for all. To filter by type, add a query string `type` with one of the accepted types: subway, bus, BT, LIRR, or MetroNorth.

`/status/MetroNorth`

If a type is sent that is not one of the accepted types a 422 failure will be sent.

### Schedule

`/schedule?stopIds=[635,110]`

This has a required query string of `stopIds`, which expects an array of stop id(s). This will return the schedule for the requested stop ids. An optional query string of `feedId` is also allowed.

`/schedule?stopIds=[635,110]&feedId=1`

If stopIds are not sent, then a 422 failure will be sent.