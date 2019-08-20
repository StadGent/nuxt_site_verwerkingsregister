#!/usr/bin/env groovy

def tagSource(fromTag, toTag, commitMessage) {
	tagBranch("refs/tags/${fromTag}", toTag, commitMessage);
}

def tagBranch(fromBranch, toTag, commitMessage) {
	checkout([$class: 'GitSCM', branches: [[name: fromBranch]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'digipolisgent-ci', url: 'git@github.com:StadGent/nuxt_site_verwerkingsregister.git']]])
	
	sh """
		git config user.name Jenkins
		git config user.email jenkins@digipolis.gent
		git tag -l ${toTag}
		git tag -a -f -m '${commitMessage}' ${toTag}
	"""
	
	withCredentials([sshUserPrivateKey(credentialsId: 'digipolisgent-ci', keyFileVariable: 'GITHUB_KEY')]) {
		sh 'echo ssh -i $GITHUB_KEY -l git -o StrictHostKeyChecking=no \\"\\$@\\" > ./run_ssh.sh'
		sh 'chmod +x ./run_ssh.sh'
		
		withEnv(['GIT_SSH=./run_ssh.sh']) {
			sh "git push git@github.com:StadGent/nuxt_site_verwerkingsregister.git ${toTag} -f"
		}
	}
}

