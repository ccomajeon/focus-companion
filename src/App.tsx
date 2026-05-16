import { useEffect, useState } from 'react';
import Launcher from './views/Launcher';
import Widget from './views/Widget';
import Done from './views/Done';

type Route = 'launcher' | 'widget' | 'done';

function readRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (hash === 'widget') return 'widget';
  if (hash === 'done') return 'done';
  return 'launcher';
}

export default function App() {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route === 'widget') return <Widget onComplete={() => setRoute('done')} />;
  if (route === 'done') return <Done />;
  return <Launcher />;
}
