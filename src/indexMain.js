// === 고정(제공) 대화문 예시 ===
const fixedDialogues = [
  { speaker: "교사", message: "120의 약수를 찾고 있구나. 그런데 아까 “이렇게 짝을 찾아봤더니 끝났다.” 그런 말이었지?" },
  { speaker: "학생", message: "아니요?" },
  { speaker: "교사", message: "(고개를 끄덕이며) 그래? 그럼 일단 네가 찾은 약수를 다 말해봐." },
  { speaker: "학생", message: "약수요?" },
  { speaker: "교사", message: "응. 120의 약수는 뭐라고 생각해?" },
  { speaker: "학생", message: "1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60, 120이요." },
  { speaker: "교사", message: "좋아. 잘 찾았네. 그런데 그게 진짜 전부라는 걸 어떻게 알 수 있지?" },
  { speaker: "학생", message: "혹시 제가 잘못한 건가요?" }
];

// === 유저 입력 대화 ===
let userDialogues = [];

// ----------------------
// UI 렌더링
// ----------------------
function renderDialogues() {
  // 고정 대화
  const fixedList = document.getElementById("fixed-dialogues");
  fixedList.innerHTML = "";
  fixedDialogues.forEach(d => {
    fixedList.innerHTML += `
      <li class="dialogue-item">
        <span class="speaker">${d.speaker}</span>
        <span class="message">${d.message}</span>
      </li>
    `;
  });

  // 유저 대화
  const userList = document.getElementById("user-dialogues");
  userList.innerHTML = "";
  userDialogues.forEach((d, i) => {
    userList.innerHTML += `
      <li class="dialogue-item" draggable="true" data-idx="${i}">
        <span class="speaker">${d.speaker}</span>
        <span class="message">${d.message}</span>
        <button class="action-btn move-up" title="위로 이동" ${i === 0 ? "disabled" : ""}>▲</button>
        <button class="action-btn move-down" title="아래로 이동" ${i === userDialogues.length-1 ? "disabled" : ""}>▼</button>
        <button class="action-btn delete" title="삭제">삭제</button>
      </li>
    `;
  });
}
renderDialogues();

// ----------------------
// 대화 추가
// ----------------------
document.getElementById("dialogue-form").addEventListener("submit", e => {
  e.preventDefault();
  const speaker = document.getElementById("speaker-input").value.trim();
  const message = document.getElementById("message-input").value.trim();
  if (!speaker || !message) return;
  userDialogues.push({ speaker, message });
  document.getElementById("speaker-input").value = "";
  document.getElementById("message-input").value = "";
  renderDialogues();
  // 커서를 발화자 입력란으로 이동
  document.getElementById("speaker-input").focus();

});

// ----------------------
// 대화 삭제/이동 (버튼)
// ----------------------
document.getElementById("user-dialogues").addEventListener("click", function(e) {
  const li = e.target.closest(".dialogue-item");
  if (!li) return;
  const idx = parseInt(li.dataset.idx);

  if (e.target.classList.contains("delete")) {
    userDialogues.splice(idx, 1);
    renderDialogues();
  }
  if (e.target.classList.contains("move-up") && idx > 0) {
    [userDialogues[idx-1], userDialogues[idx]] = [userDialogues[idx], userDialogues[idx-1]];
    renderDialogues();
  }
  if (e.target.classList.contains("move-down") && idx < userDialogues.length-1) {
    [userDialogues[idx], userDialogues[idx+1]] = [userDialogues[idx+1], userDialogues[idx]];
    renderDialogues();
  }
});

// ----------------------
// 드래그 앤 드롭 정렬
// ----------------------
let dragSrcIdx = null;
const userList = document.getElementById("user-dialogues");

userList.addEventListener("dragstart", function(e) {
  if (!e.target.classList.contains("dialogue-item")) return;
  dragSrcIdx = Number(e.target.dataset.idx);
  e.target.style.opacity = "0.4";
});

userList.addEventListener("dragend", function(e) {
  if (e.target.classList.contains("dialogue-item")) {
    e.target.style.opacity = "";
  }
  dragSrcIdx = null;
});

userList.addEventListener("dragover", function(e) {
  e.preventDefault();
  const li = e.target.closest(".dialogue-item");
  if (li) li.classList.add("drag-over");
});
userList.addEventListener("dragleave", function(e) {
  const li = e.target.closest(".dialogue-item");
  if (li) li.classList.remove("drag-over");
});

userList.addEventListener("drop", function(e) {
  e.preventDefault();
  const li = e.target.closest(".dialogue-item");
  if (!li) return;
  li.classList.remove("drag-over");
  const destIdx = Number(li.dataset.idx);
  if (dragSrcIdx !== null && dragSrcIdx !== destIdx) {
    const moved = userDialogues.splice(dragSrcIdx, 1)[0];
    userDialogues.splice(destIdx, 0, moved);
    renderDialogues();
  }
  dragSrcIdx = null;
});
