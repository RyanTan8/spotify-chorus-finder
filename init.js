const { response } = require("express");
var http = require('http');
const { Client } = require("spotify-api.js");
const ID = '6d51e971f241466a8f9ad82ef3bb1b0d';
const SECRET = 'd5d1d483ea464cf8a26641a5863d37a1';
const client = new Client({
    token: { clientID: ID, clientSecret: SECRET },
    // Ready event is required if you are providing clientID and clientSecret fields.
    // As the client has to create the token first with it and then emits the ready event.
    onReady() {
        // document.getElementById("ready").innerText = "Client ready.";
    }
});
/*
document.querySelector("submit").addEventListener("click", function() {
    document.getElementById("ready").innerText = "aaaaaa";
    printChorus();
});
*/

    // document.getElementById("title").innerText = "6N7cpfN9TaKmVOJSofBa0c";
    // var songLink = "https://open.spotify.com/track/6N7cpfN9TaKmVOJSofBa0c?si=cb72cf05b80c4113";
    // songID = (songLink.split("?si")[0].split("https://open.spotify.com/track/")[1]);
    // songLink = document.getElementById("song").value;
    // songID = (songLink.split("?si")[0].split("https://open.spotify.com/track/")[1]);

    //  getChorus(songID);


async function getChorus(id) {
    var totalRtn = "";
    getData(id).then(track => {
        var rtn = "";
        var artists = "";
        rtn += "\n" + track.name + "\n";
        seconds = track.duration / 1000.0;
        rtn += "\n" + "Duration: " + parseInt(seconds / 60) + " minutes " + Math.floor(seconds % 60) + " seconds\n";
        for(var i = 0; i < track.artists.length - 1; i++) {
            artists += track.artists[i].name + ", ";
        }
        if(track.artists.length > 1)
            artists += track.artists[track.artists.length - 1].name;
        if(track.artists.length == 1)
            artists += track.artists[0].name;
        rtn += "Artists: " + artists + "\n";
        totalRtn += rtn;
    })
    getAA(id).then(data => {
        var rtn = "";
        rtn += ("Tempo: " + data.track.tempo + " bpm\n");
        //console.log(data.sections);
        //console.log(data.track.loudness);

        var maxVolumeIndex = 0;
        for (let i = 0; i < data.segments.length; i++) {
            if (data.segments[i].loudness_max > data.segments[maxVolumeIndex].loudness_max)
                maxVolumeIndex = i
        }
        rtn += ("Loudest segment: Lasts " + data.segments[maxVolumeIndex].loudness_max_time + " seconds, at " + data.segments[maxVolumeIndex].loudness_max + " DB\n");
        let segmentsSeconds = data.segments[maxVolumeIndex - 1].start;

        var maxVolumeIndex = 0;
        for (let i = 0; i < data.sections.length; i++) {
            if (data.sections[i].loudness > data.sections[maxVolumeIndex].loudness)
                maxVolumeIndex = i
        }
        loudestSeconds = data.sections[maxVolumeIndex].start;
        rtn += ("Loudest section: " + parseInt(loudestSeconds / 60) + " minutes " + Math.floor(loudestSeconds % 60) + " seconds\n");
        let sectionsSeconds = data.sections[maxVolumeIndex - 1].start;
        rtn += ("\nChorus: " + parseInt(sectionsSeconds / 60) + " minutes " + Math.floor(sectionsSeconds % 60) + " seconds\n");
        // console.log(rtn);
        totalRtn += rtn;
    })
    await sleep(2000);
    //console.log(totalRtn);
    return totalRtn;
}
async function getData(id) {
    let response = await client.tracks.get(id)
    return response;
}
async function getAA(id) {
    let response = await client.tracks.getAudioAnalysis(id)
    return response;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function printChorus() {
    finalChorus = getChorus("6N7cpfN9TaKmVOJSofBa0c").then(async value => {
        return (value.toString());
    });
}

module.exports = { getChorus };






// songLink = document.getElementById("song").value;
// songID = (songLink.split("?si")[0].split("https://open.spotify.com/track/")[1]);
// document.getElementById("chorus").innerText = songID;
// window.client = client;

// document.getElementById("chorus").innerText = response;



// var songLink = "https://open.spotify.com/track/6N7cpfN9TaKmVOJSofBa0c?si=cb72cf05b80c4113";
// songID = (songLink.split("?si")[0].split("https://open.spotify.com/track/")[1]);
// getChorus(songID);



// getChorus("6SRWhUJcD2YKahCwHavz3X");

// https://open.spotify.com/track/1fBl642IhJOE5U319Gy2Go?si=ce286a2a985e4d1b
// https://open.spotify.com/track/79w5oc04QaB15czB3qO95w?si=227c151ba9d9478e
// https://open.spotify.com/track/46cdw28EXOhDPnD1emDC6T?si=54e8d47b825b4cf8
// https://open.spotify.com/track/4cluDES4hQEUhmXj6TXkSo?si=e5289063f15547a0
// https://open.spotify.com/track/6N7cpfN9TaKmVOJSofBa0c?si=cb72cf05b80c4113 Angel with a Shotgun
// https://open.spotify.com/track/6SRWhUJcD2YKahCwHavz3X?si=a4776a16a8f84390 Darkside








