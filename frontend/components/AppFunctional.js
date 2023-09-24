import axios from "axios";
import React, { useState } from "react";

// önerilen başlangıç stateleri
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    let x = Math.floor(index % 3) + 1; //? Kalan 0,1,2 geldiği için yuvarlama yapmana gerek yok!
    let y = Math.floor(index / 3) + 1; //? Bölüm 0,... 1,... 2,... gibi küsüratlı sayı olduğu için yuvarlamalıyız!

    return { x, y };
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    const { x, y } = getXY();
    return `Koordinatlar (${x},${y})`;
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function sonrakiIndex(direction) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    let newIndex;

    switch (direction) {
      case "yukarı":
        newIndex = index - 1;
        setSteps(steps + 1); //! koordinat devam ediyor.
        break;
      case "sağ":
        newIndex = index + 3;
        setSteps(steps + 1);
        break;
      case "aşağı":
        newIndex = index + 1;
        setSteps(steps + 1); //! koordinat devam ediyor.
        break;
      case "sol":
        newIndex = index - 3;
        setSteps(steps + 1);
        break;
    }
    if (newIndex >= 0 && newIndex < 9) {
      return newIndex;
    }
    return index;
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    const { id: yon } = evt.target;
    if (getXY().y === 1 && yon === "yukarı") {
      setMessage("You can't go up");
    } else if (getXY().y === 3 && yon === "aşağı") {
      setMessage("You can't go down");
    } else if (getXY().x === 1 && yon === "sol") {
      setMessage("You can't go left");
    } else if (getXY().x === 3 && yon === "sağ") {
      setMessage("You can't go right");
    } else {
      sonrakiIndex(direction);
    }
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    e.preventDefault();
    axios
      .post("http://localhost:9000/api/result")
      .then((res) => {
        setMessage(res.data.message);
        setEmail("");
      })
      .catch((err) => {
        setMessage(err.res.data.message);
      });
  }
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>
          SOL
        </button>
        <button id="up" onClick={ilerle}>
          YUKARI
        </button>
        <button id="right" onClick={ilerle}>
          SAĞ
        </button>
        <button id="down" onClick={ilerle}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          value={email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
