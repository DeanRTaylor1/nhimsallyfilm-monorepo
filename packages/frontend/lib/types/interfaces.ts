export interface IndexProps {
  homeImageArr: image[];
  homeLandScapeImageArr: image[];
  individualPackage: image[];
  couplePackage: image[];
  weddingPackage: image[];
}

export interface image {
  id?: string;
  _id?: string;
  albumName?: string;
  imageurl?: string;
  imagename?: string;
  imageUri?: string;
  imageName?: string;
  isAlbumCover?: boolean;
}

export interface MainImageSwiperProps {
  homeImageArr: image[];
}

export interface LandscapeImageSwiperProps {
  homeLandScapeImageArr: image[];
}

export type BlogProps = {
  title: string;
  updatedAt?: Date;
  createdAt: Date;
  description: string;
  content?: string;
  imageUri: string;
};

export type AdminBlogProps = {
  fetchBlogPosts: () => void;
  title: string;
  updatedAt?: Date;
  createdAt: Date;
  description: string;
  content?: string;
  imageUri: string;
};

export type BlogListProps = {
  blogs: BlogProps[];
};

export interface PackageSwiperProps {
  images: image[];
}

export interface BookingPageProps {
  individualSwiper: string;
  coupleSwiper: string;
  weddingSwiper: string;
}

export type Data = {
  message?: string;
  userId?: string;
  imageId?: String;
  images?: any[];
};

export class StatusError extends Error {
  statusCode: number | undefined;
  data?: any[];
}

export interface ImageSchema {
  albumName: string;
  imageUri: string;
  imageName: string;
  isAlbumCover: Boolean;
}
