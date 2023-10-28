import { dynamoDBSingleton } from "../aws/aws-dynamo.js";

(async () => {
  try {
    const dynamoDB = dynamoDBSingleton.getInstance();
    const items = await dynamoDB.updateImageUrls();
  } catch (error) {
    console.error("Error updating CloudFront URIs:", error);
  }
})();
