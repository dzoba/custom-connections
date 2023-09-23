import React, { useState, useEffect } from 'react';
import LZString from 'lz-string';
import JSConfetti from 'js-confetti';

const deepCopy = (data) => JSON.parse(JSON.stringify(data));
const jsConfetti = new JSConfetti();

function Play() {
  const [originalGroups, setOriginalGroups] = useState([]); // NEW
  const [displayGroups, setDisplayGroups] = useState([]);  // NEW
  const [selectedWords, setSelectedWords] = useState([]);
  const [solvedCategories, setSolvedCategories] = useState([]);
  const [isIncorrectGuess, setIsIncorrectGuess] = useState(false);
  const [hasWon, setHasWon] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const compressedData = params.get('data');
    if (compressedData) {
      try {
        const decompressed = JSON.parse(LZString.decompressFromEncodedURIComponent(compressedData));
        setOriginalGroups(decompressed);
        const displayWords = shuffle([...decompressed.flatMap(group => group.words)]);
        const displayGroupsData = deepCopy(decompressed);
        for (let group of displayGroupsData) {
          group.words = displayWords.splice(0, 4);
        }
        setDisplayGroups(displayGroupsData);
      } catch (error) {
        console.error('Error decompressing the data', error);
      }
    }
  }, []);

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleShuffle = () => {
    // Derive the words from displayGroups instead of originalGroups
    const displayWords = shuffle([...displayGroups.flatMap(group => group.words)]);

    // Using a copy of displayGroups to reassign the shuffled words
    const shuffledDisplayGroups = deepCopy(displayGroups);

    for (let group of shuffledDisplayGroups) {
      group.words = displayWords.splice(0, group.words.length); // Assign as many words as are currently in the group
    }

    setDisplayGroups(shuffledDisplayGroups);
  };


  const toggleWordSelection = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords((prevSelected) => prevSelected.filter((w) => w !== word));
    } else if (selectedWords.length < 4) {
      setSelectedWords((prevSelected) => [...prevSelected, word]);
    }
  };

  const handleSubmit = () => {
    const matchingGroup = originalGroups.find(group => selectedWords.every(word => group.words.includes(word)));

    if (matchingGroup) {
      setSolvedCategories(prevCategories => [...prevCategories, matchingGroup]);

      // Instead of removing based on the title, ensure you remove the exact selected words
      setDisplayGroups(prevDisplayGroups => {
        return prevDisplayGroups.map(group => {
          // If the group contains any of the selected words, remove those words from the group
          return {
            ...group,
            words: group.words.filter(word => !selectedWords.includes(word))
          };
        }).filter(group => group.words.length > 0); // Only include groups which still have words left
      });

      setSelectedWords([]);
      if (solvedCategories.length + 1 === originalGroups.length) {
        jsConfetti.addConfetti();
        setHasWon(true);
      }
    } else {
      setIsIncorrectGuess(true);
      setTimeout(() => {
        setIsIncorrectGuess(false);
      }, 2000); // Display the incorrect guess message for 2 seconds
    }
  };


  return (
    <div className="p-4">

      {hasWon ? (
        <div className="absolute top-0 left-0 w-full h-full bg-white z-50 flex flex-col justify-center items-center">
          <h2 className="text-4xl mb-4">You Win!</h2>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Make your own
          </button>
        </div>
      ) : (
        <>
          {solvedCategories.map((category, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-md mb-2 flex justify-between border border-gray-400">
              <span>{category.title}</span>
              <span>{category.words.join(', ')}</span>
            </div>
          ))}
          <div className="grid grid-cols-4 gap-4">
            {displayGroups.flatMap((group) => group.words).map((word, index) => (
              <div
                key={index}
                className={`py-4 rounded-md text-center cursor-pointer ${selectedWords.includes(word) ? 'bg-gray-500' : 'bg-gray-300'
                  }`}
                onClick={() => toggleWordSelection(word)}
              >
                {word}
              </div>
            ))}
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={handleShuffle}
            >
              Shuffle
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          {isIncorrectGuess && <div className="text-red-500 mt-4">Incorrect guess</div>}
        </>
      )}


    </div>
  );
}

export default Play;
