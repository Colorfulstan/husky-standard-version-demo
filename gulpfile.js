const getGitBranchName = require('git-branch-name')
const standardVersion = require('standard-version')
const paths = require('./paths.js')
const gulp = require('gulp')
const replace = require('gulp-replace')
var git = require('gulp-git'); // https://www.npmjs.com/package/gulp-git

const execFile = require('child_process').execFile

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
					postbump: 'gulp release:manifest',
					postchangelog: 'gulp release:changelogDiff'
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

gulp.task('release:changelogDiff', function () {
	const cwd = __dirname
	return new Promise((resolve, reject) => {
		const child = execFile(
			'git',
			['diff', 'v1.13.46', 'v1.13.47', 'CHANGELOG.md'],
			{ cwd },
			(error, stdout, stderr) => {
				if (error) {
					console.error(stderr)
					reject(error)
				}
				let log = stdout

				// remove the first 9 lines
				for (let i = 0; i < 8; i++) {
					log = log.replace(/(.*[\r\n])/m, '')
				}
				// console.log(log)

				// remove + signs
				log = log.replace(/^(\+)/gm, '')

				// remove commit links
				log = log.replace(/\(\[.*/g, '')

				// remove compare links
				log = log.replace(/## \[.*/g, '')

				// remove empty lines
				log = log.replace(/^(?:[\t ]*(?:\r?\n|\r))+/gm, '')
				// log = log.replace(/^$/gm, '')

				console.log(log)
				// console.error(stderr)
				resolve(log)
			})

		child.stdout.on('data', (data) => {
			// console.log(`stdout: ${data.toString()}`)
		})

		child.stderr.on('data', (data) => {
			// console.log(`stderr: ${data.toString()}`)
		})

		child.on('exit', (code) => {
			// console.log(`child process exited with code ${code.toString()}`)
		})
	})

})