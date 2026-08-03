import { useEffect } from 'react';
import { ScrollProgress } from './primitives';
import { Nav, Ticker, Hero } from './sections-a';
import { SignalFeed, AIReasoning, ActiveTrade } from './sections-b';
import { RiskDashboard, Pipeline, Performance, Telegram, Learn, Footer } from './sections-c';
import { PopupNotifier } from './live';
import { useTweaks } from './tweaks-panel';
import { SigmentumTweaks, applyTweaks } from './tweaks';

const TWEAKS = {
  accentBalance: 98,
  glassIntensity: 100,
  motionLevel: 100,
  density: 'spacious',
  surface: 'graphite',
};

export default function App() {
  const [t, setTweak] = useTweaks(TWEAKS);

  useEffect(() => {
    applyTweaks(t);
  }, [t]);

  return (
    <>
      <ScrollProgress/>
      <Nav/>
      <Hero/>
      <Ticker/>
      <SignalFeed/>
      <ActiveTrade/>
      <AIReasoning/>
      <RiskDashboard/>
      <Pipeline/>
      <Performance/>
      <Telegram/>
      <Learn/>
      <Footer/>
      <PopupNotifier/>
      <SigmentumTweaks t={t} setTweak={setTweak}/>
    </>
  );
}
