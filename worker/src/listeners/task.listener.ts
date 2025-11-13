import {Worker, type Job} from 'bullmq';
import {redis} from '../redis';
import taskJob from '../jobs/task.job';

const DEBUG_ENABLED = true;
const QUEUE_NAME = 'tasks';

export default async function listenToTasks() {
  const worker = new Worker(QUEUE_NAME, taskJob, {
    connection: redis,
  });

  worker.on('ready', () => {
    console.log(`Worker for queue "${QUEUE_NAME}" is ready.`);
  });

  if (DEBUG_ENABLED) {
    worker.on('active', (job: Job) => {
      console.log(`Processing job ${job.id} of type ${job.name}...`);
    });

    worker.on('completed', (job: Job, result: unknown) => {
      console.log(`Job ${job.id} of type ${job.name} completed with result:`, result);
    });
  }

  worker.on('failed', (job: Job | undefined, err: Error) => {
    if (job) {
      console.error(`Job ${job.id} of type ${job.name} failed with error:`, err);
    } else {
      console.error('A job failed without a job reference:', err);
    }
  });

  worker.on('error', (err: Error) => {
    console.error('Worker encountered an error:', err);
  });

  return worker;
}
