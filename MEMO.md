** MEMO
*** 優先順位
- 記事作成+NotionDB接続
- 画像検索ページ


*** Musicページ
・アルバム検索
・スケルトン
・ページバック時の値保持
・Artist検索時の各アーティストのurl(imageUrlではない)を使うのではなく、自作のアーティスト紹介ページのURLに繋げるとかもあり。
・このページ自体は検索機能ページの一つとして追加する
・各アーティストの紹介記事などは手作りで、別のページで実装
    ・ここでSpotifyPlayerを使うのはアリ
    ・イベント情報一覧ページに繋げられたら理想
・音量調整

*** 記事ページ
・とりあえず記事詳細を作る＋NotionDBとの連携をする

*** リンクページ
・とりあえず記事詳細を作る＋NotionDBとの連携をする

*** 画像ギャラリーページ
・APIで検索して好きな画像が表示される↓参考
・https://unsplash.com/developers
・https://pixabay.com/
・API自体は検索機能ページの一つとして追加する
・世界遺産一覧ページなどは自分で作成する
・react-masonry-css✖️スケルトンでpinterest形式
やること
・さらに読み込むボタンを押しても同じ画像が読み込まれる(API制限的にさらに読み込むボタンいらないかも)
・データがない時のさらに読み込むボタンの消去
・リンクのHover時のアンダーライン

*** イベント一覧ページ(カレンダーページ)
・主要イベント会場のイベント情報カレンダーなど？
・日付から何の日かを取得するAPI


*** 漫画ページ
・AniList API使ってみる
・API自体は検索機能ページの一つとして追加する
    検索は商用$150まで可能らしいから、大丈夫そう？
・各漫画の紹介記事などは手作りで、別のページで実装
    画像はAmazonの使えるようになるまでは著作権グレーで
-やりたいこと
・キャラクター検索
・著者から検索
・出版社情報とかの日本語取得↓(検索はできなそう)
https://openbd.jp/
https://zenn.dev/hk03ne/scraps/c3a8db662c4843

📘 主な取得可能フィールド一覧
https://anilist.gitbook.io/anilist-apiv2-docs/docs/reference/object/media
以下は、Mediaオブジェクトで取得可能な主なフィールドの一部です：​
id：AniList上の作品ID
title：タイトル（romaji、english、native）
type：作品種別（ANIMEまたはMANGA）
format：作品の形式（例：TV、OVA、MANGAなど）
status：放送・連載状況（例：RELEASING、FINISHED）
description：作品の概要説明
startDate / endDate：放送・連載開始日と終了日
episodes（アニメ） / chapters（マンガ）：話数または章数
volumes（マンガ）：巻数
genres：ジャンル（例：アクション、ドラマ）
tags：タグ（より詳細な分類）
averageScore：ユーザーの平均スコア
popularity：人気度（ユーザーのリスト登録数など）
coverImage：カバー画像（medium、largeなど）
bannerImage：バナー画像
staff：制作スタッフ情報
characters：登場キャラクター情報
studios（アニメ）：制作スタジオ情報
siteUrl：AniList上の作品ページURL​
