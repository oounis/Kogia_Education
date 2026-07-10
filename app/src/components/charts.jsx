import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts'
import { axis, grid, tooltip, GRID, MUTED, BAR_RADIUS, BAR_RADIUS_H, BAR_SIZE } from '../charts.js'

// Briques de graphiques partagées : mêmes axes discrets, même grille pâle, même
// infobulle douce partout. Un seul endroit à changer pour toute l'application.

// Enveloppe : titre lisible, hauteur fixe, et un rendu propre quand il n'y a rien.
export function ChartFrame({ height = 200, children }) {
  return <div style={{ height }}><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
}

// Aire : une seule série, dégradé très léger, ligne fine. Pas de légende (le titre nomme la série).
export function SoftArea({ data, dataKey, color, id, unit = '', domain, height = 200, xKey = 'name' }) {
  return (
    <ChartFrame height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} interval="preserveStartEnd" />
        {/* width suffisante : « 100 » et « 100% » étaient rognés en « 00 » */}
        <YAxis {...axis} domain={domain} unit={unit} width={unit ? 50 : 42} />
        <Tooltip {...tooltip} formatter={v => [`${v}${unit}`, '']} />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#${id})`}
          dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }} />
      </AreaChart>
    </ChartFrame>
  )
}

// Barres verticales. `colors` suit l'entité (index de la donnée), jamais son rang.
export function SoftBars({ data, dataKey = 'value', xKey = 'name', colors, color, height = 200, unit = '', showValues = false }) {
  return (
    <ChartFrame height={height}>
      <BarChart data={data} margin={{ top: 14, right: 8, left: -6, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} width={42} allowDecimals={false} />
        <Tooltip {...tooltip} formatter={v => [`${v}${unit}`, '']} />
        <Bar dataKey={dataKey} radius={BAR_RADIUS} maxBarSize={BAR_SIZE}>
          {showValues && <LabelList dataKey={dataKey} position="top" style={{ fontSize: 11, fill: MUTED, fontWeight: 700 }} />}
          {data.map((d, i) => <Cell key={d[xKey] ?? i} fill={d.color || colors?.[i] || color} />)}
        </Bar>
      </BarChart>
    </ChartFrame>
  )
}

// Barres horizontales : idéal quand les libellés sont des mots (niveaux, matières).
export function SoftBarsH({ data, dataKey = 'value', yKey = 'name', width = 84, height = 200, color }) {
  return (
    <ChartFrame height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 2, right: 26, left: 4, bottom: 2 }} barCategoryGap="26%">
        <CartesianGrid {...grid} horizontal={false} vertical />
        <XAxis type="number" hide />
        <YAxis type="category" dataKey={yKey} {...axis} width={width} />
        <Tooltip {...tooltip} cursor={{ fill: 'rgba(91,110,225,.05)' }} />
        <Bar dataKey={dataKey} radius={BAR_RADIUS_H} maxBarSize={BAR_SIZE}>
          <LabelList dataKey={dataKey} position="right" style={{ fontSize: 11, fill: MUTED, fontWeight: 700 }} />
          {data.map((d, i) => <Cell key={d[yKey] ?? i} fill={d.color || color} />)}
        </Bar>
      </BarChart>
    </ChartFrame>
  )
}

// Une jauge lisible sans arc : anneau fin + nombre au centre. Plus reposant qu'un camembert.
export function Gauge({ value, max = 100, color, label, size = 132, thickness = 9 }) {
  const pct = max ? Math.max(0, Math.min(1, value / max)) : 0
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GRID} strokeWidth={thickness} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={thickness}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-extrabold leading-none tabular-nums">{Math.round(pct * 100)}%</div>
        {label && <div className="text-[12px] text-muted mt-1">{label}</div>}
      </div>
    </div>
  )
}

// Répartition en une barre empilée fine + légende à puces. Remplace avantageusement
// un camembert : on compare des longueurs, pas des angles.
export function DistributionBar({ items, total }) {
  const sum = total ?? items.reduce((s, i) => s + i.value, 0)
  if (!sum) return null
  return (
    <div>
      <div className="flex h-2.5 rounded-full overflow-hidden gap-[2px] bg-canvas">
        {items.filter(i => i.value > 0).map(i => (
          <div key={i.name} style={{ width: `${(i.value / sum) * 100}%`, background: i.color }} title={`${i.name} : ${i.value}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {items.map(i => (
          <span key={i.name} className="inline-flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: i.color }} />
            <span className="text-muted">{i.name}</span>
            <b className="tabular-nums">{i.value}</b>
          </span>
        ))}
      </div>
    </div>
  )
}
