# AutoTest exercise

Please check comments in files from 'tests' folder.
Most tests were done for PUT method in put.js

I didn't cover POST and DELETE methods much since its a test exercise and errors mostly repeat themselves from method to method.

#### Potential issues found during test runs:

-   Limit quota is 11 instead of 10.
-   Error messages are not informative as they should be.
-   Some requests respond with Python traceback errors which could lead to potential data leak and can be considered as a security issue.

#### What was NOT checked:

-   Response time
-   File uploading
-   Different content-types
-   5xx errors

### Installation:

Clone repository & then:

```bash
yarn
```

### Running tests:

```bash
yarn test
```
