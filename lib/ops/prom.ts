type Num = number;
type MaybeNum = number | null | undefined;

export type AggConfig = {
  promURL: string;
  jobApp: string;
  jobNode: string;
  containerMatch?: string;
  demo?: boolean;
};

export type Snapshot = {
  ts: number;
  uptimePct: Num;
  latencyP95Ms: Num;
  errorRatePct: Num;
  sessions: Num;
  cpuP50: Num;
  cpuP95: Num;
  memUsedPct: Num;
};

async function qSingle(promURL: string, query: string): Promise<MaybeNum> {
  const url = promURL.replace(/\/$/, '') + '/api/v1/query?query=' + encodeURIComponent(query);
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error('Prometheus query failed: ' + r.statusText);
  const j = await r.json();
  const v = j?.data?.result?.[0]?.value?.[1];
  const n = typeof v === 'string' ? parseFloat(v) : (typeof v === 'number' ? v : NaN);
  return Number.isFinite(n) ? n : null;
}

function coalesce(...vals: MaybeNum[]): Num {
  for (const v of vals) if (v !== null && v !== undefined && !Number.isNaN(v)) return v as number;
  return 0;
}

export async function readOnce(cfg: AggConfig): Promise<Snapshot> {
  if (cfg.demo || !cfg.promURL) {
    const now = Date.now();
    const s = Math.sin(now/20000);
    const e = Math.max(0, 0.06 + 0.02*Math.sin(now/11000));
    return {
      ts: now,
      uptimePct: 99.98,
      latencyP95Ms: 350 + 60*s,
      errorRatePct: e*100,
      sessions: 42 + Math.round(8*(0.5+Math.sin(now/30000))),
      cpuP50: 0.22 + 0.1*max0(s),
      cpuP95: 0.35 + 0.12*max0(s),
      memUsedPct: 0.48 + 0.08*max0(Math.sin(now/17000))
    };
  }

  const { promURL, jobApp, jobNode, containerMatch } = cfg;

  const qUptime = `avg_over_time(up{job="${jobApp}"}[90d]) * 100`;
  const qP95 = `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="${jobApp}"}[5m])) by (le)) * 1000`;
  const qErr = `sum(rate(http_requests_total{job="${jobApp}",status=~"5.."}[1m])) / sum(rate(http_requests_total{job="${jobApp}"}[1m])) * 100`;
  const qSess1 = `max(sessions_active)`;
  const qSess2 = `max(aki_sessions_active)`;

  const qCpuCAdvisor = containerMatch
    ? `sum(irate(container_cpu_usage_seconds_total{name=~".*${containerMatch}.*"}[1m]))`
    : `NaN`;
  const qCpuNode = `1 - avg(rate(node_cpu_seconds_total{job="${jobNode}",mode="idle"}[1m]))`;
  const qMem = `1 - (node_memory_MemAvailable_bytes{job="${jobNode}"} / node_memory_MemTotal_bytes{job="${jobNode}"})`;

  const [uptimePct, latencyP95Ms, errorRatePct, sessionsA, sessionsB, cpuC, cpuN, memUsedPct] = await Promise.all([
    qSingle(promURL, qUptime),
    qSingle(promURL, qP95),
    qSingle(promURL, qErr),
    qSingle(promURL, qSess1),
    qSingle(promURL, qSess2),
    qSingle(promURL, qCpuCAdvisor),
    qSingle(promURL, qCpuNode),
    qSingle(promURL, qMem),
  ]);

  const cpu = (cpuC ?? null) !== null ? (cpuC as number) : (cpuN ?? 0);
  const cpuP50 = clamp01(cpu);
  const cpuP95 = clamp01(cpu * 1.4);

  const sessions = coalesce(sessionsA, sessionsB, 0);

  return {
    ts: Date.now(),
    uptimePct: coalesce(uptimePct, 0),
    latencyP95Ms: coalesce(latencyP95Ms, 0),
    errorRatePct: coalesce(errorRatePct, 0),
    sessions,
    cpuP50,
    cpuP95,
    memUsedPct: coalesce(memUsedPct, 0),
  };
}

function clamp01(n: number){ return Math.max(0, Math.min(1, n)); }
function max0(n: number){ return Math.max(0, n); }
