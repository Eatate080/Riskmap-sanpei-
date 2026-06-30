
未来の俺へ
仮想環境はMiniconda mambeは現在のネットでは無理だったSSLエラー発生
また、仮想環境名はriskmap_env

    忘れていた時用手順：
    1．クローン完了
    2．Anaconda promptを開きymlファイルのあるローカルリポジトリまでcd
    3．左端が(Base)ならconda env create -f create_env.yml
    4．適宜ｙ
    5．conda activate loveaudio_env
    6．入れるのを確認したらconda deactivate
    7．VSCでCtrl＋Shift＋PでPython: Select Interprinterを選択
    8．実行環境(仮想環境)を洗濯
    9．Ctrl＋Shift＋＠
    10．python 実行ファイル.py


# Riskmap

ダニ被害の危険エリアを地図で可視化するプロジェクトです。フロントエンドは Next.js + React Leaflet で構成され、Supabase から直近 1 か月分の危険地点データを取得して地図上に表示します。その他にはプロトタイピング用の、ローカルの JSON データから Folium で地図を生成する Python スクリプトもあります。

## できること

- 地域を「名寄市」「上川郡」から切り替え
- Supabase の `Location_data` テーブルから危険地点を取得
- 地図上に危険地点と注意地点を表示
- 件数に応じて警戒レベルを表示
- Python スクリプトで静的な `riskmap.html` を生成

## 構成

- `frontend/` - Next.js アプリケーション
- `backend/` - Folium を使った地図生成スクリプト
- `environment.yml` - Python 用の Conda 環境定義

## 必要環境

- Node.js 18 以上
- npm
- Python 3.11 以上
- Conda 系環境管理ツール

## フロントエンドの起動

1. `frontend` ディレクトリへ移動します。
2. 依存パッケージをインストールします。
3. 環境変数を設定します。
4. 開発サーバーを起動します。

```bash
cd frontend
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開くとアプリが表示されます。

### 環境変数

フロントエンドでは Supabase 接続のために次の環境変数が必要です。

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`.env.local` に設定してください。

### Supabase の前提

アプリは `Location_data` テーブルを参照します。少なくとも次の列が必要です。

- `area_name`
- `create_at`
- `lat`
- `lon`
- `location_name`

`area_name` は `nayoro` または `kamikawa` を想定しています。

## バックエンドの使い方

`backend/main.py` は、`backend/data/` 配下の JSON を読み込み、Folium の地図を `riskmap.html` として出力します。

```bash
cd backend
python main.py
```

### Python 環境

`environment.yml` から Conda 環境を作成できます。

```bash
conda env create -f environment.yml
conda activate riskmap-env
```

`environment.yml` の `name` が既存環境と異なる場合は、実際の環境名に合わせてください。

## 実装メモ

- フロントエンドは `app/page.tsx` で地域選択と警戒レベル表示を行っています。
- 地図描画は `app/Map.tsx` で行っています。
- 現在の表示ロジックは、直近 1 か月の登録件数を基準に警戒レベルを変えています。

## ライセンス

現時点では未定義です。必要であれば追記してください。