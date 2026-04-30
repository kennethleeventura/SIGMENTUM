// Tweaks — wires up the Tweak panel with Sigmentum controls.
function SigmentumTweaks({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Accent balance"/>
      <TweakSlider label="Orange ↔ Green" value={t.accentBalance}
        min={0} max={100} unit=""
        onChange={(v) => setTweak('accentBalance', v)}/>

      <TweakSection label="Surface"/>
      <TweakRadio label="Mode" value={t.surface}
        options={['paper','ivory','graphite']}
        onChange={(v) => setTweak('surface', v)}/>

      <TweakSection label="Glass"/>
      <TweakSlider label="Blur" value={t.glassIntensity} min={0} max={100} unit="%"
        onChange={(v) => setTweak('glassIntensity', v)}/>

      <TweakSection label="Motion"/>
      <TweakSlider label="Entry + scroll" value={t.motionLevel} min={0} max={100} unit="%"
        onChange={(v) => setTweak('motionLevel', v)}/>

      <TweakSection label="Density"/>
      <TweakRadio label="Layout" value={t.density}
        options={['compact','balanced','spacious']}
        onChange={(v) => setTweak('density', v)}/>
    </TweaksPanel>
  );
}

// Apply tweaks to CSS vars + body class
function applyTweaks(t) {
  const r = document.documentElement.style;

  // Surface
  const surfaces = {
    paper:    { paper: '#f5f5f2', paper2: '#ebebe6', paper3: '#dedcd4', ink: '#0b0d12', ink3: '#4a505e', ink4: '#8a8f9c', ink5: '#b8bcc6', line: 'rgba(11,13,18,0.08)', lineStrong: 'rgba(11,13,18,0.14)', glassBg: 'rgba(255,255,255,0.55)', glassBgStrong: 'rgba(255,255,255,0.75)', glassBorder: 'rgba(255,255,255,0.85)', glassStroke: 'rgba(11,13,18,0.06)' },
    ivory:    { paper: '#fbf8f0', paper2: '#f2ecde', paper3: '#e5ddc8', ink: '#1c1a12', ink3: '#55503f', ink4: '#8a8574', ink5: '#c0bba7', line: 'rgba(28,26,18,0.08)', lineStrong: 'rgba(28,26,18,0.14)', glassBg: 'rgba(255,253,246,0.6)', glassBgStrong: 'rgba(255,253,246,0.8)', glassBorder: 'rgba(255,253,246,0.85)', glassStroke: 'rgba(28,26,18,0.06)' },
    graphite: {
      paper: '#0a0d14', paper2: '#101521', paper3: '#161c2c',
      ink: '#f0f2f7', ink3: '#d0d4de', ink4: '#a8adb8', ink5: '#6a7080',
      line: 'rgba(255,255,255,0.08)', lineStrong: 'rgba(255,255,255,0.16)',
      glassBg: 'rgba(22,28,44,0.55)', glassBgStrong: 'rgba(22,28,44,0.8)',
      glassBorder: 'rgba(11,93,238,0.2)', glassStroke: 'rgba(11,93,238,0.18)',
    },
  };
  const s = surfaces[t.surface] || surfaces.paper;
  Object.entries({
    '--paper': s.paper, '--paper-2': s.paper2, '--paper-3': s.paper3,
    '--ink': s.ink, '--ink-3': s.ink3, '--ink-4': s.ink4, '--ink-5': s.ink5,
    '--line': s.line, '--line-strong': s.lineStrong,
    '--glass-bg': s.glassBg, '--glass-bg-strong': s.glassBgStrong,
    '--glass-border': s.glassBorder, '--glass-stroke': s.glassStroke,
  }).forEach(([k, v]) => r.setProperty(k, v));

  // Dark-mode body class for scoped overrides
  document.body.classList.toggle('is-dark', t.surface === 'graphite');

  // Blue accent — from logo, used only in dark mode for soft highlights
  r.setProperty('--blue-glow', t.surface === 'graphite' ? 'rgba(11,93,238,0.14)' : 'rgba(11,93,238,0.08)');
  r.setProperty('--inner-card', t.surface === 'graphite' ? 'rgba(11,93,238,0.06)' : 'rgba(255,255,255,0.55)');
  r.setProperty('--inner-card-strong', t.surface === 'graphite' ? 'rgba(11,93,238,0.10)' : 'rgba(255,255,255,0.7)');

  // Glass intensity → blur radius
  const blur = 8 + (t.glassIntensity / 100) * 28;
  r.setProperty('--glass-blur', `${blur}px`);

  // Motion
  document.body.classList.toggle('no-motion', t.motionLevel < 10);

  // Density
  const densityScale = { compact: 0.85, balanced: 1, spacious: 1.15 };
  r.setProperty('--density', densityScale[t.density] || 1);
}

Object.assign(window, { SigmentumTweaks, applyTweaks });
