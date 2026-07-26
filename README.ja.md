# angular-skills

[English](./README.md)

Angular を扱うための Agent Skill を集めたリポジトリです。

ここにあるスキルは、公式の [`angular/skills`](https://github.com/angular/skills) を代替するものではありません。
公式スキルがカバーしていない範囲を補うためのものです。

**非公式です。** このリポジトリは Google および Angular チームとの提携も、承認も、サポートも受けていません。

## Skills

| Skill | 範囲 |
|---|---|
| `angular-update-guide` | Angular の v6 から v22 まで、メジャーからメジャーへの各ステップにおける破壊的変更と移行項目。[angular/angular](https://github.com/angular/angular) にある [Angular Update Guide](https://angular.dev/update-guide) のデータから生成しているので、エージェントはドキュメントサイトを見に行かずに直接読めます。リファレンスデータのみで、更新の実行手順は含みません。 |

## インストール

[`skills`](https://www.npmjs.com/package/skills)（Vercel Labs によるオープンな Agent Skill インストーラ）で導入します。

```sh
# プロジェクトに入れる
npx skills add lacolaco/angular-skills

# ユーザー全体に入れる
npx skills add lacolaco/angular-skills -g

# このスキルだけ入れる
npx skills add lacolaco/angular-skills -s angular-update-guide
```

スキルは `.agents/skills/` に配置され、インストーラが利用環境に応じたディレクトリへリンクを張ります。
インストール内容は `skills-lock.json` に記録されるので、これをコミットすれば共同作業者も同じ内容を解決できます。

インストーラに依存する部分はありません。
各スキルは `SKILL.md` を起点とする素のディレクトリなので、手で配置しても同じように動きます。

## 更新を依頼する

このスキルが持つのは「何が変わるか」であって「どう変えるか」ではありません。
そのため、もともと投げるつもりだった依頼の中で働きます。
スキルの名前を出す必要はありません。

> このプロジェクトを Angular 21 に上げて。

> いま v18 で、v21 まで行きたい。メジャーを 1 つずつ進める形で案内して、各ステップで何が壊れるか教えて。

着手を決める前の調査にも使えます。

> このコードベースで Angular 20 から 21 の間に何が壊れる？まだ何も変更しないで、まずリストを見せて。Angular Material を使っている場合だけ関係する項目も含めて。

最後の例には知っておく価値があります。
リファレンスファイルは複雑度レベルでも、Angular Material や ngUpgrade や Windows といった条件でも絞り込まれていません。
全項目が入っていて、何が該当するかはエージェントが対象プロジェクトを読んで判断します。
そのため範囲を広げたり狭めたりする依頼（「めったに関係しないものも含めて全部出して」など）には、実際に応じる中身があります。

エージェントに説明だけでなく更新の実行までさせるなら、`ng update` について普段から信頼している手順と組み合わせてください。
その部分は意図的に含めていません。

## 必要なもの

- インストール先には何も要りません。スキルは実行時依存を持たない素のテキストファイルです。
- このリポジトリで作業するには Node.js v22 以降と `pnpm` が要ります。

## リポジトリの構成

```
skills/<name>/         npx skills add がインストールする対象。SKILL.md とその隣のファイル
tools/<name>/          そのスキルのビルド（持つ場合）
upstream/angular/      angular/angular にピンした git submodule。上流のソースを要するビルドが読む
```

1 つのスキルに属するものはすべてその名前の下にまとめてあるので、2 つ目のスキルを追加しても既存のものに触れずに済みます。

`upstream/angular` は angular/angular の特定コミットにピンした git submodule です。
生成物がどの上流コミットからビルドされたかを、リポジトリ自身が宣言していることになります。
angular/angular は巨大なモノレポなので、`adev/src/app/features/update` だけを sparse checkout しています（`.gitmodules` を参照）。

`angular-update-guide` のビルドは、submodule から Update Guide のソースを読んでリファレンスファイルを一度に書き出します。
日次のワークフローが submodule を進めて再ビルドし、リファレンスに実際の変化があったときだけプルリクエストを開きます。
ビルドは決定論的なので、差分が出たということは上流が動いたということです。

```sh
git submodule update --init              # 初回のみ。upstream/angular を取得する
pnpm install
pnpm run build:angular-update-guide      # references/ と SKILL.md の生成領域を書き換える
pnpm test
```

## 設計上の選択

- **`angular-update-guide` は v6 より前からの更新を対象にしていません。** 上流も同じ境界を引いています。Update Guide は v6 未満を推奨項目の一覧ではなく `renderPreV6Instructions()` に渡しています。
- **`angular-update-guide` はレベルやオプションによる事前の絞り込みをしません。** 上流の UI は、人間が複雑度レベルを選び、Angular Material、ngUpgrade、Windows を切り替える形です。生成ファイルは全項目を保持します。対象プロジェクトの `package.json`、ソース、実行環境を読めるエージェントのほうが、あらかじめ設定したフィルタより正確に判断できるからです。
- **npm に公開せず、タグも CHANGELOG も持ちません。** `npx skills add` はデフォルトブランチの HEAD を解決するので、ブランチ自体がリリースチャネルです。パッケージにバージョンを付けても、誰も読まない 2 つ目の真実の所在が増えるだけです。

## ライセンス

[MIT](./LICENSE) © Suguru Inatomi

生成されたリファレンスの内容は [angular/angular](https://github.com/angular/angular) に由来します。こちらも MIT ライセンスです。
