#!/usr/bin/env groovy

node('maven') {
	openshift.withCluster("openshiftqa") {
        stage ('Deploy to DV') {
        	//sh 'openshift/deploy-dv.sh'

        	//openshiftStartBuild namespace:"webcomponentsdv", bldCfg: "verwerkingsregister"

			//openshiftVerifyDeployment namespace : "webcomponentsdv", depCfg: "verwerkingsregister"
        }

		input message: "Promote to QA?"

		stage ('Deploy to QA') {
        	sh 'openshift/deploy-qa.sh'

        	openshiftStartBuild namespace:"webcomponentsqa", bldCfg: "verwerkingsregister"

        	openshiftVerifyDeployment namespace : "webcomponentsqa", depCfg: "verwerkingsregister"
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
