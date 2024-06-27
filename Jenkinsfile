#!/usr/bin/env groovy

@Library("jenkins-shared-pipelines") _

d09Project  jenkinsCiAgent: "node16",
			cdServices: ["verwerkingsregister-v1"],
			ciSkipPublish: true,
			openshiftDeployNamespace: "d09-webcomponents",
			gitOpsPath: "verwerkingsregister/verwerkingsregister-v1",
			argoCdApplication: "verwerkingsregister",
			argoCdComponent: "verwerkingsregister-v1"
