/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  const url = 'https://api.tvmaze.com/search/shows';
  try {
    const response = await axios.get(url, {params: {q: query}});
    const shows = response.data.map(data => {
      let show = data.show;
      return {
        id: show.id,
        name: show.name,
        summary: show.summary,
        image: show.image ? show.image.original : 'https://tinyurl.com/tv-missing'
      };
    })
    return shows;
  } catch (err) {
    alert(err);
  }
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-info episodes-button">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);

  $("#search-query").val('');
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(id) {
  const url = `https://api.tvmaze.com/shows/${id}/episodes`
  try {
    const response = await axios.get(url);
    const episodes = response.data.map(episode => {
      return {
        id: episode.id,
        name: episode.name,
        season: episode.season,
        number: episode.number,
        image: episode.image ? episode.image.original : 'https://tinyurl.com/tv-missing'
      }
    });
    return episodes;
  } catch (err) {
    alert(err);
  }
}

function populateEpisodes(episodes) {
  const $episodesList = $('#episodes-list');
  $episodesList.empty();

  $episodesList.append(`
    <div class=col-md-6 col-lg-3 Episodes">
    </div>
  `);

  for (let episode of episodes) {
    let $item= $(`
      <div class="col" data-episode-id="${episode.id}">
        <img class="card-img-top" src="${episode.image}">
        <div class="card-body">
          <h5 class="card-title">${episode.name}</h5>
          <p class="card-text">season ${episode.season} - episode ${episode.number})</p>
        </div>
      </div>
    `)
    $episodesList.append($item)
  }
  $("#episodes-area").show();
}

$('#shows-list').on('click', '.episodes-button', async function handleEpisode (evt) {
  evt.preventDefault();

  let id = $(evt.target).parent().parent().data('show-id');
  
  let episodes = await getEpisodes(id);

  populateEpisodes(episodes);
});
