// ================= ELEMENTS =================
const meterFill    = document.getElementById("meterFill");
const meterCaption = document.getElementById("meterCaption");

const statusIcon   = document.getElementById("statusIcon");
const statusText   = document.getElementById("statusText");
const subStatus    = document.getElementById("subStatus");

const centerBadge  = document.getElementById("centerBadge");
const centerTitle  = document.getElementById("centerTitle");
const centerTimer  = document.getElementById("centerTimer");

const gradeEl      = document.getElementById("grade");
const saltPctEl    = document.getElementById("saltPct");
const saltDescEl   = document.getElementById("saltDesc");
const chipsEl      = document.getElementById("chips");
const stampTimeEl  = document.getElementById("stampTime");

const btnStart     = document.getElementById("btnStart");
const btnStop      = document.getElementById("btnStop");
const btnClear     = document.getElementById("btnClear");

// ================= STATE =================
let running = false;
let timer   = null;
let secondsLeft = 0;

// ================= HELPERS =================
function pad2(n){ return String(n).padStart(2,"0"); }
function nowTime(){
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}
function setMeter(pct){
  meterFill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
}
function setStamp(){
  stampTimeEl.textContent = nowTime();
}

// ================= STATUS =================
function setStatus(mode){
  if (mode === "ready"){
    statusIcon.textContent = "✓";
    statusText.textContent = "พร้อมทำงาน";
    subStatus.textContent  = "กดเริ่มวิเคราะห์ได้เลย";
  }
  if (mode === "running"){
    statusIcon.textContent = "⏳";
    statusText.textContent = "กำลังวิเคราะห์...";
    subStatus.textContent  = "โปรดรอสักครู่";
  }
  if (mode === "done"){
    statusIcon.textContent = "✓";
    statusText.textContent = "ประมวลผลเสร็จสิ้น";
    subStatus.textContent  = "พร้อมแสดงผล";
  }
  if (mode === "stopped"){
    statusIcon.textContent = "⏸";
    statusText.textContent = "หยุดการวิเคราะห์แล้ว";
    subStatus.textContent  = "กดเริ่มวิเคราะห์เพื่อทำใหม่";
  }
}

// ================= CENTER =================
function setCenter(mode){
  if (mode === "idle"){
    centerBadge.textContent = "พร้อม";
    centerTitle.textContent = "วางไข่ไว้ตรงกลางเพื่อเริ่มประเมิน";
    centerTimer.textContent = "";
  }
  if (mode === "ready"){
    centerBadge.textContent = "พร้อมทำงาน";
    centerTitle.textContent = "กดเริ่มวิเคราะห์เพื่อประเมินความเค็ม";
    centerTimer.textContent = "";
  }
  if (mode === "running"){
    centerBadge.textContent = "กำลังวิเคราะห์";
    centerTitle.textContent = "กำลังประมวลผลระดับความเค็มของไข่เค็ม";
  }
  if (mode === "done"){
    centerBadge.textContent = "เสร็จสิ้น";
    centerTitle.textContent = "ผลการประเมินพร้อมใช้งาน";
    centerTimer.textContent = "";
  }
}

// ================= RESULT =================
function renderResult(pct){
  let grade, desc, tips;

  if (pct < 35){
    grade = "ไม่เค็ม";
    desc  = "รสนุ่ม เค็มน้อย เหมาะสำหรับคนคุมโซเดียม";
    tips  = [
      "กินคู่ข้าวต้ม หรือโจ๊ก",
      "ใส่สลัด เพิ่มความมันนัว",
      "คลุกข้าวเบา ๆ รสกลมกล่อม"
    ];
  } else if (pct < 60){
    grade = "พอดี";
    desc  = "สมดุล เค็มกำลังดี รสอร่อย";
    tips  = [
      "ยำไข่เค็ม",
      "ผัดผักรวมใส่ไข่เค็ม",
      "กินกับข้าวสวยร้อน ๆ"
    ];
  } else {
    grade = "เค็มได้ที่";
    desc  = "รสจัด เข้มข้น เหมาะทำเมนูรสหนัก";
    tips  = [
      "ไข่เค็มผัดกุ้ง",
      "ซอสไข่เค็มราดของทอด",
      "กินคู่ผักสดช่วยตัดเค็ม"
    ];
  }

  gradeEl.textContent   = grade;
  saltPctEl.textContent = `${Math.round(pct)}%`;
  saltDescEl.textContent= desc;

  chipsEl.innerHTML = "";
  tips.forEach(t=>{
    const s = document.createElement("span");
    s.className = "chip";
    s.textContent = t;
    chipsEl.appendChild(s);
  });

  setStamp();
}

// ================= ACTIONS =================
function startAnalysis(){
  if (running) return;

  running = true;
  secondsLeft = 10;

  setStatus("running");
  setCenter("running");
  meterCaption.textContent = "กำลังตรวจสอบคุณภาพและแปลผลระดับความเค็ม";

  let progress = 0;
  setMeter(progress);
  centerTimer.textContent = `เหลือเวลา ${secondsLeft} วินาที`;

  timer = setInterval(()=>{
    if (!running) return;

    secondsLeft--;
    progress += 10;
    setMeter(progress);

    if (secondsLeft > 0){
      centerTimer.textContent = `เหลือเวลา ${secondsLeft} วินาที`;
    } else {
      // ===== FINISH =====
      running = false;
      clearInterval(timer);
      timer = null;

      // ⭐ หลอดเต็ม 100% เมื่อเสร็จสิ้น
      setMeter(100);

      const pct = 20 + Math.random() * 65;

      setStatus("done");
      setCenter("done");
      meterCaption.textContent = "ประมวลผลเสร็จสิ้น";

      renderResult(pct);
    }
  }, 1000);
}

function stopAnalysis(){
  if (running){
    running = false;
    clearInterval(timer);
    timer = null;
  }
  setStatus("stopped");
  setCenter("ready");
  meterCaption.textContent = "หยุดการวิเคราะห์แล้ว";
  centerTimer.textContent = "";
}

function clearData(){
  running = false;
  clearInterval(timer);
  timer = null;

  setStatus("ready");
  setCenter("ready");

  setMeter(0);
  meterCaption.textContent = "พร้อมทำงาน กดเริ่มวิเคราะห์เพื่อเริ่มประเมิน";

  gradeEl.textContent = "—";
  saltPctEl.textContent = "—";
  saltDescEl.textContent = "ยังไม่มีผลลัพธ์";

  chipsEl.innerHTML = `<span class="chip muted">รอผลวิเคราะห์เพื่อแนะนำเมนู</span>`;
  stampTimeEl.textContent = "—";
  centerTimer.textContent = "";
}

// ================= BIND =================
btnStart.addEventListener("click", startAnalysis);
btnStop.addEventListener("click", stopAnalysis);
btnClear.addEventListener("click", clearData);

// ================= INIT =================
setStatus("done");          // เปิดมาขึ้นประมวลผลเสร็จสิ้น
setCenter("idle");          // ไข่อยู่กลางจอ
meterCaption.textContent = "กด “เริ่มวิเคราะห์” เพื่อประเมินระดับความเค็ม";
