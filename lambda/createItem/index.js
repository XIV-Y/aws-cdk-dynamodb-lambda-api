const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
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

    const requestBody = JSON.parse(event.body);
    
    if (!requestBody.name || !requestBody.description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'name and description are required fields'
        })
      };
    }

    const newItem = {
      id: uuidv4(),
      name: requestBody.name.trim(),
      description: requestBody.description.trim(),
      createdAt: new Date().toISOString()
    };

    await dynamodb.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: newItem
    }));

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
        message: error.message || 'Unknown error'
      })
    };
  }
};
