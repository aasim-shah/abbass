
document.addEventListener('DOMContentLoaded', function () {
    // Select the form and table elements
    const searchForm = document.querySelector('.search_form');
    const searchResultsTable = document.querySelector('.search_results table tbody');

    // Add a submit event listener to the form
    searchForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the form from submitting in the traditional way

        const searchTerm = document.getElementById('searchBox').value;

        try {
            const response = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchTerm }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const data = await response.json();

            // Clear existing table rows
            searchResultsTable.innerHTML = '';

            // Update the table with the new data
            data.forEach((album, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
          <td><button class="add-to-playlist" data-index="${index}">∔</button></td>
            <td>${album.trackName}</td>
            <td>${album.collectionName}</td>
            <td><img src="${album.artworkUrl100}" alt="${album.collectionName}"></td>
          `;
                searchResultsTable.appendChild(row);
                const addToPlaylistButtons = document.querySelectorAll('.add-to-playlist');
                addToPlaylistButtons.forEach(button => {
                  // Check if the button already has an event listener
                  if (!button.hasEventListener) {
                    button.hasEventListener = true; // Set a flag to indicate that the event listener is attached
                    button.addEventListener('click', function () {
                      const selectedIndex = this.dataset.index;
                      const selectedAlbum = data[selectedIndex];
          
                      const playlist = JSON.parse(localStorage.getItem('playlist')) || [];
                      const isSongInPlaylist = playlist.some(song => song.trackId === selectedAlbum.trackId);
          
                      if (!isSongInPlaylist) {
                        playlist.push(selectedAlbum);
                        localStorage.setItem('playlist', JSON.stringify(playlist));
                        window.location.reload()
                      } else {
                        alert(`${selectedAlbum.trackName} is already in the playlist.`);
                      }
                    });
                  }
                });
                });
        } catch (error) {
            console.error(error);
        }
    });
});















// get all data from localStorage
  document.addEventListener('DOMContentLoaded', function () {
    // Function to render the playlist table
    function renderPlaylistTable() {
      const playlistTableBody = document.getElementById('playlistTableBody');
      const playlist = JSON.parse(localStorage.getItem('playlist')) || [];

      console.log({playlist})
     
      // Clear existing table rows
      playlistTableBody.innerHTML = '';

      // Update the table with the playlist data
      playlist.forEach((song, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <button class="remove-from-playlist" data-index="${index}">−</button>
            <button class="move-up" data-index="${index}">⮝</button>
            <button class="move-down" data-index="${index}">⮟</button>
          </td>
          <td>${song.trackName}</td>
          <td>${song.collectionName}</td>
          <td><img src="${song.artworkUrl100}" alt="${song.collectionName}"></td>
        `;
        playlistTableBody.appendChild(row);
      });

      // Add event listeners to "Remove", "Move Up", and "Move Down" buttons
      const removeFromPlaylistButtons = document.querySelectorAll('.remove-from-playlist');
      const moveUpButtons = document.querySelectorAll('.move-up');
      const moveDownButtons = document.querySelectorAll('.move-down');

      removeFromPlaylistButtons.forEach(button => {
        button.addEventListener('click', function () {
          const selectedIndex = this.dataset.index;
          // Remove the selected song from the playlist
          playlist.splice(selectedIndex, 1);
          // Save the updated playlist to localStorage
          localStorage.setItem('playlist', JSON.stringify(playlist));
          // Re-render the playlist table
          renderPlaylistTable();
        });
      });

      moveUpButtons.forEach(button => {
        button.addEventListener('click', function () {
          const selectedIndex = this.dataset.index;
          if (selectedIndex > 0) {
            // Swap the selected song with the one above it
            [playlist[selectedIndex - 1], playlist[selectedIndex]] = [playlist[selectedIndex], playlist[selectedIndex - 1]];
            // Save the updated playlist to localStorage
            localStorage.setItem('playlist', JSON.stringify(playlist));
            // Re-render the playlist table
            renderPlaylistTable();
          }
        });
      });

      moveDownButtons.forEach(button => {
        button.addEventListener('click', function () {
          const selectedIndex = this.dataset.index;
          if (selectedIndex < playlist.length - 1) {
            // Save the selected song
            const selectedSong = playlist[selectedIndex];
            // Remove the selected song from its current position
            playlist.splice(selectedIndex, 1);
            // Insert the selected song one position below its original position
            playlist.splice(selectedIndex + 1, 0, selectedSong);
            // Save the updated playlist to localStorage
            localStorage.setItem('playlist', JSON.stringify(playlist));
            // Re-render the playlist table
            renderPlaylistTable();
          }
        });
      });
      
    }

    // Initial rendering of the playlist table
    renderPlaylistTable();
  });