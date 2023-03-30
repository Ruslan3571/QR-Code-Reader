const wrapper = document.querySelector(".wrapper"),
  form = document.querySelector("form"),
  fileInp = document.querySelector("input"),
  infoText = form.querySelector("p"),
  copyBtn = wrapper.querySelector(".copy"),
  closeBtn = wrapper.querySelector(".close"),
  textarea = document.querySelector("textarea");

// function fetchRequest(formData, file) {
//   infoText.innerText = "Scanning QR Code...";
//   fetch("http://api.qrserver.com/v1/read-qr-code/", {
//     method: "POST",
//     body: formData,
//   })
//     .then((res) => res.json())
//     .then((result) => {
//       result = result[0].symbol[0].data;
//       infoText.innerText = result ? "Upload QR Code to Scan" : "Couldn`t Scan QR Code";
//       if (!result) return;
//       wrapper.querySelector("textarea").innerText = result;
//       form.querySelector("img").src = URL.createObjectURL(file);
//       wrapper.classList.add("active");
//     })
//     .catch(() => {
//       infoText.innerText = "Couldn`t Scan QR Code";
//     });
// }

async function fetchRequest(formData, file) {
  infoText.innerText = "Scanning QR Code...";
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  await delay(1000);
  try {
    const response = await fetch("http://api.qrserver.com/v1/read-qr-code/", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    const data = result[0].symbol[0].data;
    infoText.innerText = data ? "Upload QR Code to Scan" : "Couldnt Scan QR Code";
    if (!data) return;
    textarea.innerText = data;
    form.querySelector("img").src = URL.createObjectURL(file);
    wrapper.classList.add("active");
  } catch (error) {
    infoText.innerText = "Couldnt Scan QR Code";
  }
}


function clearData() {
  form.querySelector("img").src = "";
  textarea.innerText = "";
  infoText.innerText = "Upload QR Code to Scan";
}

fileInp.addEventListener("change", (e) => {
  clearData(); // очищення старих даних
  let file = e.target.files[0];
  if (!file) {
    return;
  }
  let formData = new FormData();
  formData.append("file", file);
  fetchRequest(formData, file);
});

copyBtn.addEventListener("click", () => {
  let text = wrapper.querySelector("textarea").textContent;
  navigator.clipboard.writeText(text);
  $.notify("Text Copied!", "success");
});

form.addEventListener("click", () => fileInp.click());
closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));
