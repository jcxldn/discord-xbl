// Scripted Pipeline
// Requires libraries from https://github.com/Prouser123/jenkins-tools
// Made by @Prouser123 for https://ci.jcx.ovh.

node('docker-cli') {
  scmCloneStage()
  
  docker.image('jcxldn/jenkins-containers:node12').inside {
    stage('Prettier Check') {
      unstash 'scm'
      sh 'npm ci && npm run prettier:check
    } 
  }
  
  deployStage()
}
