// 왼쪽(A): 기존 방식
const fixedDialoguesA = [
  { speaker: "교사", message: "120의 약수를 찾고 있구나. 그런데 아까 “이렇게 짝을 찾아봤더니 끝났다.” 그런 말이었지?" },
  { speaker: "학생", message: "아니요?" },
  { speaker: "교사", message: "(고개를 끄덕이며) 그래? 그럼 일단 네가 찾은 약수를 다 말해봐." },
  { speaker: "학생", message: "약수요?" },
  { speaker: "교사", message: "응. 120의 약수는 뭐라고 생각해?" },
  { speaker: "학생", message: "1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60, 120이요." },
  { speaker: "교사", message: "좋아. 잘 찾았네. 그런데 그게 진짜 전부라는 걸 어떻게 알 수 있지?" },
  { speaker: "학생", message: "혹시 제가 잘못한 건가요?" }
];
let userDialoguesA = [];

function renderDialoguesA() {
  // 고정 대화
  const fixedList = document.getElementById("fixed-dialogues-a");
  fixedList.innerHTML = "";
  fixedDialoguesA.forEach((d) => {
    fixedList.innerHTML += `
      <li class="dialogue-item">
        <span class="speaker">${d.speaker}</span>
        <span class="message">${d.message}</span>
      </li>
    `;
  });
  // 유저 대화
  const userList = document.getElementById("user-dialogues-a");
  userList.innerHTML = "";
  userDialoguesA.forEach((d, i) => {
    userList.innerHTML += `
      <li class="dialogue-item" draggable="true" data-idx="${i}">
        <span class="speaker">${d.speaker}</span>
        <span class="message">${d.message}</span>
        <button class="action-btn move-up" title="위로 이동" ${i === 0 ? "disabled" : ""}>▲</button>
        <button class="action-btn move-down" title="아래로 이동" ${i === userDialoguesA.length - 1 ? "disabled" : ""}>▼</button>
        <button class="action-btn delete" title="삭제">삭제</button>
      </li>
    `;
  });
}
renderDialoguesA();

document.getElementById("dialogue-form-a").addEventListener("submit", e => {
  e.preventDefault();
  const speaker = document.getElementById("speaker-input-a").value.trim();
  const message = document.getElementById("message-input-a").value.trim();
  if (!speaker || !message) return;
  userDialoguesA.push({ speaker, message });
  document.getElementById("speaker-input-a").value = "";
  document.getElementById("message-input-a").value = "";
  renderDialoguesA();
  document.getElementById("speaker-input-a").focus();
});

document.getElementById("user-dialogues-a").addEventListener("click", function(e) {
  const li = e.target.closest(".dialogue-item");
  if (!li) return;
  const idx = parseInt(li.dataset.idx);

  if (e.target.classList.contains("delete")) {
    userDialoguesA.splice(idx, 1);
    renderDialoguesA();
  }
  if (e.target.classList.contains("move-up") && idx > 0) {
    [userDialoguesA[idx - 1], userDialoguesA[idx]] = [userDialoguesA[idx], userDialoguesA[idx - 1]];
    renderDialoguesA();
  }
  if (e.target.classList.contains("move-down") && idx < userDialoguesA.length - 1) {
    [userDialoguesA[idx], userDialoguesA[idx + 1]] = [userDialoguesA[idx + 1], userDialoguesA[idx]];
    renderDialoguesA();
  }
});

let dragSrcIdxA = null;
const userListA = document.getElementById("user-dialogues-a");
userListA.addEventListener("dragstart", function(e) {
  if (!e.target.classList.contains("dialogue-item")) return;
  dragSrcIdxA = Number(e.target.dataset.idx);
  e.target.style.opacity = "0.4";
});
userListA.addEventListener("dragend", function(e) {
  if (e.target.classList.contains("dialogue-item")) e.target.style.opacity = "";
  dragSrcIdxA = null;
});
userListA.addEventListener("dragover", function(e) {
  e.preventDefault();
  const li = e.target.closest(".dialogue-item");
  if (li) li.classList.add("drag-over");
});
userListA.addEventListener("dragleave", function(e) {
  const li = e.target.closest(".dialogue-item");
  if (li) li.classList.remove("drag-over");
});
userListA.addEventListener("drop", function(e) {
  e.preventDefault();
  const li = e.target.closest(".dialogue-item");
  if (!li) return;
  li.classList.remove("drag-over");
  const destIdx = Number(li.dataset.idx);
  if (dragSrcIdxA !== null && dragSrcIdxA !== destIdx) {
    const moved = userDialoguesA.splice(dragSrcIdxA, 1)[0];
    userDialoguesA.splice(destIdx, 0, moved);
    renderDialoguesA();
  }
  dragSrcIdxA = null;
});

// ========== B 방식: Handsontable (엑셀형) ==========
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// 초기 데이터 (두 줄)
const excelData = [
  ['교사', '120의 약수를 찾고 있구나. 그런데 아까 “이렇게 짝을 찾아봤더니 끝났다.” 그런 말이었지?'],
  ['학생', '아니요?']
  ["교사", "(고개를 끄덕이며) 그래? 그럼 일단 네가 찾은 약수를 다 말해봐."],
  ["학생", "약수요?"],
  ["교사", "응. 120의 약수는 뭐라고 생각해?"],
  ["학생", "1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60, 120이요."],
  ["교사", "좋아. 잘 찾았네. 그런데 그게 진짜 전부라는 걸 어떻게 알 수 있지?"],
  ["학생", "혹시 제가 잘못한 건가요?"]
];

let hotB; // handsontable 인스턴스

function createExcelTableB() {
  const container = document.getElementById('excel-table-b');
  hotB = new Handsontable(container, {
    data: excelData,
    colHeaders: ['발화자', '대화'],
    rowHeaders: true,
    contextMenu: true,
    colWidths: [90, 260], // 예시, 상황에 맞게 조절
    minRows: 2,
    minCols: 2,
    licenseKey: 'non-commercial-and-evaluation',
    width: '100%',
    height: 'auto',
    stretchH: 'all',
    manualRowResize: true,
    manualColumnResize: true,
    autoWrapRow: true,
    autoWrapCol: true,
    autoRowSize: true,   // 이 옵션 추가!
    outsideClickDeselects: false,
  });

}

document.addEventListener('DOMContentLoaded', () => {
  createExcelTableB();
  document.getElementById('add-row-b').onclick = () => {
    const sel = hotB.getSelected();
    let insertAt = hotB.countRows();
    if (sel && sel.length > 0) {
      insertAt = sel[0][0] >= 0 ? sel[0][0] + 1 : hotB.countRows();
    }
    // 먼저 insert_row 시도
    try {
      hotB.alter('insert_row', insertAt, 1);
    } catch (e) {
      // 최신버전 호환용
      try {
        hotB.alter('insert_row_below', insertAt - 1, 1);
      } catch (e2) {
        alert("Handsontable 버전 호환 문제가 있습니다.");
      }
    }
  };
  document.getElementById('del-row-b').onclick = () => {
    const sel = hotB.getSelected();
    if (sel && sel[0][0] >= 0) hotB.alter('remove_row', sel[0][0]);
  };
});
