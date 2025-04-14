// CaptionExtractor.js
//Client Side

export const getCaptions = async (videoId, timestamp) => {
    try {
      const response = await fetch(`/api/captions/${encodeURIComponent(videoId)}/until/${encodeURIComponent(timestamp)}`);
      const data = await response.json();
      const captions = data.filteredCaptions;
      console.log(captions);
      return captions;
    } catch (error) {
      console.error('Error fetching captions:', error);
      throw error;
    }
  };

export const getCaptionsAsParagraph = async (videoId, timestamp) => {
  try {
    const response = await fetch(`/api/captions/${encodeURIComponent(videoId)}/until/${encodeURIComponent(timestamp)}/getAsParagraph`);
    const data = await response.json();
    console.log(data);
    const captions = data.filteredText;
    return captions;
  } catch (error) {
    console.error('Error fetching captions:', error);
    throw error;
  }
};

// avoids Build optimization failed: found pages without a React Component as default export in 
export default function Ignore() {
  return <>{/* nothing */}</>;
}