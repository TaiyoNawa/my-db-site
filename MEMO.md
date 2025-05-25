** MEMO
*** やること‼️
- 音量調整(react-bitsのElastic Slider)
- 各ページのホームでアイテムをカードで一覧表示
- Homeページ(https://alkyne.net/
- (記事フィルター機能)

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

*** 記事ページ
    ・fetchNotionDBItems を全件取得せず、Notionの「filter」機能などを活用して url === id の　アイテムだけ取得する→→PI（軽量化）を lib/notion に作るとより効率的です。
・NotionDBの画像表示が遅い件
    ・Next/Image化(Markdown部分のみまだ出来てない)
    ・cdnとしてtoolpodを利用
・SafariとかだとSecondHeaderが見えない可能性(前田)
・APIのtest作成
・サムネ画像を動画に対応させる
・共有ボタン
・目次の各項目はidで付与しない方が良い(backボタンで何度も戻る羽目になる)

*** Meta情報!大事!
    Galleryページの漫画とMusicはまだメタ設定してないが、サイトの構成が決まっていないので、それが決まり次第GalleryMetaを使って更新。

*** Gameページ
- neko-punch
    - ランキング作成
    - PlayPageのクリック時のテスト

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

