import React from 'react';

const WhatToExpect: React.FC = () => {
    return (
        <div>
            <h1>What to Expect</h1>

            {/* All-Ages Nights Section */}
            <section>
                <h2>All-Ages Nights</h2>
                <p>
                    Our all-ages nights are designed for family-friendly fun. The haunted house
                    experience is thrilling, but toned down in terms of gore and scares, making it
                    perfect for younger guests or those who want a milder experience.
                </p>
                <ul>
                    <li>Spooky Atmosphere with dim lighting and eerie sound effects</li>
                    <li>Friendly Haunts with toned-down costumes and makeup.</li>
                    <li>No Jump Scares — just light spookiness for family fun.</li>
                    <li>Gentle Zones with softer visuals, ideal for younger visitors.</li>
                </ul>
            </section>

            {/* 16+ Night (Sunday) Section */}
            <section>
                <h2>16+ Night (Sunday)</h2>
                <p>
                    For the bravest souls, our 16+ night is where we pull out all the stops. Expect
                    a more intense experience, with bloodier visuals, jump scares, and a terrifying
                    atmosphere designed to make you scream.
                </p>
                <ul>
                    <li>Darker Themes with unsettling, creepy settings.</li>
                    <li>Jump Scares and Startles from actors ready to surprise you.</li>
                    <li>Close Encounters—actors may get close, and static props may brush against you.</li>
                    <li>Scarier Sound Effects with unnerving noises that make you feel watched</li>
                    <li>Disturbing Props including dead bodies, organs, and grotesque scenes.</li>
                </ul>
                <p><strong>Note:</strong> This night is recommended for ages 16 and up due to the graphic content.</p>
            </section>
        </div>
    );
};

export default WhatToExpect;
