const getGitBranchName = require('git-branch-name')
const standardVersion = require('standard-version')
const paths = require('./paths.js')
const gulp = require('gulp')
const replace = require('gulp-replace')
var git = require('gulp-git'); // https://www.npmjs.com/package/gulp-git

const config = require(paths.project.config$)

gulp.task('release', function (done) {
	getGitBranchName(paths.git.root$, (err, branchName) => {
		if (err) {
			console.error(err)
			done(err)
		}

		if (config.releaseBranchNames.includes(branchName)) {
			const options = {
				commitAll: true,
				scripts: {
					postbump: 'gulp release:manifest'
				}
			}

			if (branchName !== 'master') {
				options.prerelease = branchName
			}

			standardVersion(options, (err) => {
				if (err) {
					console.err(err)
					done(err)
				}

				// change manifest version + stage changes
				done()
			})
		}
	})
})

gulp.task('release:manifest', function () {
	const pckg = require(paths.project.pckg$)
	// remove -qa, -dev, -beta but keep the digit
	const manifestVersion = pckg.version.replace(/-\D*?\./, '.')

	return gulp.src(paths.app.manifest$)
		.pipe(replace(/"version":(.*?),/, `"version":"${manifestVersion}",`))
		.pipe(gulp.dest(paths.app.root))
		.pipe(git.add())
})