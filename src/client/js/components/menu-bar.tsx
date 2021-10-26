import React from 'react';

function MenuBar({setActiveView}: {setActiveView: (name: string) => void}) {
    return (
        <div className="menuBar">
            <span id="switchview-measure" onClick={() => setActiveView('measure')}>g</span>
            <span id="switchview-settings" onClick={() => setActiveView('settings')}>i</span>
        </div>
    );
}

export default MenuBar;
