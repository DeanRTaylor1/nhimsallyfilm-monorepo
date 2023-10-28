import {
  AutoIncrement,
  Column,
  PrimaryKey,
  Table,
  DataType,
} from "sequelize-typescript";
import BaseEntity from "./types/Base.entity";

@Table({
  tableName: "images",
})
export default class Image extends BaseEntity<Image> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  imageId: string;

  @Column(DataType.STRING)
  conceptName: string;

  @Column(DataType.BOOLEAN)
  isLandscape: boolean;

  @Column(DataType.STRING)
  cloudfrontUri: string;

  @Column(DataType.STRING)
  packageName: string;

  @Column(DataType.STRING)
  albumId: string;

  @Column(DataType.BOOLEAN)
  isCoverImage: boolean;

  @Column(DataType.STRING)
  albumName: string;

  @Column(DataType.STRING)
  key: string;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;
}