podTemplate(cloud: 'openshift') {

    node('maven') {
        stage('Deploy to DV') {
            checkout([$class: 'GitSCM', branches: [[name: 'master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'digipolisgent-ci', url: 'git@github.com:StadGent/nuxt_site_verwerkingsregister.git']]])

            sh 'chmod +x openshift/deploy-dv.sh'
            sh 'openshift/deploy-dv.sh'
			sh 'sleep 10'

            openshiftVerifyBuild bldCfg: 'verwerkingsregister', checkForTriggeredDeployments: 'false', namespace: 'verwerkingsregisterdv', verbose: 'false', waitTime: '600000'
            openshiftVerifyDeployment depCfg: 'verwerkingsregister', namespace: 'verwerkingsregisterdv', verbose: 'false', verifyReplicaCount: 'true', waitTime: '6000', waitUnit: 'sec'

            openshiftTag alias: 'false', destStream: 'verwerkingsregister', destTag: 'accepted_dv', destinationNamespace: 'verwerkingsregisterdv', namespace: 'verwerkingsregisterdv', srcStream: 'verwerkingsregister', srcTag: 'latest'

            tagBranch("master", "accepted_dv", "Deployed on openshift DV project")
        }

		input message: "Promote to QA?"
        
		try {
			stage('Deploy to QA') {
				checkout([$class: 'GitSCM', branches: [[name: 'accepted_dv']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'digipolisgent-ci', url: 'git@github.com:StadGent/nuxt_site_verwerkingsregister.git']]])

				openshiftTag alias: 'false', destStream: 'verwerkingsregister', destTag: 'qa', destinationNamespace: 'verwerkingsregisterdv', namespace: 'verwerkingsregisterdv', srcStream: 'verwerkingsregister', srcTag: 'accepted_dv'

				sh 'chmod +x openshift/deploy-qa.sh'
				sh "openshift/deploy-qa.sh"
				sh "sleep 30"

				openshiftVerifyDeployment depCfg: 'verwerkingsregister', namespace: 'verwerkingsregisterqa', verbose: 'false', verifyReplicaCount: 'true', waitTime: '6000', waitUnit: 'sec'

				tagSource("accepted_dv", "qa", "Deployed on openshift QA project")
			}

			input message: "Approve version on QA?"

			stage ('Approved QA') {
				openshiftTag alias: 'false', destStream: 'verwerkingsregister', destTag: 'approved_qa', destinationNamespace: 'verwerkingsregisterdv', namespace: 'verwerkingsregisterdv', srcStream: 'verwerkingsregister', srcTag: 'accepted_dv'

				tagSource("qa", "approved_qa", 'Tested manually and approved on QA')
			}
		} catch(error1) {
			echo "Error deploying to QA, trying to rollback"
			
			try {
				openshiftTag alias: 'false', destStream: 'verwerkingsregister', destTag: 'qa', destinationNamespace: 'verwerkingsregisterdv', namespace: 'verwerkingsregisterdv', srcStream: 'verwerkingsregister', srcTag: 'approved_qa'

				checkout([$class: 'GitSCM', branches: [[name: 'refs/tags/approved_qa']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'digipolisgent-ci', url: 'git@github.com:StadGent/nuxt_site_verwerkingsregister.git']]])

				sh 'chmod +x openshift/deploy-qa.sh'
				sh "openshift/deploy-qa.sh"
				sh "sleep 10"

				openshiftVerifyDeployment depCfg: 'verwerkingsregister', namespace: 'verwerkingsregisterqa', verbose: 'false', verifyReplicaCount: 'true', waitTime: '6000', waitUnit: 'sec'

				tagSource("approved_qa", "qa", 'Rolled QA back to last known good version')
			} catch (error2) {
				// there is no approved_qa image or tag on the first run
			}
			throw error1;
		}
	
		input message: "Promote to PR?"

		try {
        	stage ('Import image from QA') {
	            withCredentials([string(credentialsId: 'verwerkingsregisterpr-dg-image-manager-secret', variable: 'token')]) {
	                sh 'oc login https://openshift.gentgrp.gent.be:8443 --token=$token --insecure-skip-tls-verify'
	                sh 'oc project verwerkingsregisterpr'
	                sh 'oc import-image verwerkingsregister:approved_qa --from registry.servicesqa.local/verwerkingsregisterdv/verwerkingsregister --confirm --insecure=true'
	            }
        	}
        
	        stage('Deploy to PR') {
	            withCredentials([string(credentialsId: 'verwerkingsregisterpr-dg-image-manager-secret', variable: 'token')]) {
	            	try {
	            		// Tag previous production in openshift
						openshiftTag alias: 'false', destStream: 'verwerkingsregister', destTag: 'previous_production', destinationNamespace: 'verwerkingsregisterpr', namespace: 'verwerkingsregisterpr', srcStream: 'verwerkingsregister', srcTag: 'production', apiURL: 'https://openshift.gentgrp.gent.be:8443', authToken: '$token'

	            		//Tag previous_production in GitHub
						tagSource("production", "previous_production", 'Previous version in production')
	            	} catch (error3) {
	            		// there is no previous_production image or tag on the first run
	            	}

					// Tag new production image in docker
					openshiftTag alias: 'false', destStream: 'verwerkingsregister', destTag: 'production', destinationNamespace: 'verwerkingsregisterpr', namespace: 'verwerkingsregisterpr', srcStream: 'verwerkingsregister', srcTag: 'approved_qa', apiURL: 'https://openshift.gentgrp.gent.be:8443', authToken: '$token'

					checkout([$class: 'GitSCM', branches: [[name: 'refs/tags/approved_qa']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'digipolisgent-ci', url: 'git@github.com:StadGent/nuxt_site_verwerkingsregister.git']]])

	            	sh 'oc login https://openshift.gentgrp.gent.be:8443 --token=$token --insecure-skip-tls-verify'
	                sh 'chmod +x openshift/deploy-pr.sh'
					sh "openshift/deploy-pr.sh"
					sh "sleep 30"

	                openshiftVerifyDeployment depCfg: 'verwerkingsregister', namespace: 'verwerkingsregisterpr', verbose: 'false', verifyReplicaCount: 'true', waitTime: '6000', waitUnit: 'sec', apiURL: 'https://openshift.gentgrp.gent.be:8443', authToken: '$token'
	            }
	        }

        	stage ('In production') {
				tagSource("approved_qa", "production", 'Deployed and passed smoke tests on openshift PR project')
			}
		} catch (error4) {
			try {
				withCredentials([string(credentialsId: 'verwerkingsregisterpr-dg-image-manager-secret', variable: 'token')]) {
					echo "Error deploying to production, trying to rollback"

					openshiftTag alias: 'false', destStream: 'verwerkingsregister', destTag: 'production', destinationNamespace: 'verwerkingsregisterpr', namespace: 'verwerkingsregisterpr', srcStream: 'verwerkingsregister', srcTag: 'previous_production', apiURL: 'https://openshift.gentgrp.gent.be:8443', authToken: '$token'

					sh 'oc login https://openshift.gentgrp.gent.be:8443 --token=$token --insecure-skip-tls-verify'
					sh 'chmod +x openshift/deploy-pr.sh'
					sh "openshift/deploy-pr.sh"
					sh "sleep 30"

					openshiftVerifyDeployment depCfg: 'verwerkingsregister', namespace: 'verwerkingsregisterpr', verbose: 'false', verifyReplicaCount: 'true', waitTime: '6000', waitUnit: 'sec', apiURL: 'https://openshift.gentgrp.gent.be:8443', authToken: '$token'

					tagSource("previous_production", "production", 'Reverted production to last known good version')
				}
			} catch (error5) {
				// there is no previous_production image or tag on the first run
			}
			throw error4;
		}
	}
}