** MEMO
*** 優先順位
- 記事作成+NotionDB接続

*** 検索ページ
・Music, Manga, Anime, Imageとかを全てごちゃ混ぜで検索できる
・検索項目を指定できる

*** Musicページ
・アルバム検索
・スケルトン
・ページバック時の値保持
・Artist検索時の各アーティストのurl(imageUrlではない)を使うのではなく、自作のアーティスト紹介ページのURLに繋げるとかもあり。
・このページ自体は検索機能ページの一つとして追加する
・各アーティストの紹介記事などは手作りで、別のページで実装
    ・ここでSpotifyPlayerを使うのはアリ
    ・イベント情報一覧ページに繋げられたら理想
・音量調整(react-bitsのElastic Slider)

*** 記事ページ
・とりあえず記事詳細を作る＋NotionDBとの連携をする
やること
・まあとりあえずChatGPT頼りにならず、取得されるデータをconsoleで見ながら、どんなパラメータを描画すれば良いかを見ていこうよ
・理想はNotionで完結させる。Notionの画像読み込みを早くさせる。
・NotionAPIでDBを作成→配信させる
・NotionDBの画像表示が遅い件
ImageWithSkeletonのsrcが正しく表示されるように修正
index.tsxなどのfetch時に重複して表示されるのを防ぐ
公開済みフィルター
・NextImageはISR機能が素晴らしいから、これにしよう
    Next/Image化(Markdown部分)
    つまり、fetchの最適化+ISRの初回ロード時に確実に画像を読み込めるような設計に
・cdnとして、toolpodを利用してもいいかも
    その場合Next/imageにする必要がある。
    https://qiita.com/kentawata/items/9693024c6dcef7dd2b6f
    cdn=https://toolpods.io/image-cdn
    https://imgur.com/user/whakamater/posts
    詳細ページ取得の高速化
・SafariとかだとSecondHeaderが見えない可能性(前田)
・投稿済み以外は表示しない
・APIのtest作成
・サムネ画像を動画に対応させる
・共有ボタン
・インデックスはidで付与しない方が良い(backボタンで何度も戻る羽目になる)


*** リンクページ
・とりあえず記事詳細を作る＋NotionDBとの連携をする

*** 画像ギャラリーページ
・APIで検索して好きな画像が表示される↓参考
・https://unsplash.com/developers
・https://pixabay.com/
・API自体は検索機能ページの一つとして追加する
・世界遺産一覧ページなどは自分で作成する
やること
    なし

*** イベント一覧ページ(カレンダーページ)
・主要イベント会場のイベント情報カレンダーなど？
・日付から何の日かを取得するAPI

*** ミニゲーム集ページ
- マインスイーパー
- 反射神経


*** 漫画ページ
- 検索は商用$150/月まで可能らしいから、大丈夫そう？
- 各漫画の紹介記事などは手作りで、別のページで実装
    画像はAmazonの使えるようになるまでは著作権グレーで
**** やりたいこと
- キャラクター検索
- 著者から検索
- 出版社情報とかの日本語取得↓(検索はできなそう)
- https://openbd.jp/
- https://zenn.dev/hk03ne/scraps/c3a8db662c4843
- 📘 主な取得可能フィールド一覧
https://anilist.gitbook.io/anilist-apiv2-docs/docs/reference/object/media
以下は、Mediaオブジェクトで取得可能な主なフィールドの一部です：​
id：AniList上の作品ID、など

