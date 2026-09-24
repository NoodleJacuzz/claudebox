/**
 * Splits a list of jobs across copies of a balance tool. Not part of the game.
 *
 * The copies are operating-system processes started with `child_process.fork`, one per CPU thread asked
 * for. They are not AI agents and cost no usage (balance_tests/BRIEF.md Step 2). Each copy loads its own
 * engine, so nothing is shared between them, and the same job gives the same answer in any copy.
 *
 * HOW A TOOL USES IT. The tool file is both the parent and the child:
 *
 *   const workers = require("./lib/workers");
 *   if (workers.isChild()) workers.serve(function (options) { ...build once...; return function (job) { return result; }; });
 *   else { const outcome = await workers.runJobs({ file: __filename, options, jobs, workers: N }); }
 *
 * `serve` takes a factory that is called once per process with the tool's options and returns the
 * function that runs one job. `runJobs` returns {results, failures}: results in JOB ORDER whatever order
 * they finished in, so a report is the same at any worker count (BRIEF rule 5). A job that throws, or a
 * process that dies mid-job, is listed in `failures` with the job's own description and never dropped.
 *
 * With one worker no process is started and the jobs run in this one, so a profiler or a debugger sees
 * the real work.
 */
const childProcess = require("child_process");

function isChild() { return process.env.HONEYCOMB_BALANCE_WORKER === "1"; }

//Child side: waits for {type:"init", options}, then answers each {type:"job", id, job}.
function serve(factory) {
	let run = null;
	process.on("message", (message) => {
		if (message.type === "init") {
			run = factory(message.options);
			process.send({ type: "ready" });
		} else if (message.type === "job") {
			try {
				process.send({ type: "result", id: message.id, result: run(message.job) });
			} catch (error) {
				process.send({ type: "failure", id: message.id, error: String(error && error.stack || error) });
			}
		} else if (message.type === "stop") {
			process.exit(0);
		}
	});
}

//Parent side. `factory` is only needed for one worker, where the jobs run in this process.
//  file      the tool to fork
//  options   plain data handed to every worker's factory
//  jobs      plain data, one entry per job
//  workers   how many processes (default 1)
//  onProgress(done, total)  called as jobs finish
//  describe(job)  a short name for a job, used in the failure list (default: JSON of the job)
async function runJobs(settings) {
	const jobs = settings.jobs;
	const describe = settings.describe || ((job) => JSON.stringify(job));
	const workerCount = Math.max(1, Math.min(settings.workers || 1, jobs.length || 1));
	const results = new Array(jobs.length);
	const failures = [];
	let done = 0;
	const finished = () => { done++; if (settings.onProgress) settings.onProgress(done, jobs.length); };

	if (workerCount === 1) {
		const run = settings.factory(settings.options);
		for (let id = 0; id < jobs.length; id++) {
			try { results[id] = run(jobs[id]); }
			catch (error) { failures.push({ id, job: describe(jobs[id]), error: String(error && error.stack || error) }); }
			finished();
		}
		return { results, failures };
	}

	await new Promise((resolve) => {
		let next = 0, live = 0;
		function launch() {
			const child = childProcess.fork(settings.file, process.argv.slice(2), {
				env: Object.assign({}, process.env, { HONEYCOMB_BALANCE_WORKER: "1" }),
			});
			live++;
			let current = null;
			let closed = false;
			const feed = () => {
				if (next < jobs.length) { current = next++; child.send({ type: "job", id: current, job: jobs[current] }); }
				else { current = null; child.send({ type: "stop" }); }
			};
			child.on("message", (message) => {
				if (message.type === "ready") { feed(); return; }
				if (message.type === "result") results[message.id] = message.result;
				else failures.push({ id: message.id, job: describe(jobs[message.id]), error: message.error });
				finished();
				feed();
			});
			child.on("exit", (code) => {
				if (closed) return;
				closed = true;
				live--;
				if (current != null) {
					//Died mid-job. The job is reported, and a fresh process carries on with the rest.
					failures.push({ id: current, job: describe(jobs[current]), error: "the worker process exited (code " + code + ") while running this job" });
					finished();
					if (next < jobs.length) launch();
				}
				if (live === 0) resolve();
			});
			child.send({ type: "init", options: settings.options });
		}
		for (let index = 0; index < workerCount; index++) launch();
	});
	failures.sort((a, b) => a.id - b.id);
	return { results, failures };
}

module.exports = { isChild, serve, runJobs };
