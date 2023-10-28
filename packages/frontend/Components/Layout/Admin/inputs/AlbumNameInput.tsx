import React from 'react';

interface AlbumNameInputProps {
    albumName: string;
    setAlbumName: (albumName: string) => void;
    albumNameExists: boolean;
}

const AlbumNameInput: React.FC<AlbumNameInputProps> = ({ albumName, setAlbumName, albumNameExists }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label htmlFor="albumName">Album Name:</label>
            <input
                id="albumName"
                type="text"
                className={`formInput ${albumNameExists ? 'border-red-500' : 'border-green-500'}`}
                placeholder="Please enter the album name"
                value={albumName}
                onChange={(event) => setAlbumName(event.target.value)}
            />
        </div>
    );
};

export default AlbumNameInput;