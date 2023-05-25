#!/usr/bin/env groovy

@Library("jenkins-shared-pipelines") _

d09Project  jenkinsCiAgent: "node16",
			cdSemanticRelease: true,
			cdServices: ["verwerkingsregister-v1"],
			openshiftDeployNamespace: "webcomponents",
			gitOpsPath: "verwerkingsregister/verwerkingsregister-v1",
			argoCdApplication: "verwerkingsregister",
			argoCdComponent: "verwerkingsregister-v1"
