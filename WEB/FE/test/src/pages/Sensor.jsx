import React, { useEffect, useState } from "react";
import Graph from "../components/Graph";
import Graph1 from "../components/Graph1";

function Sensor() {
  const [sensor, setSensor] = useState([]);
  const [gases, setGases] = useState([]);
  const [isAlerted, setIsAlerted] = useState(false);

  useEffect(() => {
    fetch("https://i7a208.p.ssafy.io/api/v1/sensors/")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data)
        const last = data.length - 1; // 가장 최신 데이터 값 불러옴
        const lastdata = data[last];
        setSensor(lastdata);
        console.log(lastdata);
      });
  }, []);

  if (sensor.gas===0 && isAlerted===false) {
    setIsAlerted(true)
    alert("위험해요! 가스가 누출됐어요!")
  };


  return (
    <div>
      {/* 제목 */}
      <br />
      <br />
      <h1
        style={{
          textDecoration: "underline",
          textDecorationColor: "#a6eae2",
          textDecorationThickness: 5,
        }}
      >
        지금 우리집은?
      </h1>

      {/* 감지 시각 알림 */}
      <div>
        <p style={{ color: "#696969", fontSize: "8px" }}>
          감지 시각: {sensor["datetime"]}
        </p>
      </div>

      {/* 현재 온도*/}
      <div>
        <span style={{ fontSize: "4vw" }}>현재 온도: </span>
        <span style={{ fontSize: "4vw", backgroundColor: "#FCEBA4" }}>
          {sensor["temperature"]} °C
        </span>
        <div style={{ marginLeft: "10%", zIndex: "-1", position:"relative" }}>
          <Graph />
        </div>
      </div>

      {/* 현재 습도 */}
      <span style={{ fontSize: "4vw" }}>현재 습도: </span>
      <span style={{ backgroundColor: "#C7E6FD", fontSize: "4vw" }}>
        {sensor["humidity"]} %
      </span>

      <br />
      <div style={{ marginLeft: "10%", zIndex: "-1", position:"relative"  }}>
        <Graph1 />
      </div>

      {/* 가스 감지 */}
      {sensor["gas"] === 0 ? (
        <span>
          <span style={{ fontSize: "4vw" }}>현재 가스 상태: </span>
          <span
            style={{
              color: "red",
              backgroundColor: "#FBE7FF",
              fontSize: "4vw",
            }}
          >
            위험해요!
          </span>
        </span>
      ) : (
        <span>
          <span style={{ fontSize: "4vw", marginBottom: "4vw" }}>
            현재 가스 상태:{" "}
          </span>
          <span
            style={{
              color: "blue",
              fontSize: "4vw",
              backgroundColor: "#D3F9C0",
            }}
          >
            안전해요!
          </span>
        </span>
      )}
      <br />

      <div
        style={{
          marginLeft: "5rem",
          marginRight: "5rem",
          marginBottom: "5rem",
        }}
      ></div>
    </div>
  );
}

export default Sensor;
