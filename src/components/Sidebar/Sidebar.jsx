import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

export const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const {
    onSent,
    prevPrompts,
    setRecentPrompt,
    newChat,
    isClassAdded,
    setIsClassAdded,
    setPrevPrompts,
  } = useContext(Context);
  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [showTooltip3, setShowTooltip3] = useState(false);
  const [showTooltip4, setShowTooltip4] = useState(false);
  const [showTooltip5, setShowTooltip5] = useState(false);
  const [activeTooltipIndex, setActiveTooltipIndex] = useState(null);
  const [activeDeleteIndex, setActiveDeleteIndex] = useState(null);

  const handleThreeDotsClick = (index) => {
    setActiveDeleteIndex(activeDeleteIndex === index ? null : index);
  };

  const handleDeletePrompt = (index) => {
    setPrevPrompts(prevPrompts.filter((_, i) => i !== index));
  };

  return (
    <div className={`sidebar ${extended ? "extended" : ""}`}>
      <div className="top">
        <img
          onClick={() => {
            setExtended((prev) => !prev);
            setShowTooltip(false);
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="menu"
          src={assets.menu_icon}
          alt=""
        />
        {showTooltip && <div className="tooltip">Expand menu</div>}
        <div
          onClick={() => {
            newChat();
            setShowTooltip2(false);
            setIsClassAdded(false);
          }}
          onMouseEnter={() => setShowTooltip2(true)}
          onMouseLeave={() => setShowTooltip2(false)}
          className={`new-chat ${isClassAdded ? "usefull-newChat" : ""} ${
            extended ? "extended" : ""
          }`}
        >
          <div style={{ position: "relative" }}>
            <svg
              className={`plusIcon ${isClassAdded ? "active" : ""}`}
              fill="#000000"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 455 455"
            >
              <g>
                <polygon
                  points="455,212.5 242.5,212.5 242.5,0 212.5,0 212.5,212.5 0,212.5 0,242.5 212.5,242.5 212.5,455 242.5,455 242.5,242.5 455,242.5"
                  strokeWidth="20"
                />
              </g>
            </svg>
          </div>
          <p>New Chat</p>
          {showTooltip2 && (
            <div className={`tooltip2 ${extended ? "extended" : ""}`}>
              New Chat
            </div>
          )}
        </div>

        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => {
              return (
                <div key={index}>
                  <div
                    onClick={() => loadPrompt(item)}
                    className="recent-entry"
                    onMouseEnter={() => setActiveTooltipIndex(index)}
                    onMouseLeave={() => setActiveTooltipIndex(null)}
                  >
                    <img src={assets.message_icon} alt="" />
                    <p className="qst">
                      {item.length > 18 ? item.slice(0, 23) + "..." : item}
                    </p>
                    <img
                      src={assets.three_dots}
                      className="threedots"
                      alt=""
                      onMouseEnter={() => setActiveTooltipIndex(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleThreeDotsClick(index);
                      }}
                    />
                    {activeTooltipIndex === index && (
                      <div className="tooltip6">
                        {item.length > 18 ? item.slice(0, 30) + "..." : item}
                      </div>
                    )}
                  </div>
                  {activeDeleteIndex === index && (
                    <div
                      className="delete"
                      onClick={() => {
                        handleThreeDotsClick(index);
                        handleDeletePrompt(index);
                        newChat();
                        setIsClassAdded(false);
                      }}
                    >
                      <img src={assets.delete_icon} alt="" />
                      <p>Delete</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className={`bottom ${extended ? "extended" : ""}`}>
        <div
          onMouseEnter={() => setShowTooltip3(true)}
          onMouseLeave={() => setShowTooltip3(false)}
          className="bottom-item recent-entry"
        >
          <img src={assets.question_icon} alt="" />
          <p>Help</p>
          {showTooltip3 && (
            <div className={`tooltip3 ${extended ? "extended" : ""}`}>Help</div>
          )}
        </div>
        <div
          onMouseEnter={() => setShowTooltip4(true)}
          onMouseLeave={() => setShowTooltip4(false)}
          className="bottom-item recent-entry"
        >
          <img src={assets.history_icon} alt="" />
          <p>Activity</p>
          {showTooltip4 && (
            <div className={`tooltip4 ${extended ? "extended" : ""}`}>
              Activity
            </div>
          )}
        </div>
        <div
          onMouseEnter={() => setShowTooltip5(true)}
          onMouseLeave={() => setShowTooltip5(false)}
          className="bottom-item recent-entry"
        >
          <img src={assets.setting_icon} alt="" />
          <p>Settings</p>
          {showTooltip5 && (
            <div className={`tooltip5 ${extended ? "extended" : ""}`}>
              Settings
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
