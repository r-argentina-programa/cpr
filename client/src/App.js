import Routes from "./routes";
import Providers from "./hooks";
function App() {
  return (
    <Providers>
      <Routes />
    </Providers>
  );
}

export default App;
