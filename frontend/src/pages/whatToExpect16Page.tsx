import VerticalContainer from "../components/VerticalContainer.tsx";
import WhatToExpect16 from "../components/WhatToExpect16.tsx";

const handleCloseTab = () => {
    window.close(); // Closes the tab if opened by script
};

const WhatToExpect16Page: React.FC = () => {
    return(
        <VerticalContainer>
            <WhatToExpect16/>
            <button onClick={handleCloseTab}>Return to registration</button>
        </VerticalContainer>

    );
};

export default WhatToExpect16Page;