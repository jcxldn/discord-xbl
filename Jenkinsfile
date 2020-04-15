// Scripted Pipeline
// Requires libraries from https://github.com/Prouser123/jenkins-tools
// Made by @Prouser123 for https://ci.jcx.ovh.

node('docker-cli') {
  scmCloneStage()
  
  useDockerImage('jcxldn/vips-docker:node12-alpine') {
    stage('Prettier Check') {
	    // Get the files
      unstash 'scm'

	    // Install python and other system tools for sharp.
      // Also install curl for ghSetStatus
	    sh 'apk add --no-cache curl glib-dev fftw-dev build-base python3 && if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi && python3 -m ensurepip && rm -r /usr/lib/python*/ensurepip && pip3 install --no-cache --upgrade pip setuptools wheel && if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi'
	  
	    // Run the check.
      sh 'npm ci && npm run prettier:check'
	  
	    // Set GitHub status.
	    ghSetStatus("The check passed.", "success", "ci/prettier")
    } 
  }
  
  // If on the master branch, deploy with GitHub status checks enabled.
  deployStage(true)
}
