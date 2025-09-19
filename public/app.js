function App() {
  const [songs, setSongs] = React.useState([]);

  React.useEffect(() => {
    const apiUrl = "https://kara-api.vercel.app/api/songs";

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setSongs(data); // [["曲名1", 3], ["曲名2", 2], ...]
      })
      .catch((err) => {
        console.error("APIエラー:", err);
      });
  }, []);

  return (
    <div className="ranking">
      <h2>ランキング</h2>
      {songs.length === 0 ? (
        <p>データを読み込み中...</p>
      ) : (
        <ol>
          {songs.map(([song, count], index) => (
            <li key={index}>
              {song} ×{count}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ReactDOMで描画
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
