AWS CDKを使用してLambda関数とAPI Gatewayをデプロイするためのテンプレートプロジェクト。Infrastructure as Codeによるサーバーレスアプリケーションの構築。

## 🛠️ 環境構築

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd aws-cdk-lambda-api-template
```

### 2. 依存関係のインストール
```bash
npm install
```

## 🚀 デプロイ手順

### 1. TypeScriptコンパイル
```bash
npm run build
```

### 2. 差分の確認
```bash
npx cdk diff
```

### 3. デプロイ実行
```bash
npx cdk deploy
```
