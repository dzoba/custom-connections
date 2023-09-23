import React, { useState } from 'react';
import LZString from 'lz-string';

function Create() {
  const [groups, setGroups] = useState([
    { title: 'Fruits', words: ['Apple', 'Banana', 'Cherry', 'Date'] },
    { title: 'Video Game Makers', words: ['Atari', 'Sega', 'Nintendo', 'Sony'] },
    { title: 'Cuisines', words: ['Thai', 'Indian', 'Chinese', 'Italian'] },
    { title: 'Planets', words: ['Mercury', 'Venus', 'Earth', 'Mars'] },
  ]);
  const [link, setLink] = useState('');

  const handleTitleChange = (e, groupIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].title = e.target.value;
    setGroups(newGroups);
  };

  const handleWordChange = (e, groupIndex, wordIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].words[wordIndex] = e.target.value;
    setGroups(newGroups);
  };

  const compressGroups = () => {
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(groups));
    const url = window.location.href + "play?data=" + compressed;
    setLink(url);

    // Copy to clipboard
    copyToClipboard(url);

  };

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Custom Connections</h1>
      <p className="mb-6">
        Enter words in the groups below, and generate a link to share the game.
      </p>
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-6">
          <h2 className="text-xl mb-2">Group {groupIndex + 1}</h2>
          <input
            value={group.title}
            onChange={(e) => handleTitleChange(e, groupIndex)}
            placeholder={`Title ${groupIndex + 1}`}
            className="w-full p-2 mb-2 border rounded-md"
          />
          {group.words.map((word, wordIndex) => (
            <input
              key={wordIndex}
              value={word}
              onChange={(e) => handleWordChange(e, groupIndex, wordIndex)}
              placeholder={`Word ${wordIndex + 1}`}
              className="w-full p-2 my-1 border rounded-md"
            />
          ))}
        </div>
      ))}
      {link && (
        <a href={link} className="block mt-4 text-blue-500 hover:underline">
          {link}
        </a>
      )}
      <button onClick={compressGroups} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Generate Link
      </button>
    </div>
  );
}

export default Create;
