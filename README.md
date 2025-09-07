AWS CDKを使用してDynamoDB + Lambda + API Gatewayで構築するシンプルなCRUD APIのテンプレートプロジェクト。

## アーキテクチャ

- **Amazon DynamoDB**
- **AWS Lambda**
- **Amazon API Gateway**
- **AWS CDK**

## API仕様

| メソッド | エンドポイント | 説明 |
|----------|---------------|------|
| `GET` | `/items` | アイテム一覧取得 |
| `POST` | `/items` | 新しいアイテム作成 |

### POSTリクエスト形式
```json
{
  "name": "アイテム名",
  "description": "アイテムの説明"
}
```

## 環境構築

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd cdk-dynamodb-crud-api
```

### 2. 依存関係のインストール
```bash
npm install

# Lambda Layerの依存関係もインストール
cd lambda-layers/nodejs && npm install && cd ../..
```

## デプロイ手順

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

デプロイ完了後、API GatewayのエンドポイントURLが出力されます。

## 動作確認

### 1. デプロイ成功の確認
```bash
# API Gateway URLを取得
aws apigateway get-rest-apis --query 'items[?name==`Simple Items API`].[id,name]' --output table
```

### 2. API動作テスト

#### アイテム作成（POST）
```bash
curl -X POST "https://YOUR_API_GATEWAY_URL/prod/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "テストアイテム",
    "description": "これはテスト用のアイテムです"
  }'
```

#### アイテム一覧取得（GET）
```bash
curl -X GET "https://YOUR_API_GATEWAY_URL/prod/items"
```
