import "./App.css";
import Title from "antd/es/typography/Title";
import Link from "antd/es/typography/Link";

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        width: "100vw",
        height: "80vh",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Title level={2}>
        We are migrated to new website with better UI and lots of cool features
      </Title>
      <Title level={2}>Have a look!!! Its still in progress...</Title>
      <Link
        href="https://trackmyprice.in/"
        id="latestdeals"
        style={{
          marginTop: "12px",
          fontSize: "22px",
        }}
      >
        https://trackmyprice.in/
      </Link>
    </div>
  );
}

export default App;
