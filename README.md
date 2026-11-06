# 謎解きマーケット 2026 レジアプリ

## 起動

```powershell
npm.cmd run dev
```

表示された `http://localhost:5173/` をブラウザで開きます。

トップURLは端末幅に応じて自動振り分けされます。直接開く場合は、PC版が `http://localhost:5173/desktop.html`、スマホ版が `http://localhost:5173/mobile.html` です。

## GitHub Pagesで公開

このプロジェクトにはGitHub Pages用のWorkflow（`.github/workflows/deploy-pages.yml`）が含まれています。

### 初回設定

1. GitHubリポジトリの **Settings** → **Pages** を開きます。
2. **Build and deployment** の **Source** で **GitHub Actions** を選択します。
3. リポジトリがPrivateの場合、無料プランではPagesを公開できないことがあるため、必要に応じて **Settings** → **General** → **Danger Zone** → **Change repository visibility** からPublicに変更します。

### デプロイ

変更をGitHubの `main` ブランチへpushすると、自動でデプロイされます。

```powershell
git add .
git commit -m "Update market app"
git push origin main
```

GitHubの **Actions** → **Deploy to GitHub Pages** を開き、実行結果が緑色のチェックになれば完了です。反映には数分かかる場合があります。

このリポジトリの公開URL:

`https://k4syu.github.io/nazotokimarket/`

## 使い方

1. 商品カードをタップしてカートへ追加します。
2. カート内の `＋` / `−` で数量を調整します。
3. 「会計を確定する」を押すと、購入日時・商品名・数量・金額がこの端末に保存されます。
4. 「CSVを書き出す」で購入履歴をExcelで開けるCSVとしてダウンロードできます。
5. Googleスプレッドシートでは「ファイル」→「インポート」→「アップロード」からCSVを読み込めます。

スマートフォン・タブレットでは、ブラウザのダウンロード通知またはファイルアプリから保存したCSVを確認できます。

購入履歴はブラウザの `localStorage` に保存されます。商品リストは `src/products.js` の内容が常に反映されます。別の端末やブラウザとは共有されないため、当日は同じ端末・同じブラウザを使ってください。開催後に複数端末のデータを集約する場合は、各端末からCSVを書き出して1つのスプレッドシートへ読み込みます。

## 商品の変更

商品名・価格・表示色・説明を変更する場合は `src/products.js` の `defaultProducts` を編集してください。

## 在庫管理

1. 「管理用集計を表示」を開きます。
2. 「在庫管理」の商品ごとの入力欄に在庫数を入力します。
3. 空欄は無制限、`0` は売り切れとして扱われます。
4. 会計を確定すると、販売数量分が自動で減ります。

在庫数と購入履歴は端末のブラウザ内に保存されます。別のiPadやPCとは自動同期されないため、複数端末で使う場合は端末ごとに管理してください。

## iPadをWi-Fiなしで使う

初回だけWi-Fi環境で公開URLを開き、PC版またはスマホ版を表示します。Service Workerがアプリ本体を保存したあと、Safariの共有メニューから「ホーム画面に追加」を行ってください。以後はホーム画面のアプリから、Wi-Fiがない場所でもレジと在庫管理を利用できます。

初回キャッシュ前や、ブラウザのデータを消去したあとはオフライン起動できません。開催前にWi-Fi環境で一度起動し、商品表示・会計・在庫減算を確認してください。端末故障やデータ消去に備えて、営業終了時はCSVを書き出してください。
