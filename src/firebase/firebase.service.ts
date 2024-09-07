import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as file from "./firebase-adminsdk.json"

@Injectable()
export class FirebaseService {

  private static isInitialized = false; // Static variable to track initialization status
  private readonly storage: admin.storage.Storage;

  constructor() {
    if (!FirebaseService.isInitialized) {
      const serviceAccount = require('./firebase-adminsdk.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.URL_Bucket_Firebase,
      });
      FirebaseService.isInitialized = true; 
    }

    this.storage = admin.storage();
  }

  getStorage(): admin.storage.Storage {
    return this.storage;
  }

  async UploadImage(file: Express.Multer.File): Promise<string> {
    const storage = await this.getStorage();
    const bucket = storage.bucket();
    const filename = `${Date.now()}_${file.originalname}`;

    const fileUpload = bucket.file(filename);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });
      stream.on('finish', () => {
        fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-09-2491',
        }, (err, signedUrl) => {
          if (err) {
            reject(err);
          } else {
            resolve(signedUrl);
          }
        });
      });
      stream.end(file.buffer);
    });
    return filename;
  }

  async DeleteImage(imageUrl: string): Promise<void> {
    const storage = await this.getStorage();
    const bucket = storage.bucket();

    const fileName = this.extractFileNameFromUrl(imageUrl);

    if (!fileName) {
      throw new Error('Invalid imageUrl format');
    }

    const file = bucket.file(fileName);
    
    const [exists] = await file.exists();

    if (!exists) {
      throw new Error('File does not exist');
    }

    return new Promise((resolve, reject) => {
      file.delete((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private extractFileNameFromUrl(url: string): string | null {
    const regex = /o\/(.*)\?alt=media/;
    const match = url.match(regex);
    return match ? decodeURIComponent(match[1]) : null;
  }
}