const API_TOKEN ="token goes here";

let artist = document.getElementById("searchBar");

document.getElementById("searchButton").addEventListener("click", function () {
  if (artist.value.trim().length === 0) {
    document.getElementById(
      "artistsList"
    ).innerHTML = `<p id="error" class="text-red-600 text-lg">
         Artist not found
       </p>`;
    return;
  }

  fetch(`https://api.spotify.com/v1/search?q=${artist.value}&type=artist`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  })
    .then((response) => response.json())
    .then((artistData) => {
      document.getElementById("artistsList").innerHTML = "";

      const findArtist = artistData.artists?.items.find((art) => {
        const pattern = new RegExp(artist.value, "i");
        return pattern.test(art.name);
      });

      if (findArtist) {
        const { name, genres, followers, external_urls, images, id } =
          findArtist;
        fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=FR`, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        })
          .then((response) => response.json())
          .then((tracksData) => {
            document.getElementById("artistsList").innerHTM = ``;
            document.getElementById("artistsList").innerHTML += `
                <figure class="md:flex md:flex-col mt-16 md:mt-0 bg-slate-800 rounded-xl p-8 md:p-0 w-4/12 max-w-xs md:max-w-md">
                    <img class="w-24 h-24 -mt-16 md:-mt-0 ring-4 md:ring-0 md:w-full object-cover md:rounded-t-xl md:h-48 md:rounded-none rounded-full mx-auto"
                        src="${images[0].url}" alt="" width="384" height="512"
                    />
                    <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
                    <figcaption class="font-medium">
                        <a href="${
                          external_urls.spotify
                        }" class="text-lg text-sky-100 font-medium">
                        ${name}
                        </a>
                        <div class="text-slate-700 dark:text-slate-500">
                        ${genres.join(", ")}
                        </div>
                        <div class="text-yellow-700 dark:text-yellow-500">
                        ${followers.total} followers
                        </div>
                        <div>
                            <div class="text-sky-500 dark:text-sky-400 mt-2"> Top 10 tracks</div>
                            <div id="trackList${id}">
                            </div>
                        </div>
                    </figcaption>
                    </div>
                </figure>
            `;
            const trackList = document.getElementById(`trackList${id}`);
            tracksData.tracks.forEach((e) => {
              const a = document.createElement("a");
              a.classList.add(
                "block",
                "p-2",
                "bg-lime-500",
                "rounded-md",
                "m-2",
                "text-sm",
                "music"
              );
              a.setAttribute("href", e.external_urls.spotify);
              a.innerText = "▶ " + e.name;
              trackList.appendChild(a);
            });
          });
      }
    });
  artist.value = "";
});

