import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

const ScrollToTopArrow = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 150) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div
      className={`${
        isVisible ? "block" : "hidden"
      } fixed bottom-8 right-8 cursor-pointer bg-purple-600 p-2 rounded-full text-white z-10`}
      style={{
        width: "37px", // Set the width to make it circular
        height: "37px", // Set the height to make it circular
        borderRadius: "50%", // Make it circular using border-radius
      }}
      onClick={scrollToTop}
    >
      <FontAwesomeIcon icon={faChevronUp} className="h-5 w-5" />
    </div>
  );
};

export default ScrollToTopArrow;
