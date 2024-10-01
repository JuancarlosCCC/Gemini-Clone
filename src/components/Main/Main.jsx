import React, { useContext, useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { useRef, useEffect } from "react";

function Main() {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  const [submited, setSubmited] = useState(false);

  const formSubmited = () => {
    setSubmited(true);
  };

  useEffect(() => {
    if (!input) {
      setSubmited(false);
    }
  }, [input]);

  const [showTooltipUser, setShowTooltipUser] = useState(false);
  const [showTooltipimg, setShowTooltipimg] = useState(false);
  const [showTooltipGallery, setShowTooltipGallery] = useState(false);
  const [showTooltipMicro, setShowTooltipMicro] = useState(false);
  const [showTooltipSubmit, setShowTooltipSubmit] = useState(false);

  /* Start image select */
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [fileExtension, setFileExtension] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fullName = file.name;
      const nameWithoutExtension = fullName.substring(
        0,
        fullName.lastIndexOf(".")
      );
      const extension = fullName.substring(fullName.lastIndexOf(".") + 1);

      setFileName(nameWithoutExtension);
      setFileExtension(extension.toUpperCase());

      console.log("Archivo seleccionado:", file);
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    setFileExtension(null);
    fileInputRef.current.value = null;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  /* End image select */

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const [selectedCard, setSelectedCard] = useState(null);
  const textareaRef = useRef(null);
  const [prevInput, setPrevInput] = useState("");

  const cards = [
    {
      id: 1,
      text: "Suggest beaches to visit in a city, including details",
      icon: assets.compass_icon,
      inputText:
        "Can you suggest me beaches to visit in a city, please include details like price, place, etc.",
    },
    {
      id: 2,
      text: "Briefly summarize this concept: urban planning",
      icon: assets.bulb_icon,
      inputText: "Briefly summarize this concept: urban planning",
    },
    {
      id: 3,
      text: "Brainstorm team bonding activities for our work retreat",
      icon: assets.message_icon,
      inputText:
        "Recommend me a brainstorm of activities to strengthen teamwork during our work retreat",
    },
    {
      id: 4,
      text: "Improve the readability of the following code",
      icon: assets.code_icon,
      inputText: "Improve the readability of the following code",
    },
  ];

  const handleCardClick = (id, inputText) => {
    setSelectedCard(id);
    setInput(inputText);
  };

  const getCardStyle = (id) => {
    return {
      backgroundColor: selectedCard === id ? "#d3e3fd" : "",
    };
  };

  useEffect(() => {
    if (prevInput !== "" && input === "") {
      setSelectedCard(null);
    }
    setPrevInput(input);
  }, [input]);

  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognition = window.webkitSpeechRecognition;
  recognitionRef.current = new SpeechRecognition();
  recognitionRef.current.continuous = true;
  recognitionRef.current.interimResults = true;

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    // Verificar si el navegador soporta reconocimiento de voz
    if (!("webkitSpeechRecognition" in window)) {
      console.log(
        "El reconocimiento de voz no está soportado en este navegador."
      );
      return;
    }

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setInput((prevInput) => prevInput + transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Error en el reconocimiento de voz:", event.error);
      console.error("Código de error:", event.error.code);
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <div>
          <img
            onMouseEnter={() => setShowTooltipUser(true)}
            onMouseLeave={() => setShowTooltipUser(false)}
            src={assets.user_icon}
            alt=""
          />
          {showTooltipUser && <div className="usertooltip">User</div>}
        </div>
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Dev</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="card"
                  onClick={() => handleCardClick(card.id, card.inputText)}
                  style={getCardStyle(card.id)}
                >
                  <p>{card.text}</p>
                  <img src={card.icon} alt="" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <div className="insideSB">
              <textarea
                ref={textareaRef}
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                placeholder="Enter a prompt here"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && input) {
                    e.preventDefault();
                    onSent();
                    formSubmited();
                  }
                }}
              />
              <div>
                <img
                  className="hoverOn"
                  onMouseEnter={() => setShowTooltipGallery(true)}
                  onMouseLeave={() => setShowTooltipGallery(false)}
                  onClick={handleImageClick}
                  src={assets.gallery_icon}
                  alt="Gallery"
                />
                {showTooltipGallery && (
                  <div className="galleryTooltip">Upload Image</div>
                )}
                <img
                  className="hoverOn"
                  onMouseEnter={() => setShowTooltipMicro(true)}
                  onMouseLeave={() => setShowTooltipMicro(false)}
                  src={assets.mic_icon}
                  alt="Microphone"
                  style={{
                    filter: isListening ? "invert(100%)" : "none",
                  }}
                  onClick={handleMicClick}
                />
                {showTooltipMicro && (
                  <div className="microTooltip">Use microphone</div>
                )}
                <img
                  onMouseEnter={() => setShowTooltipSubmit(true)}
                  onMouseLeave={() => setShowTooltipSubmit(false)}
                  className={`hoverOn sendImg ${input ? "" : "goodbye"} ${
                    input && submited ? "bluesky" : ""
                  }`}
                  onClick={() => {
                    if (input) {
                      onSent();
                      formSubmited();
                    }
                  }}
                  src={assets.send_icon}
                  alt="Send"
                />
                {showTooltipSubmit && (
                  <div className="submitTooltip">Submit</div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div>
              {fileName && (
                <div
                  className="selected-file"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div>{fileName}</div>
                  {fileExtension && (
                    <div
                      className="file-extension"
                      onMouseEnter={() => setShowTooltipimg(true)}
                      onMouseLeave={() => setShowTooltipimg(false)}
                    >
                      <img
                        src={assets.image_icon}
                        alt=""
                        className="imgapart"
                      />{" "}
                      {fileExtension}
                      {isHovered && (
                        <svg
                          onClick={handleRemoveFile}
                          className="svgX"
                          fill="#444141"
                          version="1.1"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 460.775 460.775"
                          xml:space="preserve"
                          stroke="#444141"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path>{" "}
                          </g>
                        </svg>
                      )}
                      {showTooltipimg && (
                        <div className="tooltipimg">{`${fileName}.${fileExtension}`}</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses.{" "}
            <a href="https://support.google.com/gemini/answer/13594961?visit_id=638630799773642700-3756768509&p=privacy_notice&rd=1#privacy_notice">
              Your privacy & Gemini Apps
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Main;
