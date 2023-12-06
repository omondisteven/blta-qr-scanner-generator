//App.js
import React, { Fragment, useState } from "react";
import { Scan } from "./scan";
import { Root, Footer, GlobalStyle, Result } from "./css/styles";
import { initializeAudio } from "./helper";
import { Button } from "./scan/styles";
import { useHistory, Link } from 'react-router-dom';  // Import Link from 'react-router-dom'
import { useSelector } from "react-redux";
import { useQueryState } from "./hooks/useQueryState";
import { encryptMessage, encodeEncryptedMessageAsBase64 } from "@maslick/kameroon";
// Import BrowserRouter and Route from react-router-dom
import { BrowserRouter as Router, Route } from "react-router-dom";

export default function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [result, setResult] = useState();
  const [redirect_url] = useQueryState("redirect_url");
  const [publicKey] = useQueryState("public_key");

  const beep = useSelector(state => state.prefs.beep);
  const crossHair = useSelector(state => state.prefs.crossHair);
  const crossHairStyle = useSelector(state => state.prefs.crossHairStyle);
  const bw = useSelector(state => state.prefs.bw);

  const onCapture = async (code) => {
    if (redirect_url && publicKey) {
      const encryptedMessage = await encryptMessage(decodeURIComponent(publicKey), code.rawcode);
      const encryptedMessageBase64 = encodeEncryptedMessageAsBase64(encryptedMessage);
      const base64urlEncodedMessage = encodeURIComponent(encryptedMessageBase64);
      setTimeout(() => {
        window.location.replace(`${redirect_url}?code=${base64urlEncodedMessage}`);
      }, 300);
    } else
      setResult(code);
  };

  const onClear = () => setIsCameraOpen(false);
  const { push } = useHistory();

  const handleStartScanBtn = () => {
    initializeAudio();
    setIsCameraOpen(true);
    setResult(undefined);
  };

  const handleStopScanBtn = () => {
    setIsCameraOpen(false);
    setResult(undefined);
  };

  const handleGenerateQRBtn = () => {
    console.log('Navigating to /generator_index.html');
    // Use push to navigate to the "/generator_index.html" route
    push("/generator_index.html");
    
     // Reload the page after navigating
    window.location.reload();
  };

  const renderHelp = () => {
    if (!isCameraOpen && !result)
      return (
        <div style={{ paddingTop: 10 }}>
          <h3>Welcome to...</h3>
          <img src="./bltaqr_logo.png" alt="BLTA Logo" style={{ width: '200px', marginBottom: '20px', marginTop: '20PX' }} />
          
          <h3><a href="https://bltasolutions.co.ke">BLTA QR CODES SCANNER DAPP</a>!</h3>
          <br></br>
          <br></br>
          <p>Goood News!! Your QR Codes are now end-to-end encrypted</p>         
        </div>
      );
  };

  const renderCamera = () => {
    if (isCameraOpen) return (
      <Scan
        onCapture={onCapture}
        onClear={onClear}
        beepOn={beep}
        bw={bw}
        scanRate={200}
        crosshair={{ enabled: crossHair, style: crossHairStyle }}
      />
    );
  };

  const renderResult = () => {
    if (result) return (
      <Result>
        <p>{result['rawcode']}</p>
        <div><b>{result['alg']}:</b> {result['milliseconds']} ms</div>
        <div><b>type</b>: {result["type"]}</div>
      </Result>
    );
  };

  const renderSettingsButton = () => {
    if (!isCameraOpen || result) return (
      <Button style={{ backgroundColor: "green" }} onClick={async () => push("/config")}>Settings</Button>
    );
  };

  return (
    <div class = "container">
        <Router>
      
          <Fragment>
            <Root>
              <div style={{ minHeight: 430, margin: 20 }}>
                {renderHelp()}
                {renderResult()}
                {renderCamera()}
              </div>

              <Footer>
                <div>
                  {!isCameraOpen ?
                    <>
                      <Button onClick={handleStartScanBtn}>Scan Qr Code</Button>
                      <Button style={{ backgroundColor: "blue" }} onClick={handleGenerateQRBtn}>Generate Qr Code</Button>
                    </> :
                    <Button onClick={handleStopScanBtn} style={{ backgroundColor: "red", width: '100%' }}>Cancel</Button>
                  }
                </div>
                <div style={{ flexBasis: "100%", height: 0 }}></div>
                {renderSettingsButton()}
              </Footer>
            </Root>
            <GlobalStyle />
          </Fragment>
          <Route path="/generator_index.html" render={() => <iframe src="/public/generator_index.html" style={{ width: '100%', height: 'calc(100vh - 40px)', border: 'none' }} />} />
        </Router>
      </div>
    
  );
}
