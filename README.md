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
