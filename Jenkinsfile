#!/usr/bin/env groovy

/**

## Parameters

* `kind`: The kind of project that needs to be build. This refers to the jenkins slave needed to do a basic build of the project. Possible values are `maven`, `nodejs`, `node10`, `netcore21`, `netcore22`, ... (Required)
* `namespace`: The project namespace without suffix (Required)
* `service`: Arrays of all services that need to be build (Required)
* `buildScript`: Custom buildscript that will run during the `Build and test` stage. Overrides the *default build and test execution*.
* `templatepath`: Use to override default openshift templates path. Default path is "root/openshift/" (Optional)
* `dotnetFolder`:
* `dotnetSlnFile`:
* `dotnetTestFolder`:
* `dotnetTestFile`:
* `mainBranch`: Overwrites the main branch (default: `master`).

**/

d09Project  kind: "node16",
            namespace: "webcomponents",
            service: ["verwerkingsregister"]