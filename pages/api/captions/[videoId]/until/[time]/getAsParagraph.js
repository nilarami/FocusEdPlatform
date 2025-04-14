import { NextApiRequest, NextApiResponse } from 'next'
import { getSubtitles } from 'youtube-captions-scraper';

export default async function captionsTimeHandlerAsParagraph(req, res) {
    const { query } = req;
    const { videoId, time } = query;

    const timeNumbers = time.split(":");
    const totaltime = parseInt(timeNumbers[0]) * 60 + parseInt(timeNumbers[1]);
    
    try {
        const captions = await getSubtitles({
            videoID: videoId,
            lang: 'en', // Specify the language code for the captions you want to extract
        });

        let filteredText = "";

        for (const caption in captions){
            const { start, dur, text } = captions[caption];
            if (start < totaltime){
                // console.log(text);
                filteredText += " " + text;
            }
        }

        return res.json({ filteredText });
    } catch (error) {
        console.error('Error retrieving captions:', error);
        return res.status(500).json({ error: 'Failed to retrieve captions' });
    }
}