import { NextApiRequest, NextApiResponse } from 'next'
import { getSubtitles } from 'youtube-captions-scraper';

export default async function captionsHandler(req, res) {
    const { query } = req;
    const { videoId } = query;

    try {
        const captions = await getSubtitles({
          videoID: videoId,
          lang: 'en', // Specify the language code for the captions you want to extract
        });
    
        return res.json({ captions });
    } catch (error) {
        console.error('Error retrieving captions:', error);
        return res.status(500).json({ error: 'Failed to retrieve captions' });
    }
}