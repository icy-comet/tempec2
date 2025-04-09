import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"

// In a production app, these would come from environment variables
// You would add these to your Vercel project settings
// AWS_REGION
// AWS_ACCESS_KEY_ID
// AWS_SECRET_ACCESS_KEY

const client = new DynamoDBClient({
  region: "us-east-1",
})

const docClient = DynamoDBDocumentClient.from(client)

// Table name would also be an environment variable in production
const PASTES_TABLE = process.env.DYNAMODB_PASTES_TABLE || "Pastes"

export async function savePaste(id: string, content: string) {
  const command = new PutCommand({
    TableName: PASTES_TABLE,
    Item: {
      id,
      content,
      createdAt: new Date().toISOString(),
    },
  })

  await docClient.send(command)
  return id
}

export async function getPaste(id: string) {
  const command = new GetCommand({
    TableName: PASTES_TABLE,
    Key: {
      id,
    },
  })

  const response = await docClient.send(command)
  return response.Item
}

export async function getRecentPastes(limit = 10) {
  // This assumes you have a GSI on createdAt
  // You would need to create this in your DynamoDB table setup
  const command = new QueryCommand({
    TableName: PASTES_TABLE,
    IndexName: "CreatedAtIndex",
    KeyConditionExpression: "dummy = :dummy",
    ExpressionAttributeValues: {
      ":dummy": "1", // This is a dummy value for the GSI partition key
    },
    ScanIndexForward: false, // descending order (newest first)
    Limit: limit,
  })

  const response = await docClient.send(command)
  return response.Items
}
