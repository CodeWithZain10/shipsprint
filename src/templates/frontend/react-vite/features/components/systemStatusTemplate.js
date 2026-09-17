const reactSystemStatusTemplate = () => {
return `import { useEffect, useState } from 'react';
import { getHealth, getApiInfo } from '../services/system';

const STATUS_STYLES = {
  ok: { dot: 'bg-green-500', label: 'API online' },
  degraded: { dot: 'bg-amber-500', label: 'API degraded' },
  offline: { dot: 'bg-red-500', label: 'API unreachable' },
  loading: { dot: 'bg-gray-400 animate-pulse', label: 'Checking API...' },
};

function SystemStatus() {
  const [health, setHealth] = useState(null);
  const [info, setInfo] = useState(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getHealth(), getApiInfo()])
      .then(([healthData, infoData]) => {
        if (cancelled) return;
        setHealth(healthData);
        setInfo(infoData);
      })
      .catch(() => {
        if (!cancelled) setOffline(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const state = offline ? 'offline' : health ? health.status : 'loading';
  const style = STATUS_STYLES[state] || STATUS_STYLES.degraded;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-sm" data-testid="system-status">
      <div className="flex items-center gap-2">
        <span className={\`inline-block w-2.5 h-2.5 rounded-full \${style.dot}\`} />
        <span className="font-medium text-gray-800">{style.label}</span>
        {info && <span className="ml-auto text-gray-500">{info.name} v{info.version}</span>}
      </div>

      {health && (
        <p className="mt-2 text-gray-600">
          Database: <span className="font-medium">{health.database}</span> · Uptime: {health.uptime}s
          {info && <> · Env: {info.environment}</>}
        </p>
      )}

      {info?.endpoints?.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-blue-600">{info.endpoints.length} endpoints</summary>
          <ul className="mt-2 space-y-1 font-mono text-xs text-gray-700">
            {info.endpoints.map((endpoint) => (
              <li key={\`\${endpoint.method} \${endpoint.path}\`}>
                <span className="inline-block w-12 font-semibold">{endpoint.method}</span>
                {endpoint.path}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export default SystemStatus;
`
}

export default reactSystemStatusTemplate
