export const imageThumbnailUrl = (
  url: string,
  width: number = 100,
  height: number = 100
) => {
  const projectId =
    "https://tivznlumwrtoccouqrnm.supabase.co/storage/v1/render/image/public/ecom/";

  // get the file path after 'public/ecom/ from the url
  const filePath = url.split("public/ecom/")[1];

  if (!filePath) {
    return url; // return original url if file path is not found
  }
  // make it webp
  return `${projectId}${filePath}?width=${width}&height=${height}`;
};
