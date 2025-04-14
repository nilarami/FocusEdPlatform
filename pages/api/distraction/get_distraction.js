// Define a global variable to store the distractionStatus
let currentDistractionStatus = 'Not received yet';

export default async function getDistractionStatus(req, res) {
    try {
        if (req.method === 'POST') {
            // If it's a POST request, it means the Python script is sending data
            const { distractionStatus } = req.body;

            if (distractionStatus === null) {
                // If distractionStatus is null, return a specific message
                return res.json({ distractionStatus: 'Not received yet' });
            }

            // Store the 'distractionStatus' received from the Python script
            currentDistractionStatus = distractionStatus;
            console.log('Received distraction status from Python script:', distractionStatus);
            return res.json({ distractionStatus });
        } else if (req.method === 'GET') {
            // If it's a GET request, it means the client is requesting the distraction status
            //console.log('Sending distraction status to the client:', currentDistractionStatus);
            return res.json({ distractionStatus: currentDistractionStatus });
        } else {
            // Handle other HTTP methods if needed
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error retrieving distraction:', error);
        return res.status(500).json({ error: 'Failed to retrieve distraction status' });
    }
}
