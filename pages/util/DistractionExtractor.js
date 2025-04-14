// Function to fetch the distraction status
/*export const fetchDistractionStatus = async () => {
    try {
      console.log("Fetching Distraction Status");
      const response = await fetch(`/api/distraction/get_status`);
      
      console.log(response);
      const { label } = response.data;
      // Use the distraction status received from the server (label)
      console.log('Distraction status:', label);
      // Handle the distraction status as needed (e.g., update UI)
      updateDistractionStatus(label);
    } catch (error) {
      console.error('Error fetching distraction status:', error);
    }
}; */

export const executeDistractionStatus = async (action) => {
  try {
    console.log("Execute Distraction Status");
    const url = `/api/distraction/execute_distraction?action=${action}`; // Add the action parameter to the URL

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to run distraction script');
    }

    console.log("distraction execute woo");
  } catch (error) {
    console.error('Error fetching distraction status:', error);
  }
};


  /*
export const fetchDistractionStatus = async () => {
    try {
      console.log("Fetching Distraction Status");
      const response = await fetch('/api/distraction/get_distraction');
      
      if (!response.ok) {
        throw new Error('Failed to fetch distraction status');
      }
      console.log("distraction woo");
      const data = await response.json();
      const label = data.distractionStatus; // Assuming the distraction status is in the 'status' property of the response
      console.log(label);
      return label
      // Handle the distraction status as needed (e.g., update UI)
    } catch (error) {
      console.error('Error fetching distraction status:', error);
    }
  }; */

  export const fetchDistractionStatus = async () => {
    try {
      //console.log("Fetching Distraction Status");
      const response = await fetch('/api/distraction/get_distraction', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch distraction status');
      }
      
      const data = await response.json();
      //console.log(data.distractionStatus);
      const receivedLabel = data.distractionStatus;
      console.log('Received label from the server:', receivedLabel);
  
      // Handle the receivedLabel as needed (e.g., update UI)
      return receivedLabel;
  
    } catch (error) {
      console.error('Error fetching distraction status:', error);
      // Return an appropriate value or handle the error further if needed
      return null;
    }
  };
  
  



// avoids Build optimization failed: found pages without a React Component as default export in 
export default function Ignore() {
  return <>{/* nothing */}</>;
}