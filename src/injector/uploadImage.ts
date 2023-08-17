import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../helpers/s3client";
import { Media } from "../types/staytion";

const getImageBlobFromUrl = async (url: string): Promise<Blob> => {
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response) throw new Error("Unable to fetch image from url");

  return response.blob();
};

const compressImage = async (file: Blob) => {
  const imageBuf = await file.arrayBuffer();
  const image = await sharp(imageBuf)
    .resize({ width: 2048, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return image;
};

export const uploadImage = async (image: Media): Promise<Media> => {
  const imageBlob = await getImageBlobFromUrl(image.url);
  const compressedImage = await compressImage(imageBlob);

  const fileName = uuidv4();
  const fileNameExt = `scrape/${fileName}.webp`;

  // /*
  const metadata = {
    "x-amz-meta-owner-uid": "",
    "x-amz-meta-owner-role": "",
    "x-amz-meta-permission-key-check": "",
  };

  const data = await s3Client.send(
    new PutObjectCommand({
      Bucket: "staytion",
      Key: fileNameExt,
      ACL: "public-read",
      Metadata: metadata,
      Body: compressedImage,
    })
  );

  if (!data) throw new Error("Unable to upload to S3 bucket");
  // */

  return {
    ...image,
    url: `https://staytion.sgp1.digitaloceanspaces.com/${fileNameExt}`,
    ref_id: fileNameExt,
  };
};

export const uploadOrGetFromCache = (
  media: Media | null,
  imagesCache: { [url: string]: Media }
) =>
  new Promise<Media | null>((resolve) => {
    if (media === null) {
      resolve(null);
    } else {
      const originalPhotoUrl = media.url;

      // If image has not been uploaded into the link (cached into the local db), upload the image
      if (!imagesCache[originalPhotoUrl]) {
        // Then, store the image into the local db
        uploadImage(media)
          .then((uploadedImage) => {
            // eslint-disable-next-line no-param-reassign
            imagesCache[originalPhotoUrl] = uploadedImage;
            console.log(`${originalPhotoUrl} - Uploaded to S3`);
            resolve(imagesCache[originalPhotoUrl]);
          })
          .catch((err) => {
            console.log(`${err} - ${originalPhotoUrl}`);
            resolve(null);
          });
      } else {
        resolve(imagesCache[originalPhotoUrl]);
      }
    }
  });
