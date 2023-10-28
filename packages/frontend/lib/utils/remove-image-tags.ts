export const removeImageTags = (string: string) => {
  const regexp = /<img\s+[^>]*>/g
    let res = string.replace(regexp, '')
    return res
}
