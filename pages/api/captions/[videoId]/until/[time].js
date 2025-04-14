import { NextApiRequest, NextApiResponse } from 'next'
import { getSubtitles } from 'youtube-captions-scraper';

export default async function captionsTimeHandler(req, res) {
    const { query } = req;
    const { videoId, time } = query;

    const timeNumbers = time.split(":");
    const totaltime = parseInt(timeNumbers[0]) * 60 + parseInt(timeNumbers[1]);
    
    try {
        const captions = await getSubtitles({
            videoID: videoId,
            lang: 'en', // Specify the language code for the captions you want to extract
        });

        let filteredCaptions = [];

        for (const caption in captions){
            const { start, dur, text } = captions[caption];
            if (start < totaltime){
                filteredCaptions.push({
                start,
                dur,
                text,
                });
            }
        }

        return res.json({ filteredCaptions });
    } catch (error) {
        console.error('Error retrieving captions:', error);
        return res.status(500).json({ error: 'Failed to retrieve captions' });
    }   
}