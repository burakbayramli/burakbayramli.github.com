/*
 * Takes raw text input of coordinate data (comma-separated latitude and longitude
 * on each line) and converts it to a GPX XML string.
 * This simulates the core functionality of your gpx.py script.
 */

// Define the XML namespace/schema for GPX
const GPX_HEADER = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" 
    creator="GeoTool by Gemini"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
    <trk>
        <name>Converted Track</name>
        <trkseg>`;
        
const GPX_FOOTER = `
        </trkseg>
    </trk>
</gpx>`;


/**
 * Converts the raw coordinate text input into a GPX XML string.
 */
function convertToGpx() {
    // 1. Get the raw input text from the textarea
    const rawInput = document.getElementById("coords_input").value;
    
    // 2. Initialize the GPX string with the header
    let gpxContent = GPX_HEADER;
    
    // 3. Process the lines of input
    const lines = rawInput.trim().split('\n');
    
    // Iterate through each line to extract lat/lon
    lines.forEach(line => {
        // Clean the line and split by comma or space
        const parts = line.trim().split(/[, ]+/).filter(p => p.length > 0);
        
        // Ensure we have at least two parts (latitude and longitude)
        if (parts.length >= 2) {
            const lat = parseFloat(parts[0]);
            const lon = parseFloat(parts[1]);

            // Validate that the parsed values are numbers
            if (!isNaN(lat) && !isNaN(lon)) {
                // 4. Append a new track point (trkpt) element
                // We use elevation=0 to match the gpx.py script
                gpxContent += `
            <trkpt lat="${lat.toFixed(6)}" lon="${lon.toFixed(6)}">
                <ele>0</ele>
            </trkpt>`;
            }
        }
    });

    // 5. Append the GPX footer
    gpxContent += GPX_FOOTER;

    // 6. Display the result
    displayGpx(gpxContent);
}

/**
 * Displays the generated GPX content in the output div.
 * Also provides a download link.
 */
function displayGpx(gpxString) {
    const outputDiv = document.getElementById("output_area");
    
    // Create a Blob and a URL for the download link
    const blob = new Blob([gpxString], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);

    // Create a user-friendly output
    let outputHTML = `
        <h2>✅ GPX File Generated!</h2>
        <p>You can download the generated file below, or view the raw XML.</p>
        <p>
            <a href="${url}" download="track.gpx" class="download-button">
                Download track.gpx
            </a>
        </p>
        <hr>
        <p><strong>Raw GPX XML Output:</strong></p>
        <pre>${escapeHTML(gpxString)}</pre>
    `;

    outputDiv.innerHTML = outputHTML;
}

/**
 * Helper function to safely escape HTML for display in a <pre> tag.
 */
function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
}

/*
 * Initial setup function (kept for pattern consistency, though empty here)
 */
function init() {
    // Optional: Add a sample coordinate set for ease of testing
    const sample = `41.328127, 28.737938\n41.330000, 28.740000\n41.331500, 28.742000`;
    document.getElementById("coords_input").value = sample;
}
