# AutoTest exercise

Please check comments in files from 'tests' folder.
Most tests were done for PUT method in put.js

Arange, Act, Assert pattern was used mostly. Only positive scenarios of PUT, POST and DELETE methods were covered with GET assertions.
I didn't cover POST and DELETE methods much since its a test exercise and errors mostly repeat themselves from method to method.

#### Issues found during test runs:

-   Limit quota is 11 instead of 10.
-   Value accepts anything instead of a string.
-   Error messages are not as informative as they should be. Some of them don't match the result.
-   Error messages are raw response and some contain Python traceback which can be considered as security issue.

#### Things that were NOT covered in tests but I'm aware of:

-   Response time
-   File uploading
-   Different content-type and other headers
-   5xx errors (I know how mocks work)
-   Max key & value length (boundary values)
-   Response length assertions (long value is not cut)
-   Uppercase/lowercase symbols (might lost their initial register)
-   Special symbols (not disappeared/converted to entities)

### Installation:

Clone repository and then:

```bash
yarn
```

### Running tests:

```bash
yarn test
```
