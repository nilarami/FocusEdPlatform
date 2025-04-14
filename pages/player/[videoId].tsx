import styles from '../page.module.css'
import React from 'react';
import { useRouter } from 'next/router'

import { getCaptionsAsParagraph } from '../util/CaptionExtractor';
import { getQuestions } from '../util/QuestionsExtractor';
import { fetchDistractionStatus, executeDistractionStatus } from '../util/DistractionExtractor';
import { QuestionForm } from '../components/QuestionForm';




import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';



export default function VideoPlayer() {
  const router = useRouter();
  const youtubeVideoId = router.query.videoId;
  console.log('youtubeVideoId', youtubeVideoId);

  const [captions, setCaptions] = React.useState([]);
  const [timestamp, setTimestamp] = React.useState('');
  const [engagementTrackingState, setengagementTrackingState] = React.useState('engagementOff');
  const [distractionStatus, setDistractionStatus] = React.useState('');
  const [lastQueriedTimestamp, setLastQueriedTimestamp] = React.useState('');

  const [questionData, setQuestionData] = React.useState('');
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = React.useState(false);
  const [showQuestionForm, setShowQuestionForm] = React.useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const [isPausedForDistraction, setIsPausedForDistraction] = React.useState(false);


  //const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmittedAnswer = (isCorrect) => {
    setShowFeedback(true);
    setIsAnswerCorrect(isCorrect);
    setQuestionData('');

    //if question is correct, continue play video and if question is wrong, restart video 
    if (isCorrect) {
      // Continue playing the video
      if (playerRef && playerRef.current) {
        // @ts-ignore
        playerRef.current.playVideo();
      }
    } else {
      // Restart the video
      if (playerRef && playerRef.current) {
        // @ts-ignore
        playerRef.current.seekTo(0);
        // @ts-ignore
        playerRef.current.playVideo();
      }
    }
  };

  const playerRef = React.useRef(null);
  React.useEffect(() => {
    const onPlayerReady = (event) => {
      const player = event.target;
      playerRef.current = player;

      // load video on start
      event.target.playVideo();

      player.addEventListener('onStateChange', onPlayerStateChange);
    };

    const onPlayerStateChange = (event) => {
      const player = event.target;

      // @ts-ignore
      if (event.data == window.YT.PlayerState.PLAYING) {
        // Hide the question form when the video is playing or buffering
        setShowQuestionForm(false);
        setIsVideoPlaying(true);
        // Reset isPausedForDistraction to false when video is playing again
        if (isPausedForDistraction) {
          setIsPausedForDistraction(false);
        }
      }
      else if (event.data === window.YT.PlayerState.PAUSED) {
        const currentTime = Math.floor(player.getCurrentTime());
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        setTimestamp(formattedTime);

        setShowQuestionForm(true); //take out when done testing 
        // Show the question form when the video is paused due to distraction and there are valid questionData
        if (distractionStatus === 'distracted' && questionData) {
          setShowQuestionForm(true);
          setIsVideoPlaying(false);
        }

      }
    };

    const loadYouTubePlayerAPI = () => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/player_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      // @ts-ignore
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // @ts-ignore
      window.onYouTubePlayerAPIReady = () => {
        // @ts-ignore
        new window.YT.Player('player', {
          videoId: youtubeVideoId,
          playerVars: {
            'playsinline': 1
          },
          events: {
            onReady: onPlayerReady,
          },
        });
      };
    };

    loadYouTubePlayerAPI();

    return () => {
      // @ts-ignore
      playerRef.current && playerRef.current.removeEventListener('onStateChange', onPlayerStateChange);
    };
  }, [youtubeVideoId]);


  React.useEffect(() => {
    const fetchCaptions = async () => {
      try {
        if (timestamp && timestamp != lastQueriedTimestamp) {

          const captionsAsParagraph = await getCaptionsAsParagraph(youtubeVideoId, timestamp);
          setCaptions(captionsAsParagraph);
          //console.log(captionsAsParagraph);
          if (captionsAsParagraph.length < 50) {
            console.log('Not enough captions to generate questions.');
            return;
          }
          const questionData = await getQuestions(captionsAsParagraph);
          setLastQueriedTimestamp(timestamp);
          console.log(questionData);

          setQuestionData(JSON.parse(questionData));
        }
      } catch (error) {
        console.error('Error fetching captions:', error);
      }
    };

    fetchCaptions();
  }, [youtubeVideoId, timestamp]);

  const handleExecuteDistractionStatus = async () => {
    try {

      //Runs the Execute distraction_detector.py send in "run" or "kill"
      if (engagementTrackingState == 'engagementOn') {
        await executeDistractionStatus('kill');
      }
      else {
        await executeDistractionStatus('run');
      }

      //Sets the egngement tracking state accordingly 
      setengagementTrackingState(engagementTrackingState => (engagementTrackingState === 'engagementOn' ? 'engagementOff' : 'engagementOn'));

    } catch (error) {
      console.error('Error executing distraction status:', error);
    }
  };

  const handleFetchDistractionStatus = async () => {
    const distractionStatus = await fetchDistractionStatus();
    // Handle the distractionStatus as needed, e.g., update UI or perform other actions
    //console.log(distractionStatus);
    setDistractionStatus(distractionStatus);

    // Pause the video when distractionStatus is "distracted"
    if (distractionStatus === 'distracted') {
      // Pause the video using the YouTube player reference
      //Update this tomorrow
      //playerRef.current.pauseVideo();
      if (playerRef) {
        // @ts-ignore
        playerRef.current.pauseVideo();
        setIsPausedForDistraction(true);
      }
    }
  };

  React.useEffect(() => {
    let intervalId;

    const fetchDataPeriodically = () => {
      handleFetchDistractionStatus();
    };

    //if (engagementTrackingState === 'engagementOn') {
    // Fetch data immediately when engagementTrackingState is 'engagementOn'
    fetchDataPeriodically();

    // Start fetching data every 10 seconds
    intervalId = setInterval(fetchDataPeriodically, 1000);
    //}

    // Clean up the interval when the component unmounts or when engagementTrackingState changes to 'engagementOff'
    return () => {
      clearInterval(intervalId);
    };
  }, [engagementTrackingState]);

  // avoid loading page with no video id
  if (!youtubeVideoId) { return null }

  const videoWidth = 50;
  const videoAspectRatio = 16/9;

  return (
    <React.Fragment>
      <main>
        <div className={styles.description}>
          <Box sx={{ flexGrow: 1 }}>
            <CssBaseline />
            <AppBar position="static" style={{ backgroundColor: '#537188' }}>
              <Toolbar>
                <h2> FocusEd Platform </h2>
              </Toolbar>
            </AppBar>
            <Drawer anchor="right" variant="permanent">
              <div style={{ width: '275px', textAlign: 'center' }}>
                <h2 style={{ color: '#537188' }}>Course Resources</h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="https://omscs.gatech.edu/sites/default/files/images/people/buzz.jpg" alt="" style={{ marginRight: '10px', width: '70px' }} />
                <a href="https://omscs6460.gatech.edu/research-guide/getting-started-with-cs6460/" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
                  Getting Started with CS6460
                </a>
              </div>
              </div>
            </Drawer>
            <Box component="main">
              <div style={{ width: 'calc(100% - 275px)', display: 'flex', flexWrap: 'wrap', padding: '16px', justifyContent: 'center' }}>
                <Box sx={{ flex: `0 0 ${videoWidth}vw`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div id="player" style={{ width: '100%', height: `${videoWidth / videoAspectRatio}vw` }}></div>
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <Button variant="contained" color="primary" style={{ backgroundColor: '#E1E1E1', color: 'black' }} onClick={handleExecuteDistractionStatus}>
                      Enable Engagement Tracking
                    </Button>
                  </div>
                </Box>
                <Box sx={{ flex: '0 0 500px', minWidth: '300px', maxWidth: '500px', paddingLeft: '16px', paddingRight: '16px', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Display question form if applicable */}
                  {showQuestionForm && questionData && (
                    <Box sx={{height: '100%' }}>
                      <QuestionForm questionData={questionData} onSubmitAnswer={handleSubmittedAnswer} />
                      {/* Display feedback after the user has submitted the answer */}
                      {showFeedback && (
                        <div>
                          <h2>{isAnswerCorrect ? 'Correct answer! You may proceed!' : 'Wrong answer. Please pay attention to the video.'}</h2>
                        </div>
                      )}
                    </Box>
                  )}
                </Box>
              </div>
              <div style={{ flexBasis: '100%', height: '0px' }}></div>
              {/* Display captions */}
              <Box sx={{ flexGrow: 1, textAlign: 'center', width: '80%' }}>
                <h2>Transcript</h2>
                <p>{captions}</p>
              </Box>
            </Box>
          </Box>
        </div>
        <canvas id='glanceTrackerCanvas'></canvas>
      </main>
    </React.Fragment>
  );
};