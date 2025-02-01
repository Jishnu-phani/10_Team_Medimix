import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faStop,
  faUpload,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import "./styles_record.css";

const DoctorPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [patientphno, setpatientphno] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunksRef.current = [];
      });

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async () => {
    if (!audioUrl) return;

    const audioBlob = await fetch(audioUrl).then((r) => r.blob());
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.mp3");
    formData.append("doctorName", doctorName);
    formData.append("patientphno", patientphno);

    try {
      const response = await fetch("http://localhost:5000/upload_audio", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
      transcribeAudio(audioBlob);
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.mp3");

    try {
      const response = await fetch("http://localhost:5000/transcribe_audio", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setTranscription(data.transcription);
      setShowPopup(true);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const saveTranscript = async () => {
    try {
      const response = await fetch("http://localhost:5000/save_transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorName,
          patientphno,
          transcript: transcription,
        }),
      });
      const data = await response.json();
      alert(data.message);
      setShowPopup(false);
    } catch (error) {
      console.error("Error saving transcript:", error);
    }
  };

  return (
    <div className="record-container">
      
      <input
        type="text"
        placeholder="Enter Doctor Name"
        className="record-text-field"
        value={doctorName}
        onChange={(e) => setDoctorName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Enter patient Phone Number"
        className="record-text-field"
        value={patientphno}
        onChange={(e) => setpatientphno(e.target.value)}
        required
      />

      <button
        className={`record-button ${isRecording ? "disabled" : ""}`}
        onClick={startRecording}
        disabled={isRecording}
      >
        <FontAwesomeIcon icon={faMicrophone} /> Start Recording
      </button>
      <button
        className={`record-button ${!isRecording ? "disabled" : ""}`}
        onClick={stopRecording}
        disabled={!isRecording}
      >
        <FontAwesomeIcon icon={faStop} /> Stop Recording
      </button>
      <button className="record-button" onClick={uploadAudio} disabled={!audioUrl}>
        <FontAwesomeIcon icon={faUpload} /> Upload Audio
      </button>
      <button className="record-button" onClick={playAudio} disabled={!audioUrl}>
        <FontAwesomeIcon icon={faPlay} /> Play Audio
      </button>

      {showPopup && (
        <div
          className="popup-overlay"
          onClick={(e) => {
            if (e.target.className === "popup-overlay") {
              setShowPopup(false);
            }
          }}
        >
          <div className="popup-box">
            <button
              className="close-popup-btn"
              onClick={() => setShowPopup(false)}
            >
              X
            </button>
            <h3>Edit Text</h3>
            <textarea
              id="editableText"
              placeholder="Type something here..."
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
            />
            <button className="record-button" onClick={saveTranscript}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPage;
