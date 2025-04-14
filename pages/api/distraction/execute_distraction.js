const { exec } = require('child_process');
let pythonProcess = null;

export default async function executeDistractionStatus(req, res) {
    const { action } = req.query;
    try {
      if (action === 'run') {
        if (!pythonProcess) {
          pythonProcess = exec('python3 src/backend/distraction_detector.py', (error, stdout, stderr) => {
            if (error) {
              console.error('Error running Python script:', error);
            } else {
              console.log('Successfully running the application');
            }
          });
        }
        res.json({ message: 'Python script is running' });
      } else if (action === 'kill') {
        if (pythonProcess) {
          pythonProcess.kill();
          pythonProcess = null;
        }
        res.json({ message: 'Python script is stopped' });
      } else {
        res.status(400).json({ error: 'Invalid action parameter. Use "run" or "kill".' });
      }
    } catch (error) {
      console.error('Error running/killing Python script:', error);
      return res.status(500).json({ error: 'Failed to execute script action' });
    }
}
