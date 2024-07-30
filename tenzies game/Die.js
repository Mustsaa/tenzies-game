import React from "react";

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    };

    const dots = Array(props.value).fill(null).map((_, index) => (
        <span key={index} className="dot"></span>
    ));

    return (
        <div
            className="die-face"
            style={styles}
            onClick={props.holdDice}
        >
            <div className="dots-container">
                {dots}
            </div>
        </div>
    );
}
