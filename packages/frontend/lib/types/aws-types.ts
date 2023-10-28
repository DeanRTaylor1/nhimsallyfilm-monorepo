export interface awsImage {
  image_id: string;
  image_uri: string;
  created_at: Date;
  updated_at: Date;
  package_name: string;
  concept_name: string;
  album_name: string;
  album_id: string;
  is_cover_image: boolean;
  is_landscape: boolean;
  key: string;
  cloudfront_uri: string;
}


export interface awsImageFile extends awsImage {
  file: File;
}

export interface GalleryProps {
  galleryImages: awsImage[];
}
