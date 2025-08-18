import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

interface CreateItemRequest {
  name: string;
  description: string;
}

interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Request body is required'
        })
      };
    }

    const requestBody: CreateItemRequest = JSON.parse(event.body);
    
    if (!requestBody.name || !requestBody.description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'name and description are required fields'
        })
      };
    }

    const newItem: Item = {
      id: uuidv4(),
      name: requestBody.name.trim(),
      description: requestBody.description.trim(),
      createdAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: process.env.TABLE_NAME!,
      Item: newItem
    }).promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Item created successfully',
        item: newItem
      })
    };

  } catch (error) {
    console.error('Error creating item:', error);
    
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
