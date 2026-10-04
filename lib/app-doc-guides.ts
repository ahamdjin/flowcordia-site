export type GuideSection = { id: string; title: string; paragraphs: string[] };
export type AppDocGuide = {
  paths: string[];
  title: string;
  introduction: string;
  sections: GuideSection[];
  availability?: string;
};
function section(
  id: string,
  title: string,
  ...paragraphs: string[]
): GuideSection {
  return { id, title, paragraphs };
}

export const APP_DOC_GUIDES: AppDocGuide[] = [
  {
    paths: ['tasks/overview', 'v3/tasks-overview'],
    title: 'Tasks',
    introduction:
      'A task is an executable unit of work. It must be discovered, built and connected to a worker before it can run.',
    sections: [
      section(
        'setup',
        'Register a task',
        'Select the project and environment. Define a stable task ID and explicit input contract using the SDK shipped with your application release. Start development or deploy the source, then confirm that the task appears in Tasks.',
        'Pushing a file to GitHub is not the same as registering a running worker.'
      ),
      section(
        'schema',
        'Validate input',
        'Validate untrusted payloads before changing external systems. Required fields, types and defaults should match the Test view. Use a schema-backed task when your SDK supports it.'
      ),
      section(
        'results',
        'Inspect results',
        'Trigger with a safe payload and follow the run. Inspect output, logs and attempt status. Keep large artifacts in authorized storage and return a reference.'
      ),
    ],
  },
  {
    paths: ['triggering', 'v3/triggering'],
    title: 'Triggering tasks',
    introduction:
      'Triggering creates a run for a registered task. API acceptance does not mean execution has completed.',
    sections: [
      section(
        'options',
        'Trigger options',
        'Choose the task and environment, validate the payload, and authorize with the key required by the endpoint. Record the returned run ID.',
        'Configure supported queue, delay, idempotency and version options deliberately. Use installed SDK types rather than assuming another version has the same options.'
      ),
      section(
        'large-payloads',
        'Large payloads',
        'Upload large files to authorized storage and send references. Check installation input/output limits and avoid logging sensitive payloads.'
      ),
      section(
        'region',
        'Execution region',
        'A region requires a worker and infrastructure there. Self-hosting does not automatically include cloud regions.'
      ),
      section(
        'confirm',
        'Confirm execution',
        'Inspect queued, executing, completed or failed status in Runs. If a run remains queued, check worker presence and concurrency before triggering again.'
      ),
    ],
  },
  {
    paths: ['v3/tasks-scheduled'],
    title: 'Scheduled tasks',
    introduction:
      'Schedules trigger registered tasks on a recurring timetable. They differ from one-time Wait or Delay steps.',
    sections: [
      section(
        'create',
        'Create a schedule',
        'Choose a deployed scheduled task in the selected environment. Enter the cron expression and timezone, review upcoming occurrences, then save.',
        'Confirm the scheduler dispatches an actual run in staging. A saved schedule is not proof that dispatch is healthy.'
      ),
      section(
        'overlap',
        'Control overlap',
        'Use queue concurrency or idempotency when repeated executions modify the same resource.'
      ),
      section(
        'disable',
        'Disable safely',
        'Disable a production schedule before changing its cron or task contract. Existing runs may continue. Live schedule dispatch was not certified in the latest local QA.'
      ),
    ],
  },
  {
    paths: ['wait'],
    title: 'Wait and Delay',
    introduction:
      'Durable waits pause work until a duration, date or supported condition is satisfied. Avoid long busy loops.',
    sections: [
      section(
        'duration',
        'Wait for a duration',
        'Choose an explicit duration and unit within installation limits. Native Wait was exercised through a real worker in local QA.'
      ),
      section(
        'until',
        'Wait until a date',
        'Use a valid timestamp with a known timezone and test past timestamps. Native Wait Until passed locally; that does not certify every third-party Delay action.'
      ),
      section(
        'resume',
        'Follow resumption',
        'Inspect state while waiting and after resumption. Verify the checkpoint and worker configuration supported by your release.'
      ),
    ],
  },
  {
    paths: ['wait-for-token'],
    title: 'Waitpoint tokens',
    introduction:
      'Waitpoint tokens coordinate a task with an external event. Completion references are capabilities, not public identifiers.',
    sections: [
      section(
        'create',
        'Create and wait',
        'Create a token with a timeout through the supported SDK/API and associate it with the intended run. Store completion references securely.'
      ),
      section(
        'complete',
        'Complete the wait',
        'Authorize completion, validate its payload and handle duplicates safely. Inspect the resumed result.'
      ),
      section(
        'timeout',
        'Handle timeouts',
        'Provide escalation or cancellation when no event arrives. This flow needs separate live verification.'
      ),
    ],
  },
  {
    paths: ['errors-retrying'],
    title: 'Errors and retries',
    introduction:
      'A retry creates another attempt. It must not unintentionally repeat an irreversible side effect.',
    sections: [
      section(
        'policy',
        'Set a retry policy',
        'Use bounded attempts and backoff for transient errors. Fail fast for invalid input, authentication failures and unsupported configuration.'
      ),
      section(
        'safe',
        'Protect side effects',
        'Use provider-supported idempotency for payments, messages and record creation. Keep the logical request identity stable across attempts.'
      ),
      section(
        'inspect',
        'Inspect failures',
        'Review the failing step and logs before retrying, replaying or deploying a correction. Failure-path retries were not certified by the latest happy-path QA.'
      ),
    ],
  },
  {
    paths: ['queue-concurrency'],
    title: 'Queues and concurrency',
    introduction:
      'Concurrency limits control how many queued runs can actively execute at once.',
    sections: [
      section(
        'configure',
        'Configure a queue',
        'Set task queue concurrency in the supported task configuration. A shared named queue coordinates tasks competing for the same resource.',
        'Start with one for work that must not overlap. Task-level concurrency remains constrained by environment capacity.'
      ),
      section(
        'waiting',
        'Diagnose queued runs',
        'Check worker presence, environment selection and existing runs occupying slots. Do not repeatedly retrigger queued work.'
      ),
      section(
        'capacity',
        'Plan capacity',
        'Size concurrency against worker resources and provider rate limits. Cloud burst behavior is not a self-hosted capacity guarantee.'
      ),
    ],
  },
  {
    paths: ['idempotency'],
    title: 'Idempotency',
    introduction:
      'An idempotency key identifies the same logical request across repeated submissions.',
    sections: [
      section(
        'key',
        'Choose a stable key',
        'Use a business event ID or operation identity, not a new random value on every retry. Scope keys to avoid collisions across users and operations.'
      ),
      section(
        'ttl',
        'Retention and expiry',
        'Use the runtime-supported retention/TTL. After expiry, another submission may create another run.'
      ),
      section(
        'side-effects',
        'External side effects',
        'Runtime deduplication does not make every provider call exactly-once. Verify outcomes and pass provider idempotency references where supported.'
      ),
    ],
  },
  {
    paths: ['limits'],
    title: 'Installation limits',
    introduction:
      'Limits depend on runtime version, configuration and infrastructure; a cloud pricing table is not the self-hosted contract.',
    sections: [
      section(
        'task-payloads-and-outputs',
        'Task payloads and outputs',
        'Check input/output size limits for your release. Keep payloads bounded and use storage references for large artifacts. Avoid logging secrets.'
      ),
      section(
        'concurrency',
        'Concurrency and API limits',
        'Review queue limits, environment capacity and API request limits together. Accepted work can still wait for capacity.'
      ),
      section(
        'resources',
        'Resource limits',
        'Set suitable memory, CPU and time budgets. Measure representative runs and keep a known-good configuration.'
      ),
    ],
  },
  {
    paths: ['machines'],
    title: 'Execution machines',
    introduction:
      'Machine presets describe task resources. Availability depends on the worker infrastructure.',
    sections: [
      section(
        'machine-configurations',
        'Machine configurations',
        'Choose a supported CPU/memory preset. An unavailable preset requires worker infrastructure configuration; the dashboard does not provision it by itself.'
      ),
      section(
        'measure',
        'Measure before resizing',
        'Review duration and memory failures. Adding CPU rarely fixes external API latency. Test changes in staging.'
      ),
    ],
  },
  {
    paths: ['run-tests'],
    title: 'Testing tasks',
    introduction:
      'Test registered tasks with controlled input. Studio and Source also require a supported worker execution path.',
    sections: [
      section(
        'input',
        'Prepare input',
        'Choose a non-production environment, match the task schema and select restricted test credentials.'
      ),
      section(
        'worker',
        'Connect execution',
        'Keep the development worker running, or confirm a built test deployment matches the saved workflow. First execution may require bundling dependencies.'
      ),
      section(
        'assert',
        'Inspect actual results',
        'Check output and step traces, not just API acceptance. External tests may send messages, incur charges or change records.'
      ),
    ],
  },
  {
    paths: ['runs-and-attempts'],
    title: 'Runs and attempts',
    introduction:
      'A run is one triggered task execution; an attempt is one execution try, including retries.',
    sections: [
      section(
        'status',
        'Read status',
        'Distinguish queued, executing, waiting, completed, failed and canceled states.'
      ),
      section(
        'attempts',
        'Inspect attempts',
        'Compare timestamps, errors and logs. Retain run ID, environment and deployment identity when reporting a failure.'
      ),
      section(
        'replay',
        'Replay carefully',
        'Replay creates work again. Check input, version, credentials and external side effects before replaying production work.'
      ),
    ],
  },
  {
    paths: ['runs/metadata'],
    title: 'Run metadata',
    introduction:
      'Metadata adds small structured progress and business references to a run.',
    sections: [
      section(
        'set',
        'Update metadata',
        'Use your installed SDK metadata API. Keep values bounded, serializable and associated with the correct run.'
      ),
      section(
        'privacy',
        'Keep secrets out',
        'Do not store tokens, credentials or sensitive payloads in metadata visible to operators or subscribers.'
      ),
      section(
        'inspect',
        'Inspect current values',
        'Read metadata in run details or the supported API. Realtime propagation and subscriber permissions need separate verification.'
      ),
    ],
  },
  {
    paths: ['v3/tags'],
    title: 'Run tags',
    introduction:
      'Tags filter related runs without replacing execution identity.',
    sections: [
      section(
        'choose',
        'Choose useful tags',
        'Use bounded business labels and avoid sensitive values or entire request bodies.'
      ),
      section(
        'filter',
        'Filter runs',
        'Add tags through supported trigger options and inspect the matching Runs filter. Tags do not grant permissions.'
      ),
    ],
  },
  {
    paths: ['v3/apikeys'],
    title: 'Environment API keys',
    introduction:
      'Environment keys authorize task operations. Personal access tokens authorize a different account/project management surface.',
    sections: [
      section(
        'create',
        'Select the correct key',
        'Open API keys for the intended project environment. Confirm development, staging or production and the authentication type required by your endpoint.'
      ),
      section(
        'store',
        'Store securely',
        'Keep secret keys server-side. Never include them in browser bundles, public code or screenshots.'
      ),
      section(
        'rotate',
        'Rotate exposed keys',
        'Revoke exposed keys, update affected services and verify both new-key success and old-key rejection.'
      ),
    ],
  },
  {
    paths: ['cli-dev'],
    title: 'Connect development',
    introduction:
      'The development command connects local task code and maintains a worker while you edit.',
    sections: [
      section(
        'start',
        'Start the worker',
        'Use the CLI version pinned by your application release. Authenticate against the self-hosted app URL, select the project and run its documented development command from the task repository.',
        'Keep the process running. Opening Studio does not establish a worker connection.'
      ),
      section(
        'diagnose',
        'Diagnose connection failure',
        'Check application URL, authentication, environment and network reachability. Inspect CLI/server logs for task discovery or version errors.'
      ),
      section(
        'changes',
        'Edit and retest',
        'Wait for reload before testing. Browser Source buffers, Git commits and local task files remain different locations unless explicitly synchronized.'
      ),
    ],
  },
  {
    paths: ['cli-deploy', 'deployment/overview'],
    title: 'Build and deploy',
    introduction:
      'Deployment builds task source into a versioned worker artifact. Repository synchronization alone does not deploy it.',
    sections: [
      section(
        'prepare',
        'Prepare a deployment',
        'Validate and test the intended source version. Confirm dependencies, credentials and exact commit using CLI instructions from the same application release.'
      ),
      section(
        'local-builds',
        'Local builds',
        'Verify the documented container toolchain, registry address, authentication and worker compatibility.',
        'If remote building is unavailable, use the local-build option supported by your installed CLI help; flags can differ between versions.'
      ),
      section(
        'promote',
        'Promote deliberately',
        'Inspect build logs and task discovery. Smoke-test the deployment in staging and keep the previous known-good version for rollback.'
      ),
    ],
  },
  {
    paths: ['deployment/preview-branches'],
    title: 'Preview branches',
    introduction:
      'Previews isolate a proposed change from production and retain commit/environment identity.',
    sections: [
      section(
        'create',
        'Build the proposal head',
        'Build the exact branch/proposal head and verify its deployment commit. Use restricted preview credentials.'
      ),
      section(
        'test',
        'Test the preview',
        'Inspect representative results and traces. A new commit changes the executable version and needs another test.'
      ),
      section(
        'cleanup',
        'Clean up previews',
        'Remove unused infrastructure and tokens after review. Opening a GitHub branch does not automatically create a preview worker.'
      ),
    ],
  },
  {
    paths: ['deployment/dev-branches'],
    title: 'Development branches',
    introduction:
      'Development branches provide isolation only when the installed runtime supports their worker routing.',
    sections: [
      section(
        'isolation',
        'Keep work isolated',
        'Select the intended branch/environment before connecting a worker. Separate test data, credentials and webhook destinations from production.'
      ),
      section(
        'availability',
        'Check support',
        'Verify the feature is enabled. Otherwise use a separate staging project rather than treating a branch label as security isolation.'
      ),
    ],
  },
  {
    paths: ['github-integration'],
    title: 'Connect GitHub',
    introduction:
      'Installing a GitHub App and connecting its repository to a project are separate steps.',
    sections: [
      section(
        'configure',
        'Configure the app',
        'Configure release-required callback and webhook URLs using the reachable application hostname. GitHub cannot deliver webhooks to another machine through your localhost address.',
        'Grant access to the intended repository and keep the private key/client secret in server integration settings.'
      ),
      section(
        'connect',
        'Connect the repository',
        'Select the installation, repository and branch in project integrations. If a repository is missing, check installation access and account identity.'
      ),
      section(
        'sync',
        'Sync is not deploy',
        'Refresh the index and verify the head commit. Saved drafts, pushed source, indexed commits and executable deployments are distinct states.'
      ),
    ],
  },
  {
    paths: ['github-actions'],
    title: 'GitHub Actions deployment',
    introduction:
      'CI can validate, build and deploy tasks with a release-compatible CLI.',
    sections: [
      section(
        'secrets',
        'Prepare CI',
        'Pin Node, package manager and CLI versions. Keep deployment credentials in scoped Actions secrets restricted to trusted branches.'
      ),
      section(
        'pipeline',
        'Run the pipeline',
        'Install with the lockfile, run tests and deploy to the intended environment. Record the commit and deployment ID.'
      ),
      section(
        'trust',
        'Protect untrusted code',
        'Do not expose production tokens to fork pull requests. Review the executable deployment, not only a green CI job.'
      ),
    ],
  },
  {
    paths: ['v3/deploy-environment-variables'],
    title: 'Deployment environment variables',
    introduction:
      'Variables supply runtime configuration. Provider credential connections have a separate lifecycle.',
    sections: [
      section(
        'add',
        'Add a value',
        'Open Environment → Variables for the selected environment. Add the named value and secret protection where needed. Configure staging and production separately.'
      ),
      section(
        'runtime',
        'Verify worker access',
        'Confirm the worker receives the intended configuration according to the release deployment contract. A local .env file does not become a production secret automatically.'
      ),
      section(
        'credentials',
        'Select credential references',
        'Use Environment → Credentials for provider connections and select the compatible connection in a node. Do not copy plaintext credentials into Source.'
      ),
    ],
  },
  {
    paths: ['bulk-actions', 'management/tasks/batch-trigger'],
    title: 'Batches and bulk operations',
    introduction:
      'Batch triggering creates multiple runs; bulk operations act on an existing run selection.',
    sections: [
      section(
        'batch',
        'Trigger a bounded batch',
        'Validate inputs, use the installed SDK/API batch operation and account for provider rate limits. Record individual run IDs for partial failures.'
      ),
      section(
        'bulk',
        'Review selections',
        'Check filters, environment and operation before canceling or replaying many runs. Bulk replay may repeat external effects.'
      ),
      section(
        'failures',
        'Handle partial failures',
        'Distinguish request rejection from later task failure. Retry failed logical operations with appropriate idempotency.'
      ),
    ],
  },
  {
    paths: ['troubleshooting-alerts', 'v3/troubleshooting-alerts'],
    title: 'Troubleshooting alerts',
    introduction:
      'Alerts notify operators; they do not resolve the failed task.',
    sections: [
      section(
        'configure',
        'Configure notifications',
        'Choose the environment/event and a supported destination. Confirm delivery with a disposable test before depending on it.'
      ),
      section(
        'delivery',
        'Diagnose missing alerts',
        'Check destination authentication, permissions and notification worker logs. A development email log is not proof of inbox delivery.'
      ),
      section(
        'response',
        'Respond to failure',
        'Inspect the linked run and deployment. Decide whether to retry, disable a schedule or roll back a release.'
      ),
    ],
  },
  {
    paths: ['migrating-from-v3', 'upgrade-to-v4'],
    title: 'Runtime migration',
    introduction:
      'Upgrade the application, worker, CLI and task SDK as one compatible system.',
    sections: [
      section(
        'prepare',
        'Prepare an upgrade',
        'Read exact-version release notes and migrations. Back up persistent data and record current app, worker and task versions.'
      ),
      section(
        'stage',
        'Test in staging',
        'Apply documented schema migrations and rebuild with matching CLI/SDK versions. Verify task discovery, waits, credentials and failure handling.'
      ),
      section(
        'rollback',
        'Plan recovery',
        'Confirm recovery before upgrading. Running an older image may not reverse database changes. A renamed version number does not complete migration.'
      ),
    ],
  },
  {
    paths: ['management/overview'],
    title: 'Management API',
    introduction:
      'Management endpoints expose authorized project and account operations.',
    sections: [
      section(
        'personal-access-token-pat',
        'Personal access token (PAT)',
        'Create a PAT in account settings and send it as a Bearer token from a trusted client. PATs and environment keys authorize different surfaces.',
        'Use scoped, revocable tokens. Local QA checked management reads and rejected invalid authentication.'
      ),
      section(
        'errors',
        'Handle errors',
        'Inspect HTTP status and retain request identity. Resolve 409 conflicts by loading current state rather than overwriting blindly.'
      ),
    ],
  },
  {
    paths: ['frontend/overview'],
    title: 'Frontend and realtime access',
    introduction:
      'Frontends may show supported run state without receiving server secret keys.',
    sections: [
      section(
        'authentication',
        'Authentication',
        'Issue scoped/public access tokens from a trusted server with limited resource access and lifetime.',
        'Renew expired tokens through that server, not by replacing them with an environment secret in the browser.'
      ),
      section(
        'subscription',
        'Subscribe safely',
        'Confirm the realtime service is reachable. Handle disconnects and stale state. A successful management request does not prove a realtime subscription works.'
      ),
    ],
  },
  {
    paths: ['v3/agents', 'ai-chat/overview'],
    title: 'Agents and chat',
    introduction:
      'Agent and chat surfaces require configured model providers and controlled tool access.',
    sections: [
      section(
        'connect',
        'Connect a provider',
        'Configure an authorized provider connection and verify permissions and budget before sending model requests. Keep API keys server-side.'
      ),
      section(
        'tools',
        'Constrain tools',
        'Grant only necessary tools/resources. Control actions that send messages, change records or incur charges.'
      ),
      section(
        'availability',
        'Check availability',
        'An Agents page does not prove provider configuration. Real model execution was not certified in local QA.'
      ),
    ],
  },
  {
    paths: ['ai-chat/sessions'],
    title: 'Chat sessions',
    introduction:
      'Sessions group conversation turns and their associated work.',
    sections: [
      section(
        'inspect',
        'Inspect a session',
        'Open the project/environment session and review its messages and linked runs. Session identity differs from individual run identity.'
      ),
      section(
        'privacy',
        'Control access',
        'Treat messages as sensitive. Review permissions, retention and exported logs before using customer content.'
      ),
    ],
  },
  {
    paths: ['ai/prompts', 'prompt-management'],
    title: 'Prompt management',
    introduction:
      'Managed prompts make reusable instructions and versions explicit.',
    sections: [
      section(
        'create',
        'Create and version',
        'Name the prompt, define variables and save the intended version with non-sensitive test inputs.'
      ),
      section(
        'test',
        'Test against a provider',
        'Choose a configured model, check substitution and inspect output/cost. Editing text alone does not connect a provider.'
      ),
      section(
        'promote',
        'Promote deliberately',
        'Associate prompt version with the workflow/release and compare representative results before changing production behavior.'
      ),
    ],
  },
  {
    paths: [
      'private-networking/overview',
      'private-networking/aws-console-setup',
    ],
    title: 'Private networking',
    introduction:
      'Private connections require infrastructure and worker routing; this feature was unavailable in the tested local setup.',
    availability:
      'Infrastructure-dependent; not verified as a self-hosted beta feature.',
    sections: [
      section(
        'plan',
        'Plan connectivity',
        'Identify network, region, DNS, security groups and ports. Apply least privilege rather than exposing internal services broadly.'
      ),
      section(
        'aws',
        'AWS setup boundary',
        'Use release/provider-specific endpoint instructions and validate connectivity from the worker.',
        'A dashboard form is not proof that an AWS endpoint exists. Self-hosted routing may require a different supported mechanism.'
      ),
      section(
        'verify',
        'Verify actual access',
        'Test from the execution worker, not only the webapp host. Sanitize logs and remove temporary infrastructure after testing.'
      ),
    ],
  },
  {
    paths: ['vercel-integration'],
    title: 'Vercel integration',
    introduction:
      'A deployment provider may coordinate app/task releases when configured and supported.',
    availability: 'Provider-specific; not certified in the local beta QA.',
    sections: [
      section(
        'connect',
        'Connect projects',
        'Configure release-required OAuth/callback settings and GitHub access. Select the provider project and map environments deliberately.'
      ),
      section(
        'atomic-deployments',
        'Atomic deployments',
        'Verify app and task deployment compatibility before promotion. A green application build does not prove its task release is ready.'
      ),
      section(
        'supabase-and-neon-database-branching',
        'Database branching',
        'Configure preview database providers separately. Verify connection strings, permissions and cleanup; never accidentally use production for previews.'
      ),
    ],
  },
  {
    paths: ['how-to-reduce-your-spend'],
    title: 'Reduce execution overhead',
    introduction:
      'Self-hosted cost includes infrastructure and external providers, not only task duration.',
    sections: [
      section(
        'measure',
        'Measure first',
        'Inspect duration, utilization, queue waits, storage growth and provider charges before tuning.'
      ),
      section(
        'optimize',
        'Avoid unnecessary work',
        'Use bounded retries, suitable machines, appropriate concurrency and small payloads. Cache safe repeated work and limit unnecessary polling.'
      ),
      section(
        'cleanup',
        'Clean up unused resources',
        'Remove unused previews/artifacts under your retention policy while preserving necessary backups and audit records.'
      ),
    ],
  },
];
export const APP_DOC_PATHS = APP_DOC_GUIDES.flatMap((guide) => guide.paths);
export function findAppDocGuide(path: string) {
  return APP_DOC_GUIDES.find((guide) => guide.paths.includes(path));
}
