import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { awsImage } from "../types/aws-types";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomInt } from "crypto";

export class dynamoDBSingleton {
  private static instance: dynamoDBSingleton;
  private dynamoDB: DynamoDBDocumentClient;
  private tableName: string;
  private constructor() {
    const client = new DynamoDBClient({
      region: "ap-southeast-1",
      credentials: {
        accessKeyId: process.env.AWS_NS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_NS_SECRET_KEY!,
      },
    });
    this.dynamoDB = DynamoDBDocumentClient.from(client);
    this.tableName = "nhimsallyfilmimages";
  }

  public static getInstance(): dynamoDBSingleton {
    if (!dynamoDBSingleton.instance) {
      dynamoDBSingleton.instance = new dynamoDBSingleton();
    }

    return dynamoDBSingleton.instance;
  }

  public async addItem(item: awsImage): Promise<void> {
    const params: DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: item,
    };

    try {
      await this.dynamoDB.send(new PutCommand(params));
    } catch (error) {
      console.error(`Error adding item: ${error}`);
      throw error;
    }
  }

  public async getAllItems(): Promise<awsImage[]> {
    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
    };

    try {
      const data = await this.dynamoDB.send(new ScanCommand(params));
      return data.Items as awsImage[];
    } catch (error) {
      console.error(`Error getting all items: ${error}`);
      throw error;
    }
  }

  public async getItem(imageId: number): Promise<awsImage> {
    const params: DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: {
        imageId: imageId,
      },
    };

    try {
      const data = await this.dynamoDB.send(new GetCommand(params));
      return data.Item as awsImage;
    } catch (error) {
      console.error(`Error getting item: ${error}`);
      throw error;
    }
  }

  public async deleteItem(imageId: string): Promise<void> {
    const params: DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: {
        imageId: imageId,
      },
    };

    try {
      await this.dynamoDB.send(new DeleteCommand(params));
    } catch (error) {
      console.error(`Error deleting item: ${error}`);
      throw error;
    }
  }

  public async updateItem(item: awsImage): Promise<void> {
    const params: DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: {
        imageId: item.imageId,
      },
      UpdateExpression: "set imageUri = :imageUri, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":imageUri": item.imageUri,
        ":updatedAt": item.updatedAt,
      },
      ReturnValues: "UPDATED_NEW",
    };

    try {
      await this.dynamoDB.send(new UpdateCommand(params));
    } catch (error) {
      console.error(`Error updating item: ${error}`);
      throw error;
    }
  }

  public async queryItems(
    attributeName: keyof awsImage,
    queryValue: any
  ): Promise<awsImage[]> {
    const params: DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: `${attributeName} = :queryValue`,
      ExpressionAttributeValues: {
        ":queryValue": queryValue,
      },
    };

    try {
      const data = await this.dynamoDB.send(new QueryCommand(params));
      return data.Items as awsImage[];
    } catch (error) {
      console.error(`Error querying items: ${error}`);
      throw error;
    }
  }

  public async getAllCoverImages(): Promise<awsImage[]> {
    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
      FilterExpression: "isCoverImage = :isCoverImage",
      ExpressionAttributeValues: {
        ":isCoverImage": true,
      },
    };

    try {
      const data = await this.dynamoDB.send(new ScanCommand(params));
      return data.Items as awsImage[];
    } catch (error) {
      console.error(`Error getting all cover images: ${error}`);
      throw error;
    }
  }

  public async getAllAlbumImages(albumId: string): Promise<awsImage[]> {
    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
      FilterExpression: "albumId = :albumId",
      ExpressionAttributeValues: {
        ":albumId": albumId,
      },
    };

    try {
      const data = await this.dynamoDB.send(new ScanCommand(params));
      return data.Items as awsImage[];
    } catch (error) {
      console.error(`Error getting all album images: ${error}`);
      throw error;
    }
  }

  public async getAllImagesByPackageName(
    packageName: string
  ): Promise<awsImage[]> {
    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
      FilterExpression:
        "packageName = :packageName and isCoverImage = :isCoverImage",
      ExpressionAttributeValues: {
        ":packageName": packageName,
        ":isCoverImage": true,
      },
    };

    try {
      const data = await this.dynamoDB.send(new ScanCommand(params));
      return data.Items as awsImage[];
    } catch (error) {
      console.error(`Error getting all images by package name: ${error}`);
      throw error;
    }
  }

  public async getAlbumByName(albumName: string): Promise<awsImage[]> {
    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
      FilterExpression: "albumName = :albumName",
      ExpressionAttributeValues: {
        ":albumName": albumName,
      },
    };

    try {
      const data = await this.dynamoDB.send(new ScanCommand(params));
      return data.Items as awsImage[];
    } catch (error) {
      console.error(`Error getting album by name: ${error}`);
      throw error;
    }
  }

  public async getAlbumById(albumId: string): Promise<awsImage[]> {
    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
      FilterExpression: "albumId = :albumId",
      ExpressionAttributeValues: {
        ":albumId": albumId,
      },
    };

    try {
      const data = await this.dynamoDB.send(new ScanCommand(params));
      return data.Items as awsImage[];
    } catch (error) {
      console.error(`Error getting album by name: ${error}`);
      throw error;
    }
  }

  public async getPhotosByPackage(albumId: string): Promise<awsImage[]> {
    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
      FilterExpression: "albumId = :albumId",
      ExpressionAttributeValues: {
        ":albumId": albumId,
      },
    };

    try {
      const data = await this.dynamoDB.send(new ScanCommand(params));
      return data.Items as awsImage[];
    } catch (error) {
      console.error(`Error getting album by name: ${error}`);
      throw error;
    }
  }

  public async getRandomCoverImages(limit: number): Promise<awsImage[]> {
    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
      FilterExpression: "isCoverImage = :isCoverImage",
      ExpressionAttributeValues: {
        ":isCoverImage": true,
      },
    };

    try {
      const data = await this.dynamoDB.send(new ScanCommand(params));
      const allCoverImages = data.Items as awsImage[];

      const randomCoverImages: awsImage[] = [];

      //Create new number set
      const indices = new Set<number>();
      //If the limit is greater than the number of cover images, set the limit to the number of cover images
      if (allCoverImages.length < limit) {
        limit = allCoverImages.length;
      }

      //While the number set is less than the limit, add a random number to the set
      while (indices.size < limit) {
        const randomIndex = randomInt(allCoverImages.length);
        if (!indices.has(randomIndex)) {
          indices.add(randomIndex);
          randomCoverImages.push(allCoverImages[randomIndex]);
        }
      }

      return randomCoverImages;
    } catch (error) {
      console.error(`Error getting random cover images: ${error}`);
      throw error;
    }
  }

  public async getMiscPhotosByPackage(
    albumId: string,
    packageName: string
  ): Promise<awsImage[]> {
    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
      FilterExpression: "albumId = :albumId AND packageName = :packageName",
      ExpressionAttributeValues: {
        ":albumId": albumId,
        ":packageName": packageName,
      },
    };

    try {
      const data = await this.dynamoDB.send(new ScanCommand(params));
      return data.Items as awsImage[];
    } catch (error) {
      console.error(`Error getting photos by package: ${error}`);
      throw error;
    }
  }

  public async updateImageUrls(): Promise<void> {
    const oldDomain = "nhimsallyfilmsite.s3.ap-southeast-1.amazonaws.com";
    const newDomain = "d3cptuexqel1lc.cloudfront.net";

    try {
      const items = await this.getAllItems();

      for (const item of items) {
        const imageUrl = item.imageUri;
        const updatedImageUrl = imageUrl.replace(oldDomain, newDomain);
        console.log(updatedImageUrl);
        // const params: DocumentClient.UpdateItemInput = {
        //   TableName: this.tableName,
        //   Key: { imageId: item.imageId },
        //   UpdateExpression: "set cloudfrontUri = :newUrl",
        //   ExpressionAttributeValues: {
        //     ":newUrl": updatedImageUrl,
        //   },
        // };

        // await this.dynamoDB.send(new UpdateCommand(params));
      }

      console.log("Image URLs updated successfully.");
    } catch (error) {
      console.error("Error updating image URLs:", error);
    }
  }
}
