export const toLowercaseExtension = (fileName = "") => {
	const lastDotIndex = fileName.lastIndexOf(".");
	if (lastDotIndex === -1) {
	  return fileName;
	}
	const extension = fileName.substring(lastDotIndex + 1).toLowerCase();
	const nameWithoutExtension = fileName.substring(0, lastDotIndex);
	const withLowercaseExtension = nameWithoutExtension.concat(".", extension);
	return withLowercaseExtension;
  };
  