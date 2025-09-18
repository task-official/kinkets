function App() {
  const [songs, setSongs] = React.useState([]);

  React.useEffect(() => {
    const spreadsheetId = "17meNocmInqv0vbbj6PeCUnsgvSSGqgoZpv0QpCQBG_I";
    const range = "Sheet1!B2:K1000"; // A列除外、B〜K列
    const apiKey = "AIzaSyAkW3L5MdWE9MVxezump6aE-OPblpVmcds"; // APIキー

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.values) {
          // 2次元配列を1次元にして、空セル除外＋重複除外
          const allSongs = data.values.flat().filter(s => s);
          setSongs([...new Set(allSongs)]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="ranking">
      <h2>ランキング</h2>
      {songs.length === 0 ? (
        <p>データを読み込み中...</p>
      ) : (
        <ol>
          {songs.map((song, index) => (
            <li key={index}>{song}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
