import React from 'react';

interface ConceptNameInputProps {
    conceptName: string;
    setConceptName: (albumName: string) => void;

}

const ConceptNameInput: React.FC<ConceptNameInputProps> = ({ conceptName, setConceptName }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label htmlFor="conceptName">Concept Name:</label>
            <input
                id="conceptName"
                type="text"
                className="formInput"
                placeholder="Please enter your concept name"
                value={conceptName}
                onChange={(event) =>
                    setConceptName(event.target.value)
                }
            />
        </div>
    );
};

export default ConceptNameInput;