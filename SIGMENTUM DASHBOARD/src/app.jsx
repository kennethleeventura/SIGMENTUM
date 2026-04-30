// App — root component
const { useState: useStateApp, useEffect: useEffApp } = React;

function App() {
  const [t, setTweak] = useTweaks(TWEAKS);

  useEffApp(() => {
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

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
