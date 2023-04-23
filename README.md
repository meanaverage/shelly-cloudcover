# shellymjs-UScloudcover

### What is this?

A Shelly compatible script for their neutered version of MongooseJS scripting language.


### What does it do?

Checks National Weather Service (US) API for cloud cover conditions for your desired observation station and activate/deactivate switch power based on cloud cover.  Predefined if/else also checks current time to operate within set hours.

Makes use of National Weather API which does NOT require an API KEY.  Completely free service.  Wrote this after becoming frustrated with Weather Underground and Accuweather services API rate limiting and fees.


### Notes:

Because the response body is not returned as a strict JSON application type and Shelly's MJS spec is extremely neutered in its abilities the very limited HTTP response parser will not parse to JSON as National Weather API returns GEOJSON and LD+JSON ONLY.
:( 

Therefore, we pick out the cloud cover conditions using a combination of decoding the binary response field and string manipulation to discover cloud cover conditions based on standardized cloud cover condition codes.  Most US observation stations follow the same format, so this will work in most instances.

Tested thoroughly on Shelly Plus1PM devices.
