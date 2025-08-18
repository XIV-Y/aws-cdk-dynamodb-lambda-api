import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface GetItemsResponse {
  items: Item[];
  count: number;
  scannedCount?: number;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const scanParams: DynamoDB.DocumentClient.ScanInput = {
      TableName: process.env.TABLE_NAME!,
    };

    const result = await dynamodb.scan(scanParams).promise();

    const response: GetItemsResponse = {
      items: (result.Items as Item[]) || [],
      count: result.Count || 0,
      ...(result.ScannedCount && { scannedCount: result.ScannedCount })
    };

    response.items.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Error retrieving items:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
