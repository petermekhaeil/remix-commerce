import { redirect } from '@remix-run/cloudflare';

export const loader = async () => {
  return redirect('/search');
};

const App = () => {
  return <></>;
};

export default App;
