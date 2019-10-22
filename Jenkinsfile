#!/usr/bin/env groovy

node('maven') {
	openshift.withCluster("openshiftqa") {
		stage ('Unit tests') {
			checkout([$class: 'GitSCM', branches: [[name: 'master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'digipolisgent-ci', url: 'git@github.com:StadGent/nuxt_site_verwerkingsregister.git']]])

			//withSonarQubeEnv("DGSonarQube") {
			//	sh "./mvnw -s .mvn/settings.xml -B clean org.jacoco:jacoco-maven-plugin:prepare-agent test org.jacoco:jacoco-maven-plugin:prepare-agent-integration deploy sonar:sonar"
			//}

			//junit testResults: '**/target/surefire-reports/TEST-*.xml', allowEmptyResults: true;
			//junit testResults: '**/target/failsafe-reports/TEST-*.xml', allowEmptyResults: true;
		}

        stage ('Deploy to DV') {
        	sh 'openshift/deploy-dv.sh'

        	openshiftStartBuild namespace:"webcomponentsdv", bldCfg: "verwerkingsregister"

			openshiftVerifyDeployment namespace : "webcomponentsdv", depCfg: "verwerkingsregister"
        }

        stage ('Blackbox tests') {
			//withCredentials([string(credentialsId: 'net_service_medewerker-api_dv_v1', variable: 'apiTokenV1'), string(credentialsId: 'net_service_burgeraccount_dv_v2', variable: 'apiTokenV2')]) {
				//	sh "cd cucumber && ../mvnw -s ../.mvn/settings.xml test -Dmaven.test.failure.ignore=true -Dcucumber.test.host=\"https://apidgdv.gent.be\"  -Dcucumber.test.userkey.v1=${apiTokenV1} -Dcucumber.test.namespace=/supporting/document-generation -Dcucumber.test.userkey.v2=${apiTokenV2} -Dcucumber.options=\"--tags 'not @bypassGateway and not @localOnly and not @ignore'\""
			//}

			//junit testResults: 'cucumber/target/surefire-reports/TEST-*.xml'

			//if (currentBuild.result == null) {
	            openshiftTag srcNs: "webcomponentsdv", srcStrm: "verwerkingsregister", srcTag: "latest", destNs: "webcomponentsdv", destStrm: "verwerkingsregister", destTag: "accepted_dv"
			//} else {
			//	error 'Build unstable'
			//}
		}

		input message: "Promote to QA?"
        
		try {
			stage ('Deploy to QA') {
				openshiftTag srcNs: "webcomponentsdv", srcStrm: "verwerkingsregister", srcTag: "accepted_dv", destNs: "webcomponentsdv", destStrm: "verwerkingsregister", destTag: "qa"

				sh "openshift/deploy-qa.sh"

				openshiftVerifyDeployment namespace : "webcomponentsqa", depCfg: "medewerker-api"
			}

			stage ('Blackbox tests') {
				//sh "curl http://burgeraccount.employeesqa.svc:8080"
				//sh "npm install"
			    //sh "TEST_URL='http://burgeraccount.employeesqa.svc:8080/' API_NAMESPACE_PREFIX='employees/burgeraccount/v1/' npm run test-v1"
			}

			stage ('Performantie tests') {
				//sh "cd gatling/; TEST_URL='http://burgeraccount.servicesdv.svc:8080/employees/burgeraccount' ../mvnw gatling:test"

				//archiveArtifacts artifacts: 'gatling/target/gatling/**/*', allowEmptyArchive: false
			}

			input message: "Approve version on QA?"

			stage ('Approved QA') {
				openshiftTag srcNs: "webcomponentsdv", srcStrm: "verwerkingsregister", srcTag: "accepted_dv", destNs: "webcomponentsdv", destStrm: "verwerkingsregister", destTag: "approved_qa"
			}
		} catch (error1) {
			try {
				echo "Error deploying to QA, trying to rollback"

				openshiftTag srcNs: "webcomponentsdv", srcStrm: "verwerkingsregister", srcTag: "approved_qa", destNs: "webcomponentsdv", destStrm: "verwerkingsregister", destTag: "qa"

				sh "openshift/deploy-qa.sh"

				openshiftVerifyDeployment namespace : "webcomponentsqa", depCfg: "verwerkingsregister"
			} catch (error2) {
				// there is no approved_qa image or tag on the first run
			}
			throw error1;
		}
	}

	input message: "Promote to PR?"

	openshift.withCluster("openshiftpr") {
		try {
        	stage ('Import image from QA') {
        		// Import image from qa-cluster
	            withCredentials([string(credentialsId: 'dg_deployer_pr', variable: 'dg_deployer_pr')]) {
	                sh 'oc login https://openshift.gentgrp.gent.be:8443 --token=$dg_deployer_pr --insecure-skip-tls-verify'
					sh 'oc project webcomponentspr'
	                sh 'oc import-image verwerkingsregister:approved_qa --from registry.servicesqa.local/webcomponentsdv/verwerkingsregister --confirm --insecure=true'
	            }
        	}
        
	        stage ('Deploy to PR') {
	            withCredentials([string(credentialsId: 'dg_deployer_pr', variable: 'dg_deployer_pr')]) {
	            	try {
	            		// Tag previous production in openshift
						openshiftTag srcNs: "webcomponentspr", srcStrm: "verwerkingsregister", srcTag: "production", destNs: "webcomponentspr", destStrm: "verwerkingsregister", destTag: "previous_production", cluster: "openshiftpr"
	            	} catch (error4) {
	            		// there is no previous_production image or tag on the first run
	            	}

					// Tag new production image in docker
					openshiftTag srcNs: "webcomponentspr", srcStrm: "verwerkingsregister", srcTag: "approved_qa", destNs: "webcomponentspr", destStrm: "verwerkingsregister", destTag: "production", cluster: "openshiftpr"

	            	sh 'oc login https://openshift.gentgrp.gent.be:8443 --token=$dg_deployer_pr --insecure-skip-tls-verify'
					sh 'oc project webcomponentspr'
					sh "openshift/deploy-pr.sh"

	                openshiftVerifyDeployment namespace : "webcomponentspr", depCfg: "verwerkingsregister", cluster: "openshiftpr"
	            }
	        }

	        stage ('Smoke tests') {
				//withCredentials([string(credentialsId: 'api-burgeraccount-pr', variable: 'TOKEN')]) {
					//git url: "git@github.com:digipolisgent/net_service_burgeraccount.git", credentialsId: 'digipolisgent-ci'

					//sh 'curl --header "user_key: $TOKEN" https://apidg.gent.be:443/status/am-i-up'
					//sh "npm install"
				    //sh "TEST_URL='https://apidg.gent.be:443' API_KEY='$TOKEN' npm run smoke-test"
				//}
			}

        	stage ('In production') {
			}
		} catch (error3) {
			try {
				withCredentials([string(credentialsId: 'dg_deployer_pr', variable: 'dg_deployer_pr')]) {
					echo "Error deploying to production, trying to rollback"

					openshiftTag srcNs: "webcomponentspr", srcStrm: "verwerkingsregister", srcTag: "previous_production", destNs: "webcomponentspr", destStrm: "verwerkingsregister", destTag: "production", cluster: "openshiftpr"

					sh 'oc login https://openshift.gentgrp.gent.be:8443 --token=$dg_deployer_pr --insecure-skip-tls-verify'
					sh 'oc project webcomponentspr'
					sh "openshift/deploy-pr.sh"

					openshiftVerifyDeployment namespace : "webcomponentspr", depCfg: "verwerkingsregister", cluster: "openshiftpr"
				}
			} catch (error5) {
				// there is no previous_production image or tag on the first run
			}
			throw error3;
		}
	}
}
