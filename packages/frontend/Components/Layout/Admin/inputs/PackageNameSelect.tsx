


import React from 'react';

interface PackageNameSelectProps {
    packageName: string;
    setPackageName: (albumName: string) => void;

}

const PackageNameSelect: React.FC<PackageNameSelectProps> = ({ packageName, setPackageName }) => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <label htmlFor="packageName">Package Name:</label>
            <select
                id="packageName"
                className="formInput"
                value={packageName}
                onChange={(event) => setPackageName(event.target.value)}
            >
                <option value="" disabled>Please select a package</option>
                <option value="Personal">Personal</option>
                <option value="Couple">Couple</option>
                <option value="Wedding">Wedding</option>
            </select>
        </div>
    );
};

export default PackageNameSelect;