function App() {
  const [artists, setArtists] = React.useState({});
  // 最初はローディング状態ではないのでfalseに設定
  const [loading, setLoading] = React.useState(false); 
  const [error, setError] = React.useState(null);

  // API通信がうまくいかないため、代わりにこのサンプルデータを使います。
  // APIが返すデータと同じ [アーティスト名, 曲名, 回数] の形式です。
  // const sampleApiData = [
  //   ["YOASOBI", "アイドル", 7],
  //   ["Vaundy", "怪獣の花唄", 6],
  //   ["Ado", "新時代", 5],
  //   ["Official髭男dism", "Subtitle", 4],
  //   ["Ado", "私は最強", 3],
  //   ["YOASOBI", "夜に駆ける", 3],
  //   ["Official髭男dism", "Pretender", 2],
  //   ["米津玄師", "Lemon", 1],
  //   ["サカナクション", "新宝島", 1],
  //   ["one ok rock", "完全感覚Dreamer", 1],
  // ];

  React.useEffect(() => {
    // この関数は、APIから受け取ったデータを処理するためのものです
    const processData = (data) => {
      try {
        const artistData = data.reduce((acc, item) => {
          const [artist, song, count] = item;
          const numCount = Number(count);

          if (artist && song && !isNaN(numCount)) {
            if (!acc[artist]) {
              acc[artist] = { totalCount: 0, songs: [] };
            }
            acc[artist].totalCount += numCount;
            acc[artist].songs.push([song, numCount]);
          }
          return acc;
        }, {});
        setArtists(artistData);
      } catch (e) {
        console.error("データの処理中にエラーが発生しました:", e);
        setError("データの形式が正しくありません。");
      }
    };

    // API通信の代わりに、用意したサンプルデータを処理します。
    //processData(sampleApiData);

    // 本来のAPI通信コード（現在はサーバー側の問題で動作しないためコメントアウト）
    
    const apiUrl = "https://kara-api.vercel.app/api/songs";
    setLoading(true);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => processData(data))
      .catch(err => {
        console.error("APIエラー:", err);
        setError("ランキングの読み込みに失敗しました。");
      })
      .finally(() => setLoading(false));
    
  }, []); // 最初の一回だけ実行

  // アーティストごとのコンポーネント
  function Artist({ name, totalCount, songs }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);
    const sortedSongs = songs.sort((a, b) => b[1] - a[1]);

    return (
      <div className="artist-item">
        <div className="artist-header" onClick={toggleOpen}>
          <span>{name}</span>
          <span>計{totalCount}回</span>
        </div>
        {isOpen && (
          <ol className="song-list">
            {sortedSongs.map(([song, count], index) => (
              <li key={index}>{song} ×{count}</li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  const sortedArtists = Object.entries(artists).sort(([, a], [, b]) => b.totalCount - a.totalCount);
  
  if (loading) return <div className="ranking"><h2>ランキング</h2><p>データを読み込み中...</p></div>;
  if (error) return <div className="ranking"><h2>ランキング</h2><p>{error}</p></div>;

  return (
    <div className="ranking">
      <h2>ランキング</h2>
      {sortedArtists.map(([name, data]) => (
        <Artist key={name} name={name} totalCount={data.totalCount} songs={data.songs} />
      ))}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);