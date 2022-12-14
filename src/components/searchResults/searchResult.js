import React from "react";
import TrackList from "../trackList/trackList";
import './searchResult.css'

//Expects a list of tracks as props
export default class SearchResults extends React.Component {
    render() {
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} togglePlay={this.props.togglePlay} playingTrack={this.props.playingTrack} />
            </div>
        )
    }
}