const gitBranchName = require('git-branch-name')
const standardVersion = require('standard-version')
const paths = require('paths')
const gulp = require('gulp')

const config = require(paths.project.config$)

gulp.task('release', function (done) {
	getGitBranchName(paths.git.root$, (err, branchName) => {
		const manifest = gulp.src([paths.app.manifest$])

		if (config.releaseBranchNames.includes(branchName)) {
			// run standard-version
			// if not master, create pre-release

			const options = {}
			if (branchName !== 'master'){
				options.preRelease = branchName
			}

			standardVersion(options, () => {

				// change manifest version + stage changes


			})


		}

		if (branchName === 'master') {
			manifest.pipe(replace(/"version":.*?"(\d+?)\.(\d+?)\.(\d+?)\.(\d+?)"/, '"version": "$1.$2.$3"')) // set production version
		}

	})
})
