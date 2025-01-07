const downloadImage = (
  canvas: HTMLCanvasElement | null,
  fileName: string = "NFT.png",
  redirectAfterDownload: string = "/"
) => {
  if (!canvas) {
    console.error("Canvas element not found.");
    return;
  }

  try {
    const link = document.createElement("a");
    link.download = fileName; // Set the file name for the download
    link.href = canvas.toDataURL("image/png"); // Generate the canvas data URL
    link.click(); // Trigger the download

    // Redirect to the specified URL after download
    setTimeout(() => {
      window.location.href = redirectAfterDownload;
    }, 1000); // Optional delay to ensure the download completes
  } catch (err) {
    console.error("Failed to download image:", err);
    alert("Unable to download the image. Please try again.");
  }
};

export default downloadImage;
